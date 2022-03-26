import React from "react";
import ReactDOM from "react-dom";

import { getChainOptions, WalletProvider } from "@terra-money/wallet-provider";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

getChainOptions().then((chainOptions) => {
  ReactDOM.render(
    <React.StrictMode>
      <WalletProvider {...chainOptions}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WalletProvider>
      ,
    </React.StrictMode>,
    document.getElementById("root")
  );
});
