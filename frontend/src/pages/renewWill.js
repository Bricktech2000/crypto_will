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

const TimeBetweenRenew = 1000 * 60 * 60 * 24 * 365;

function RenewWill({ createAlert }) {
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState();
  const [countdown, setCountdown] = useState();
  // console.log(countdown);

  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    const animate = () => {
      const unix =
        (time / (1000 * 1000) + TimeBetweenRenew - new Date()) / 1000;
      if (unix < 0) return;

      requestAnimationFrame(animate);

      const daysLeft = Math.floor(unix / (24 * 60 * 60));
      const hoursLeft = Math.floor((unix % (24 * 60 * 60)) / (60 * 60));
      const minutesLeft = Math.floor((unix % (60 * 60)) / 60);
      const secondsLeft = Math.floor(unix % 60);

      setCountdown({
        days: daysLeft,
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft,
      });
    };
    if (time) {
      animate();
    }
  }, [time]);

  const fetch = async () => {
    if (connectedWallet) {
      try {
        const will = await query.get_will(
          connectedWallet,
          connectedWallet.walletAddress
        );
        console.log(will);
        setTime(will.timestamp);
      } catch (err) {
        console.log('Will not created');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [connectedWallet]);

  const renewClicked = async () => {
    if (connectedWallet) {
      try {
        await execute.reset_timestamp(connectedWallet);
        createAlert('Will Renewed', 'success');
      } catch (err) {
        createAlert('Transaction Failed', 'error');
      }
      await fetch();
    } else {
      createAlert('Wallet is Disconnected', 'error');
    }
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
        {countdown && (
          <Box>
            <Typography
              color={DARK}
              fontSize="20px"
            >{`${countdown.days}D : ${countdown.hours}H : ${countdown.minutes}M : ${countdown.seconds}S`}</Typography>
          </Box>
        )}

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
