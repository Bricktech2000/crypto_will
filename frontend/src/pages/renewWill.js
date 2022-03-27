import React from "react";

import { BLUE, DARK } from "../theme";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function RenewWill() {
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
          sx={{ backgroundColor: BLUE, marginTop: "20px" }}
          size="large"
          startIcon={<AccountBalanceWalletIcon size="large" />}
        >
          Renew
        </Button>
      </Box>
    </Box>
  );
}

export default RenewWill;
