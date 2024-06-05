import '@node-real/walletkit/styles.css';

import { WalletKitProvider, getDefaultConfig } from '@node-real/walletkit';
import { WagmiConfig, createConfig, mainnet } from 'wagmi';
import {
  metaMask,
  trustWallet,
  walletConnect,
} from '@node-real/walletkit/wallets';

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'multichain-bridge',
    chains: [mainnet],
    connectors: [trustWallet(), metaMask(), walletConnect()],
  })
);

export interface EVMWalletProviderProps {
  children: React.ReactNode;
}

export function EVMWalletProvider(props: EVMWalletProviderProps) {
  const { children } = props;

  return (
    <WagmiConfig config={config}>
      <WalletKitProvider mode="light" options={{}}>
        {children}
      </WalletKitProvider>
    </WagmiConfig>
  );
}
