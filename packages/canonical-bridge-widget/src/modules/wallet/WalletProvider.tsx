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

import { IChainConfig } from '@/modules/aggregator/types';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';

interface WalletProviderProps {
  chainConfigs: IChainConfig[];
  children: React.ReactNode;
}

export function WalletProvider(props: WalletProviderProps) {
  const { chainConfigs, children } = props;

  const bridgeConfig = useBridgeConfig();
  const config = useMemo<WalletKitConfig>(
    () => ({
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
    }),
    [chainConfigs, bridgeConfig.appName, bridgeConfig.wallet.walletConnectProjectId],
  );

  if (!config.evmConfig?.chains?.length) {
    return null;
  }

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
