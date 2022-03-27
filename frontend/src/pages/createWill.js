import React, { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

import { BLUE, DARK } from "../theme";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RemoveIcon from "@mui/icons-material/Remove";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Slider from "@mui/material/Slider";

function CreateWill() {
  const [assets, setAssets] = useState(0);
  const [recipients, setRecipients] = useState([""]);
  const [recipientsPercentage, setRecipientsPercentage] = useState([100]);

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
    const newArray = [...recipients, ""];
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
              onChange={(e) => setAssets(e.target.value)}
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
                      sx={{ width: "700px" }}
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
              sx={{ backgroundColor: BLUE, marginTop: "20px" }}
              size="large"
              disabled={
                recipientsPercentage.reduce((a, b) => a + b, 0) != 100 ||
                !recipients.every((val) => val.length > 10) ||
                assets <= 0
              }
              startIcon={<AccountBalanceWalletIcon size="large" />}
            >
              Generate
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Chart data={data} />
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
        {index + 1}
      </text>
    );
  };
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={150}
        fill={BLUE}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default CreateWill;
