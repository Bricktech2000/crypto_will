import { useEffect, useState } from 'react';
import {
  useWallet,
  useConnectedWallet,
  WalletStatus,
} from '@terra-money/wallet-provider';

import * as execute from '../contract/execute';
import * as query from '../contract/query';
import { ConnectWallet } from '../components/ConnectWallet';

function Debug() {
  const [updating, setUpdating] = useState(true);
  const [json, setJson] = useState('[]');

  const { status } = useWallet();

  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    const prefetch = async () => {
      if (connectedWallet) {
        // setCount((await query.getCount(connectedWallet)).count);
      }
      setUpdating(false);
    };
    prefetch();
  }, [connectedWallet]);

  const onClickSet = async () => {
    setUpdating(true);
    console.log(
      await execute.set_recipients(connectedWallet, JSON.parse(json))
    );
    console.log(
      await query.get_will(connectedWallet, connectedWallet.walletAddress)
    );
    setUpdating(false);
  };

  const onClickGet = async () => {
    setUpdating(true);
    console.log(
      await query.get_will(connectedWallet, connectedWallet.walletAddress)
    );
    setUpdating(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'inline' }}>
          {updating ? '(updating . . .)' : ''}
        </div>
        {status === WalletStatus.WALLET_CONNECTED && (
          <div style={{ display: 'inline' }}>
            <input
              type="text"
              onChange={(e) => setJson(e.target.value)}
              value={json}
            />
            <button onClick={onClickSet} type="button">
              {' '}
              set{' '}
            </button>
            <button onClick={onClickGet} type="button">
              {' '}
              get{' '}
            </button>
          </div>
        )}
        <ConnectWallet />
      </header>
    </div>
  );
}

export default Debug;
