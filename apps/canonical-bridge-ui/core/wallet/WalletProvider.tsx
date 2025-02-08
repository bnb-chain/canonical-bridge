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
import {
  defaultSolanaConfig,
  phantomWallet,
  phantomWallet as solanaPhantomWallet,
  trustWallet as solanaTrustWallet,
} from '@node-real/walletkit/solana';
import React from 'react';
import { useDisclosure } from '@bnb-chain/space';
import { IChainConfig } from '@bnb-chain/canonical-bridge-widget';

import { env } from '@/core/env';
import { PreventingModal } from '@/core/wallet/components/PreventingModal';

interface WalletProviderProps {
  chainConfigs: IChainConfig[];
  children: React.ReactNode;
}

export function WalletProvider(props: WalletProviderProps) {
  const { children, chainConfigs } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const config = useMemo<WalletKitConfig>(() => {
    const evmWallets = [
      metaMask(),
      trustWallet(),
      binanceWeb3Wallet(),
      okxWallet(),
      walletConnect(),
    ];

    const tronWallets = [tronLink()];
    const solanaWallets = [solanaTrustWallet(), solanaPhantomWallet()];

    const tron = chainConfigs.find((e) => e.chainType === 'tron');
    const solana = chainConfigs.find((e) => e.chainType === 'solana');

    return {
      options: {
        useGridLayoutOnMobile: false,
        gridLayoutThreshold: 10,
        onClickWallet(wallet: BaseWallet) {
          if (isMobile()) {
            const isInDappBrowser = evmWallets.some((e) => e.isInstalled());

            if (isInDappBrowser) {
              if (
                binanceWeb3Wallet().isInstalled() &&
                phantomWallet().isInstalled() &&
                wallet.id === phantomWallet().id
              ) {
                onOpen();
                return false;
              }
              if (
                phantomWallet().isInstalled() &&
                metaMask().isInstalled() &&
                wallet.id === metaMask().id
              ) {
                onOpen();
                return false;
              }

              // Some wallets will set `isMetaMask=true`
              const counter = evmWallets.filter((e) => e.isInstalled()).length;
              if (
                (counter === 1 && wallet.isInstalled()) ||
                (counter > 1 && wallet.isInstalled() && wallet.id !== metaMask().id)
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
        walletConnectProjectId: env.WALLET_CONNECT_PROJECT_ID,
        wallets: evmWallets,
        chains: getEvmChains(chainConfigs),
      }),
      tronConfig: tron
        ? defaultTronConfig({
            autoConnect: true,
            wallets: tronWallets,
          })
        : undefined,
      solanaConfig: solana
        ? defaultSolanaConfig({
            autoConnect: true,
            rpcUrl: solana?.rpcUrls.default.http[0],
            wallets: solanaWallets,
          })
        : undefined,
    };
  }, [chainConfigs, onOpen]);

  return (
    <WalletKitProvider config={config} mode="light">
      {children}
      <PreventingModal isOpen={isOpen} onClose={onClose} />
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
        ...item,
        contracts: {
          ...evmChain?.contracts,
          ...item.contracts,
        },
      };
    });
}
