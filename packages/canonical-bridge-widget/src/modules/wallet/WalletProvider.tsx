import { useMemo } from 'react';
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
import { defaultTronConfig, tronLink } from '@node-real/walletkit/tron';
import React from 'react';

import { IChainConfig } from '@/modules/aggregator/types';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { CurrentWalletProvider } from '@/modules/wallet/CurrentWalletProvider';

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider(props: WalletProviderProps) {
  const { children } = props;

  const bridgeConfig = useBridgeConfig();
  const { chainConfigs } = useAggregator();

  const config = useMemo<WalletKitConfig>(() => {
    return {
      options: {
        useGridLayoutOnMobile: false,
        gridLayoutThreshold: 10,
      },
      evmConfig: defaultEvmConfig({
        autoConnect: true,
        initialChainId: 1,
        walletConnectProjectId: bridgeConfig.wallet.walletConnectProjectId,
        metadata: {
          name: bridgeConfig.appName,
        },
        wallets: [metaMask(), trustWallet(), binanceWeb3Wallet(), okxWallet(), walletConnect()],
        chains: getEvmChains(chainConfigs),
      }),
      tronConfig: defaultTronConfig({
        autoConnect: false,
        wallets: [tronLink()],
      }),
    };
  }, [bridgeConfig.appName, bridgeConfig.wallet.walletConnectProjectId, chainConfigs]);

  if (!config.evmConfig?.chains?.length) {
    return null;
  }

  return (
    <WalletKitProvider config={config} mode="light">
      <CurrentWalletProvider>{children}</CurrentWalletProvider>
      <ConnectModal />
    </WalletKitProvider>
  );
}

function getEvmChains(chainConfigs: IChainConfig[]) {
  return chainConfigs
    .filter((e) => e.chainType === 'evm')
    .map((item) => {
      const evmChain = Object.values(allChains).find((e) => e.id === item.id);
      return {
        id: item.id as number,
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
