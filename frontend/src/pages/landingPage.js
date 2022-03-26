import React from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { BACKGROUND, BLUE, DARK } from "../theme";

function LandingPage() {
  return (
    <Box
      width="100vw"
      height="100vh"
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
    </Box>
  );
}

export default LandingPage;
