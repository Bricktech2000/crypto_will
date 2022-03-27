import React, { useState } from 'react';

import { BLUE, DARK } from '../theme';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { useConnectedWallet } from '@terra-money/wallet-provider';

import * as execute from '../contract/execute';
import * as query from '../contract/query';

function ClaimWill({ createAlert }) {
  const [owner, setOwner] = useState('');
  const connectedWallet = useConnectedWallet();

  const claimClicked = async () => {
    if (connectedWallet) {
      try {
        console.log(await execute.distribute_assets(connectedWallet, owner));
        createAlert('Will Claimed', 'success');
      } catch (err) {
        createAlert('Transaction Failed', 'error');
      }
    } else {
      createAlert('Wallet is Disconnected', 'error');
    }
  };

  return (
    <Box
      marginX={15}
      paddingTop={6}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="75vh"
    >
      <Box display="flex" flexDirection="column">
        <Typography fontSize="50px" color={BLUE}>
          Sorry for your loss
        </Typography>
        <Typography fontSize="20px" marginTop="-10px" color={DARK}>
          Claim your assets now, input the will owner.
        </Typography>

        <TextField
          sx={{ width: '700px', marginTop: '50px' }}
          label="Owner address"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
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

        <Button
          variant="contained"
          sx={{ backgroundColor: BLUE, marginTop: '20px' }}
          size="large"
          startIcon={<AccountBalanceWalletIcon size="large" />}
          onClick={claimClicked}
          disabled={!owner?.startsWith('terra')}
        >
          Claim
        </Button>
      </Box>
    </Box>
  );
}

export default ClaimWill;
