import { useWallet, WalletStatus } from '@terra-dev/use-wallet'

import sheeeesh from "../sheeeeesh"

export const ConnectWallet = () => {
  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
    disconnect,
  } = useWallet()

  return (
    <div>
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <>
          {availableInstallTypes.map((connectType) => (
            <button
              key={`install-${connectType}`}
              onClick={() => { sheeeesh(); install(connectType) }}
              type="button"
            >
              Install {connectType}
            </button>
          ))}
          {availableConnectTypes.map((connectType) => (
            <button
              key={`connect-${connectType}`}
              onClick={() => { sheeeesh(); connect(connectType) }}
              type="button"
            >
              Connect {connectType}
            </button>
          ))}
        </>
      )}
      {status === WalletStatus.WALLET_CONNECTED && (
        <button onClick={() => { sheeeesh(); disconnect() }} type="button">
          Disconnect
        </button>
      )}
    </div>
  )
}
