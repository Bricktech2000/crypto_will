import React from "react";

import { BLUE, DARK } from "../theme";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function ClaimWill() {
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
          Sorry for your loss
        </Typography>
        <Typography fontSize="20px" marginTop="-10px" color={DARK}>
          Claim your assets now
        </Typography>

        <Button
          variant="contained"
          sx={{ backgroundColor: BLUE, marginTop: "20px" }}
          size="large"
          startIcon={<AccountBalanceWalletIcon size="large" />}
        >
          Claim
        </Button>
      </Box>
    </Box>
  );
}

export default ClaimWill;
