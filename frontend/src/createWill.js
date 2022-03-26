import React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { BACKGROUND, BLUE, DARK_BLUE, DARK } from './theme';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function CreateWill() {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      sx={{ backgroundColor: BACKGROUND }}
    >
      <Box
        marginX={15}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        zIndex={5}
      >
        <Box maxWidth="800px">
          <Typography fontSize="65px" color={BLUE}>
            Generate a will
          </Typography>
          <Typography fontSize="25px" marginTop="-10px" color={DARK}>
            A empty will must first be created using your address. Once created,
            you can add the assets on your will and your recipient.
          </Typography>
          <Box mt={6}>
            <Button
              variant="contained"
              sx={{ backgroundColor: BLUE }}
              size="large"
              component={Link}
              to="/create"
            >
              <Box
                marginRight={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <AccountBalanceWalletIcon size="large" />
              </Box>
              Generate
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CreateWill;
