import { BaseWallet, isMobile, useWalletKit } from '@node-real/walletkit';
import { TronWallet, useTronWallet } from '@node-real/walletkit/tron';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { SolanaWallet, useSolanaWallet } from '@node-real/walletkit/solana';
import { ChainType, IChainConfig } from '@bnb-chain/canonical-bridge-sdk';

import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { FormattedBalance, useEvmBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { useEvmSwitchChain } from '@/modules/wallet/hooks/useEvmSwitchChain';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useTronBalance } from '@/modules/wallet/hooks/useTronBalance';
import { useWalletModal } from '@/modules/wallet/hooks/useWalletModal';
import { useTronSwitchChain } from '@/modules/wallet/hooks/useTronSwitchChain';
import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setIsOpenSwitchingTipsModal } from '@/modules/wallet/action';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useSolanaBalance } from '@/modules/wallet/hooks/useSolanaBalance';

const KEY_LAST_CONNECTED_WALLET_TYPE = 'lastConnectedWalletType';

export interface CurrentWalletContextProps {
  disconnect: () => void;
  linkWallet: (params: { targetChainType?: ChainType; targetChainId?: number }) => void;
  walletType: ChainType;
  isEvmConnected: boolean;
  isTronConnected: boolean;
  walletId?: string;
  isConnected: boolean;
  address?: string;
  balance?: FormattedBalance;
  chain?: IChainConfig;
  chainId?: number;
}

export const CurrentWalletContext = React.createContext({} as CurrentWalletContextProps);

export interface CurrentWalletProviderProps {
  children: React.ReactNode;
}

export function CurrentWalletProvider(props: CurrentWalletProviderProps) {
  const { children } = props;

  const dispatch = useAppDispatch();

  const evmAccount = useAccount();
  const evmBalance = useEvmBalance();

  const tronAccount = useTronAccount();
  const tronBalance = useTronBalance();

  const solanaAccount = useSolanaAccount();
  const solanaBalance = useSolanaBalance();

  const evmDisconnect = useDisconnect();
  const tronDisconnect = useTronWallet();
  const solanaDisconnect = useSolanaWallet();

  const [walletType, setWalletType] = useState<ChainType>('evm');
  useEffect(() => {
    const lastConnectedWalletType = localStorage.getItem(KEY_LAST_CONNECTED_WALLET_TYPE) || 'evm';
    setWalletType(lastConnectedWalletType as ChainType);
  }, []);

  const tronWalletId = useTronWalletId();
  const solanaWalletId = useSolanaWalletId();

  const { chainConfigs } = useAggregator();
  const { onOpen } = useWalletModal();

  const { switchChain: switchEvmChain } = useEvmSwitchChain({
    mutation: {
      onSuccess() {
        setWalletType('evm');
      },
    },
  });

  const { switchChain: switchTronChain } = useTronSwitchChain({
    mutation: {
      onSuccess() {
        setWalletType('tron');
      },
    },
  });

  const disconnect = useCallback(() => {
    if (evmAccount.isConnected) {
      evmDisconnect.disconnect();
    }
    if (tronAccount.isConnected) {
      tronDisconnect.disconnect();
    }
    if (solanaAccount.isConnected) {
      solanaDisconnect.disconnect();
    }
  }, [
    evmAccount.isConnected,
    evmDisconnect,
    solanaAccount.isConnected,
    solanaDisconnect,
    tronAccount.isConnected,
    tronDisconnect,
  ]);

  const linkWallet = useCallback(
    async ({
      targetChainType = 'evm',
      targetChainId,
    }: {
      targetChainType?: ChainType;
      targetChainId?: number;
    }) => {
      const onConnected = ({ wallet }: { wallet: BaseWallet }) => {
        const walletType = wallet.walletType as ChainType;

        localStorage.setItem(KEY_LAST_CONNECTED_WALLET_TYPE, walletType);
        setWalletType(walletType);
      };

      if (targetChainType === 'evm') {
        if (walletType !== targetChainType || !evmAccount.isConnected) {
          onOpen({
            evmConfig: {
              initialChainId: targetChainId,
            },
            onConnected,
          });
        } else if (targetChainId && evmAccount.chainId !== targetChainId) {
          switchEvmChain({
            chainId: targetChainId,
          });
        }
      }

      if (targetChainType === 'tron') {
        if (walletType !== targetChainType || !tronAccount.isConnected) {
          onOpen({
            tronConfig: {
              initialChainId: targetChainId,
            },
            onConnected,
          });
        } else if (targetChainId && tronAccount.chainId !== targetChainId) {
          if (isMobile()) {
            dispatch(setIsOpenSwitchingTipsModal(true));
          } else {
            switchTronChain({
              chainId: targetChainId,
            });
          }
        }
      }

      if (targetChainType === 'solana') {
        if (walletType !== targetChainType || !solanaAccount.isConnected) {
          onOpen({
            onConnected,
          });
        }
      }
    },
    [
      dispatch,
      evmAccount.chainId,
      evmAccount.isConnected,
      onOpen,
      solanaAccount.isConnected,
      switchEvmChain,
      switchTronChain,
      tronAccount.chainId,
      tronAccount.isConnected,
      walletType,
    ],
  );

  const evmChain = chainConfigs.find((e) => e.chainType === 'evm' && e.id === evmAccount.chainId);
  const tronChain = chainConfigs.find(
    (e) => e.chainType === 'tron' && e.id === tronAccount.chainId,
  );
  const solanaChain = chainConfigs.find((e) => e.chainType === 'solana');

  const commonProps = {
    disconnect,
    linkWallet,
    walletType,
    isEvmConnected: evmAccount.isConnected,
    isTronConnected: tronAccount.isConnected,
  };

  let value: CurrentWalletContextProps;
  if (walletType === 'tron') {
    value = {
      ...commonProps,
      walletId: tronWalletId,
      isConnected: tronAccount.isConnected,
      address: tronAccount.address,
      balance: tronBalance.data,
      chain: tronChain,
      chainId: tronAccount?.chainId,
    };
  } else if (walletType === 'solana') {
    value = {
      ...commonProps,
      walletId: solanaWalletId,
      isConnected: solanaAccount.isConnected,
      address: solanaAccount.address,
      balance: solanaBalance.data,
      chain: solanaChain,
      chainId: solanaAccount?.chainId,
    };
  } else {
    value = {
      ...commonProps,
      walletId: evmAccount.connector?.id,
      isConnected: evmAccount.isConnected,
      address: evmAccount.address,
      balance: evmBalance.data,
      chain: evmChain,
      chainId: evmAccount.chainId,
    };
  }

  return <CurrentWalletContext.Provider value={value}>{children}</CurrentWalletContext.Provider>;
}

export function useCurrentWallet() {
  return useContext(CurrentWalletContext);
}

function useTronWalletId() {
  const { tronConfig } = useWalletKit();
  const { wallet } = useTronWallet();

  const target = (tronConfig?.wallets as TronWallet[])?.find(
    (item) => item.adapterName === wallet?.adapter.name,
  );

  return target?.id;
}

function useSolanaWalletId() {
  const { solanaConfig } = useWalletKit();
  const { wallet } = useSolanaWallet();

  const target = (solanaConfig?.wallets as SolanaWallet[])?.find(
    (item) => item.adapterName === wallet?.adapter.name,
  );

  return target?.id;
}
