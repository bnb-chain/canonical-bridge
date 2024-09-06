import { PropsWithChildren, useMemo } from 'react';
import { WalletKitProvider, ConnectModal, WalletKitConfig } from '@node-real/walletkit';
import {
  trustWallet,
  metaMask,
  walletConnect,
  binanceWeb3Wallet,
  okxWallet,
} from '@node-real/walletkit/evm';

import { APP_NAME } from '@/core/configs/app';
import { ChainConfig, useBridgeConfigs } from '@/modules/bridges';

export function WalletProvider(props: PropsWithChildren) {
  const { children } = props;

  const { chainConfigs } = useBridgeConfigs();

  const config = useMemo(() => {
    const config: WalletKitConfig = {
      walletConfig: {
        autoConnect: true,
        metadata: {
          name: APP_NAME,
        },
        evmConfig: {
          initialChainId: 1,
          wallets: [metaMask(), trustWallet(), binanceWeb3Wallet(), okxWallet(), walletConnect()],
          chains: getEvmChains(chainConfigs),
        },
      },
      appearance: {
        mode: 'light',
        useGridLayoutOnMobile: false,
        gridLayoutThreshold: 10,
      },
    };
    return config;
  }, [chainConfigs]);

  return (
    <WalletKitProvider config={config}>
      {children}
      <ConnectModal />
    </WalletKitProvider>
  );
}

function getEvmChains(chainConfigs: ChainConfig[]) {
  return chainConfigs
    ?.filter((item) => item.chainType === 'evm')
    .map((item) => ({
      id: item.id,
      name: item.name,
      nativeCurrency: item.nativeCurrency,
      rpcUrls: {
        default: {
          http: [item.rpcUrl],
        },
        public: {
          http: [item.rpcUrl],
        },
      },
      blockExplorers: {
        default: {
          name: item.explorer.name,
          url: item.explorer.url,
        },
      },
    }));
}
