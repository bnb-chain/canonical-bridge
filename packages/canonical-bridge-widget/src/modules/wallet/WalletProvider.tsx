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
import * as allChains from 'viem/chains';

import { env } from '@/core/configs/env';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { APP_NAME } from '@/core/constants';
import { IChainConfig } from '@/modules/aggregator/types';

export function WalletProvider(props: PropsWithChildren) {
  const { children } = props;

  const { chainConfigs } = useAggregator();

  const config = useMemo(() => {
    const config: WalletKitConfig = {
      options: {
        useGridLayoutOnMobile: false,
        gridLayoutThreshold: 10,
      },
      evmConfig: defaultEvmConfig({
        autoConnect: true,
        initialChainId: 1,
        walletConnectProjectId: env.WALLET_CONNECT_PROJECT_ID,
        metadata: {
          name: APP_NAME,
        },
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

function getEvmChains(chainConfigs: IChainConfig[]) {
  return chainConfigs.map((item) => {
    const evmChain = Object.values(allChains).find((e) => e.id === item.id);
    return {
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
      contracts: {
        ...evmChain?.contracts,
        ...item.contracts,
      },
    };
  });
}
