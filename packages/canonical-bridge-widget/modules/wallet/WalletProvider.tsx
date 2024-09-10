import { PropsWithChildren, useMemo } from 'react';
import { WalletKitProvider, ConnectModal, WalletKitConfig } from '@node-real/walletkit';
import {
  trustWallet,
  metaMask,
  walletConnect,
  binanceWeb3Wallet,
  okxWallet,
  defaultEvmConfig,
} from '@node-real/walletkit/evm';

import { APP_NAME } from '@/core/configs/app';
import { ChainConfig, useBridgeConfigs } from '@/modules/bridges';

export function WalletProvider(props: PropsWithChildren) {
  const { children } = props;

  const { chainConfigs } = useBridgeConfigs();

  const config = useMemo(() => {
    const config: WalletKitConfig = {
      options: {
        useGridLayoutOnMobile: false,
        gridLayoutThreshold: 10,
      },
      evmConfig: defaultEvmConfig({
        autoConnect: true,
        walletConnectProjectId: 'e68a1816d39726c2afabf05661a32767',
        metadata: {
          name: APP_NAME,
        },
        initialChainId: 1,
        wallets: [metaMask(), trustWallet(), binanceWeb3Wallet(), okxWallet(), walletConnect()],
        chains: getEvmChains(chainConfigs),
      }),
    };
    return config;
  }, [chainConfigs]);

  return (
    <WalletKitProvider config={config} mode="light">
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
