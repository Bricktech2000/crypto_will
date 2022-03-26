import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { DARK_BLUE, DARK, BACKGROUND } from "./theme";

import LandingPage from "./pages/landingPage";
import CreateWill from "./pages/createWill";
import Debug from "./pages/debug";

function App() {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: BACKGROUND }} minHeight="100vh">
      <AppBar position="static" sx={{ backgroundColor: DARK_BLUE }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            sx={{ flexGrow: 1, textDecoration: "none" }}
            to="/"
            color="inherit"
          >
            Legacy Protocol
          </Typography>
          <Button color="inherit">Assets</Button>
          <Button color="inherit">recipients</Button>
          <Button color="inherit">Prove Existense</Button>
        </Toolbar>
      </AppBar>
      <Box>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateWill />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
