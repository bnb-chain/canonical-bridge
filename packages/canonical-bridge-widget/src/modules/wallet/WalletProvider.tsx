import { useMemo } from 'react';
import {
  WalletKitProvider,
  ConnectModal,
  WalletKitConfig,
  BaseWallet,
  isMobile,
} from '@node-real/walletkit';
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
import { useDisclosure, useIntl } from '@bnb-chain/space';

import { IChainConfig } from '@/modules/aggregator/types';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { CurrentWalletProvider } from '@/modules/wallet/CurrentWalletProvider';
import { StateModal } from '@/core/components/StateModal';
import { SwitchingTipsModal } from '@/modules/wallet/components/SwitchingTipsModal';

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider(props: WalletProviderProps) {
  const { children } = props;

  const bridgeConfig = useBridgeConfig();
  const { chainConfigs } = useAggregator();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { formatMessage } = useIntl();

  const config = useMemo<WalletKitConfig>(() => {
    const evmWallets = [
      metaMask(),
      trustWallet(),
      binanceWeb3Wallet(),
      okxWallet(),
      walletConnect(),
    ];
    const tronWallets = [tronLink()];

    return {
      options: {
        useGridLayoutOnMobile: false,
        gridLayoutThreshold: 10,
        onClickWallet(wallet: BaseWallet) {
          if (isMobile()) {
            const isInDappBrowser = evmWallets.some((e) => e.isInstalled());

            if (isInDappBrowser) {
              // Some wallets will set `isMetaMask=true`
              const counter = evmWallets.filter((e) => e.isInstalled()).length;
              if (
                (counter === 1 && wallet.isInstalled()) ||
                (counter > 1 && wallet.isInstalled() && wallet.id !== 'metaMask')
              ) {
                return true;
              } else {
                onOpen();
                return false;
              }
            }
          }
          return true;
        },
      },
      evmConfig: defaultEvmConfig({
        autoConnect: true,
        initialChainId: 1,
        walletConnectProjectId: bridgeConfig.wallet.walletConnectProjectId,
        metadata: {
          name: bridgeConfig.appName,
        },
        wallets: evmWallets,
        chains: getEvmChains(chainConfigs),
      }),
      tronConfig: defaultTronConfig({
        autoConnect: true,
        wallets: tronWallets,
      }),
    };
  }, [bridgeConfig.appName, bridgeConfig.wallet.walletConnectProjectId, chainConfigs, onOpen]);

  if (!config.evmConfig?.chains?.length) {
    return null;
  }

  return (
    <WalletKitProvider config={config} mode="light">
      <CurrentWalletProvider>
        {children}

        <StateModal
          title={formatMessage({ id: 'wallet.preventing-modal.title' })}
          description={formatMessage({ id: 'wallet.preventing-modal.desc' })}
          isOpen={isOpen}
          type="error"
          onClose={onClose}
        />

        <SwitchingTipsModal />
      </CurrentWalletProvider>
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
