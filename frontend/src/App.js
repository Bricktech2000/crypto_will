import React from 'react';
import { Link } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { DARK_BLUE, BACKGROUND } from './theme';

import LandingPage from './pages/landingPage';
import CreateWill from './pages/createWill';
import ClaimWill from './pages/claimWill';
import RenewWill from './pages/renewWill';
import Debug from './pages/debug';
// import Debug from "./pages/debug";

function App() {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: BACKGROUND }} minHeight="100vh">
      <AppBar position="static" sx={{ backgroundColor: DARK_BLUE }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            sx={{ flexGrow: 1, textDecoration: 'none' }}
            to="/"
            color="inherit"
          >
            Legacy Protocol
          </Typography>

          <Button color="inherit" component={Link} to="/claim">
            Claim Will
          </Button>
          <Button color="inherit" component={Link} to="/renew">
            Renew will
          </Button>
        </Toolbar>
      </AppBar>
      <Box>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateWill />} />
          <Route path="/claim" element={<ClaimWill />} />
          <Route path="/renew" element={<RenewWill />} />
          <Route path="/debug" element={<Debug />} />
          {/* <Route path="/debug" element={<Debug />} /> */}
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
