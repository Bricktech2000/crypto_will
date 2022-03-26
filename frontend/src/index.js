import React from "react";
import ReactDOM from "react-dom";

import { getChainOptions, WalletProvider } from "@terra-money/wallet-provider";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Raleway, Arial",
  },
});

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <React.StrictMode>
      <WalletProvider {...chainOptions}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </StyledEngineProvider>
      </WalletProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
});
