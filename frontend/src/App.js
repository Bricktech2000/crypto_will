import "./App.css";

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { DARK_BLUE, DARK } from "./theme";

import LandingPage from "./pages/landingPage";
import CreateWill from "./pages/createWill";

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: DARK_BLUE }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Legacy Protocol
          </Typography>
          <Button color="inherit">Assets</Button>
          <Button color="inherit">Benefactors</Button>
          <Button color="inherit">Prove Existense</Button>
        </Toolbar>
      </AppBar>
      <Box width="100vw" height="calc(100vh - 64px)">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateWill />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
