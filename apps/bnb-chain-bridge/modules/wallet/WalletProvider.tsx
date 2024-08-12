import { WalletKitProvider, getDefaultConfig } from '@node-real/walletkit';
import { WagmiConfig, createConfig } from 'wagmi';
import {
  binanceWeb3Wallet,
  metaMask,
  okxWallet,
  trustWallet,
  walletConnect,
} from '@node-real/walletkit/wallets';
import { useMemo } from 'react';

import { APP_NAME } from '@/core/configs/app';
import { useAppSelector } from '@/core/store/hooks';

export interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider(props: WalletProviderProps) {
  const { children } = props;

  const chains = useAppSelector((state) => state.bridges.evmConnectData);

  const config = useMemo(() => {
    return createConfig(
      getDefaultConfig({
        autoConnect: true,
        appName: APP_NAME,
        chains,
        connectors: [trustWallet(), metaMask(), okxWallet(), binanceWeb3Wallet(), walletConnect()],
      }),
    );
  }, [chains]);

  return (
    <WagmiConfig config={config}>
      <WalletKitProvider mode="light" options={{}}>
        {children}
      </WalletKitProvider>
    </WagmiConfig>
  );
}
