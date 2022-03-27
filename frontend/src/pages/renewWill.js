import React, { useState, useEffect } from 'react';

import { BLUE, DARK } from '../theme';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CircularProgress from '@mui/material/CircularProgress';

import { useConnectedWallet } from '@terra-money/wallet-provider';

import * as execute from '../contract/execute';
import * as query from '../contract/query';
import { ConnectWallet } from '../components/ConnectWallet';

function RenewWill({ createAlert }) {
  const [loading, setLoading] = useState(false);

  const connectedWallet = useConnectedWallet();

  const renewClicked = async () => {
    if (connectedWallet) {
      try {
        await execute.reset_timestamp(connectedWallet);
        createAlert('Will Renewed', 'success');
      } catch (err) {
        createAlert('Transaction Failed', 'error');
      }
    } else {
      createAlert('Wallet is Disconnected', 'error');
    }
    setLoading(false);
  };

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

  return (
    <Box
      marginX={15}
      paddingTop={6}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="75vh"
    >
      <Box>
        <Typography fontSize="50px" color={BLUE}>
          Renew your will
        </Typography>
        <Typography fontSize="20px" marginTop="-10px" color={DARK}>
          Reset the time until distribution
        </Typography>

        <Button
          variant="contained"
          sx={{ backgroundColor: BLUE, marginTop: '20px' }}
          size="large"
          startIcon={<AccountBalanceWalletIcon size="large" />}
          onClick={renewClicked}
        >
          Renew
        </Button>
      </Box>
    </Box>
  );
}

export default RenewWill;
