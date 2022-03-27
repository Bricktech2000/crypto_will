import React from "react";
import { Link } from "react-router-dom";

import sheeeesh from "../sheeeeesh"

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { BACKGROUND, BLUE, DARK } from "../theme";

function LandingPage() {
  return (
    <Box
      height="calc(100vh - 64px)"
      marginX={15}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      overflow="hidden"
      sx={{ backgroundColor: BACKGROUND }}
    >
      <Box>
        <Typography fontSize="70px" color={BLUE}>
          Control your legacy
        </Typography>
        <Typography fontSize="25px" marginTop="-10px" color={DARK}>
          Generate a secure will for your crypto assets
        </Typography>
        <Box mt={6}>
          <Button
            variant="contained"
            sx={{ backgroundColor: BLUE }}
            size="large"
            component={Link}
            onClick={sheeeesh}
            to="/create"
          >
            Get Started
          </Button>
        </Box>
      </Box>
      <Box>
        <img src="/contract.png" width="400px" height="400px" />
      </Box>
    </Box>
  );
}

export default LandingPage;
