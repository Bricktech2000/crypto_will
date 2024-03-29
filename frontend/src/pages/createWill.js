import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

import { BLUE, DARK } from '../theme';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Slider from '@mui/material/Slider';
import CircularProgress from '@mui/material/CircularProgress';

import { useConnectedWallet } from '@terra-money/wallet-provider';

import * as execute from '../contract/execute';
import * as query from '../contract/query';
import { ConnectWallet } from '../components/ConnectWallet';

function CreateWill({ createAlert }) {
  const [assets, setAssets] = useState(0);
  const [recipients, setRecipients] = useState(['']);
  const [recipientsPercentage, setRecipientsPercentage] = useState([100]);
  const [loading, setLoading] = useState(true);

  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    const fetch = async () => {
      if (connectedWallet) {
        try {
          const will = await query.get_will(
            connectedWallet,
            connectedWallet.walletAddress
          );
          console.log(will);
          setRecipients(will.recipients.map((obj) => obj.address));
          setRecipientsPercentage(will.recipients.map((obj) => obj.percentage));
          setAssets(will.assets / 1000000);
        } catch (err) {
          console.log('NO WILL CREATED');
        }
      }
      setLoading(false);
    };
    fetch();
  }, [connectedWallet]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="75vh"
      >
        <CircularProgress size="150px" />
      </Box>
    );

  const onSubmit = async () => {
    if (connectedWallet) {
      try {
        setLoading(true);
        console.log(
          await execute.set_recipients(
            connectedWallet,
            recipients.map((_, i) => ({
              address: recipients[i],
              percentage: recipientsPercentage[i],
            }))
          )
        );

        const current_assets =
          (await query.get_will(connectedWallet, connectedWallet.walletAddress))
            .assets / 1000000;

        console.log(
          await execute.set_assets(
            connectedWallet,
            assets,
            assets > current_assets ? assets - current_assets : 0
          )
        );
        createAlert('Will created', 'success');
      } catch (err) {
        console.log(err);
        createAlert('Transaction Failed', 'error');
      }
      setLoading(false);
    } else {
      createAlert('Wallet is Disconnected', 'error');
    }
  };

  const data = recipientsPercentage.map((percent, i) => {
    return {
      name: recipients[i],
      value: percent,
    };
  });

  const PercentageLeft = (index) => {
    let sum = 0;
    for (let i = 0; i < recipientsPercentage.length; i++) {
      if (i == index) continue;
      sum += recipientsPercentage[i];
    }
    return 100 - sum;
  };

  const addRecipient = () => {
    const newArray = [...recipients, ''];
    setRecipients(newArray);
    const newArray2 = [...recipientsPercentage, 0];
    setRecipientsPercentage(newArray2);
  };

  const removeRecipient = () => {
    let newArray = [...recipients];
    newArray.pop();
    setRecipients(newArray);
    let newArray2 = [...recipientsPercentage];
    newArray2.pop();
    setRecipientsPercentage(newArray2);
  };

  const setRecipientAddress = (index, address) => {
    let copy = [...recipients];
    copy[index] = address;
    setRecipients(copy);
  };

  const setRecipientPercentage = (index, percent) => {
    let copy = [...recipientsPercentage];
    copy[index] = percent;
    setRecipientsPercentage(copy);
  };

  return (
    <Box
      marginX={15}
      paddingTop={6}
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Box>
        <Typography fontSize="50px" color={BLUE}>
          Create your will
        </Typography>
        <Typography fontSize="20px" marginTop="-10px" color={DARK}>
          State the assets and recipients addresss for the will
        </Typography>
        <Box
          mt={2}
          display="flex"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-start"
            flexDirection="column"
            maxWidth="1200px"
          >
            <Typography color={BLUE} fontSize="30px" marginY={2}>
              Assets
            </Typography>
            <TextField
              label="Terra UST"
              value={assets}
              onChange={(e) => setAssets(parseFloat(e.target.value))}
              helperText="0.1% Fee"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      marginRight={1}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <img src="./terra-ust.png" width="25px" height="25px" />
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
            <Box overflowY="auto">
              <Box display="flex" marginY={2} justifyContent="space-between">
                <Typography color={BLUE} fontSize="30px">
                  Recipients
                </Typography>
                <Box>
                  <IconButton onClick={addRecipient}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={removeRecipient}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              </Box>

              {recipients.map((_, i) => {
                return (
                  <Box
                    display="flex"
                    justifyContent="center"
                    marginY={1}
                    key={i}
                    alignItems="center"
                    gap="20px"
                  >
                    <TextField
                      sx={{ width: '700px' }}
                      label={`Recipient ${i + 1}`}
                      value={recipients[i]}
                      onChange={(e) => setRecipientAddress(i, e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              marginRight={1}
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <AccountBalanceWalletIcon />
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Box width="33%">
                      <Typography>Share</Typography>
                      <Slider
                        defaultValue={100}
                        value={recipientsPercentage[i]}
                        onChange={(e) =>
                          setRecipientPercentage(i, e.target.value)
                        }
                        size="large"
                        valueLabelDisplay="on"
                        max={PercentageLeft(i)}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Button
              variant="contained"
              sx={{ backgroundColor: BLUE, marginTop: '20px' }}
              size="large"
              disabled={
                recipientsPercentage.reduce((a, b) => a + b, 0) != 100 ||
                !recipients.every((val) => val.startsWith('terra')) ||
                assets < 0
              }
              startIcon={<AccountBalanceWalletIcon size="large" />}
              onClick={onSubmit}
            >
              Generate
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Chart data={data} />
      </Box>
      <Box 
        
        mt={3} 
        position="absolute" 
        bottom="50px" 
        right="150px"
      >
        <Typography color={BLUE} fontSize="17px">
          
          SELECT CHARITY AS RECIPIENT
        </Typography>
        <Box
        >
           <Typography color={DARK} fontSize="15px">
           CHARITY NAME
        </Typography>
        <Typography color={DARK} fontSize="15px">
        wallet address
        </Typography>
        <Typography color={DARK} fontSize="15px">
           CHARITY NAME
        </Typography>
        <Typography color={DARK} fontSize="15px">
        wallet address
        </Typography>
        <Typography color={DARK} fontSize="15px">
           CHARITY NAME
        </Typography>
        <Typography color={DARK} fontSize="15px">
        wallet address
        </Typography>
        </Box>
        <Button
          href="https://www.angelprotocol.io/"
          sx={{ backgroundColor: BLUE, marginTop: '18px' }}
          variant = "contained"
          size="large"
        >
        CHOOSE A DIFFERENT CHARITY
        </Button>
      </Box>
    </Box>
  );
}

const Chart = ({ data }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" fontSize="30px" fontFamily="Raleway">
        {index == 0 ? '' : index}
      </text>
    );
  };

  const dataModified = [
    {
      name: 'empty',
      value: 100 - data.map((d) => d.value).reduce((a, b) => a + b, 0),
    },
    ...data,
  ];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={dataModified}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={150}
        fill={BLUE}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={index == 0 ? 'transparent' : BLUE}
          />
        ))}
      </Pie>
    </PieChart>
  );
};

export default CreateWill;
