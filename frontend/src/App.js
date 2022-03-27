import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import { useWallet, WalletStatus } from '@terra-dev/use-wallet';

import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Icon from '@mui/material/Icon';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { DARK_BLUE, BACKGROUND } from './theme';

import LandingPage from './pages/landingPage';
import CreateWill from './pages/createWill';
import ClaimWill from './pages/claimWill';
import RenewWill from './pages/renewWill';
import Debug from './pages/debug';

function App() {
  const { status, connect, disconnect } = useWallet();
  const [alert, setAlert] = useState(null);

  const createAlert = (reason, type) => {
    setAlert({ reason, type });
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setAlert(null);
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: BACKGROUND }} minHeight="100vh">
      <AppBar position="static" sx={{ backgroundColor: DARK_BLUE }}>
        <Toolbar>
          <Icon>
            <img style={{ height: '100%' }} src="logo.svg" />
          </Icon>
          <Typography
            variant="h6"
            component={Link}
            sx={{ flexGrow: 1, textDecoration: 'none' }}
            to="/"
            color="inherit"
          >
            egacy Protocol
          </Typography>

          <Button color="inherit" component={Link} to="/claim">
            Claim Will
          </Button>
          <Button color="inherit" component={Link} to="/renew">
            Renew will
          </Button>
          <IconButton
            onClick={() => {
              if (status === WalletStatus.WALLET_CONNECTED) {
                disconnect('CHROME_EXTENSION');
                createAlert('Wallet Disconnected', 'error');
              } else {
                connect('CHROME_EXTENSION');
                createAlert('Wallet Connected', 'success');
              }
            }}
          >
            {status === WalletStatus.WALLET_CONNECTED ? (
              <CloseIcon sx={{ color: 'white', fontSize: '30px' }} />
            ) : (
              <AccountBalanceWalletIcon
                sx={{ color: 'white', fontSize: '30px' }}
              />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/create"
            element={<CreateWill createAlert={createAlert} />}
          />
          <Route
            path="/claim"
            element={<ClaimWill createAlert={createAlert} />}
          />
          <Route
            path="/renew"
            element={<RenewWill createAlert={createAlert} />}
          />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </Box>
      <Snackbar
        open={alert != null}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={alert?.type}
          sx={{ width: '100%' }}
        >
          {alert?.reason}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default App;
