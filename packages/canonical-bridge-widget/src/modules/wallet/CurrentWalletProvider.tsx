import { useWalletKit } from '@node-real/walletkit';
import { TronWallet, useTronWallet } from '@node-real/walletkit/tron';
import React, { useCallback, useContext, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import { ChainType, IChainConfig } from '@/modules/aggregator';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { FormattedBalance, useEvmBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { useEvmSwitchChain } from '@/modules/wallet/hooks/useEvmSwitchChain';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useTronBalance } from '@/modules/wallet/hooks/useTronBalance';
import { useWalletModal } from '@/modules/wallet/hooks/useWalletModal';

export interface CurrentWalletContextProps {
  disconnect: () => void;
  linkWallet: (params: { chainType?: ChainType; initialChainId?: number }) => void;
  walletType: ChainType;
  isEvmConnected: boolean;
  isTronConnected: boolean;
  walletId?: string;
  isConnected: boolean;
  address?: string;
  balance?: FormattedBalance;
  chain?: IChainConfig;
  chainId?: number | string;
}

export const CurrentWalletContext = React.createContext({} as CurrentWalletContextProps);

export interface CurrentWalletProviderProps {
  children: React.ReactNode;
}

export function CurrentWalletProvider(props: CurrentWalletProviderProps) {
  const { children } = props;

  const evmAccount = useAccount();
  const evmBalance = useEvmBalance(evmAccount.address);

  const tronAccount = useTronAccount();
  const tronBalance = useTronBalance(tronAccount.address);

  const evmDisconnect = useDisconnect();
  const tronDisconnect = useTronWallet();

  const [walletType, setWalletType] = useState<ChainType>('evm');

  const tronWalletId = useTronWalletId();
  const { chainConfigs } = useAggregator();
  const { onOpen } = useWalletModal();

  const { switchChain } = useEvmSwitchChain({
    mutation: {
      onSuccess() {
        setWalletType('evm');
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
  }, [evmAccount.isConnected, evmDisconnect, tronAccount.isConnected, tronDisconnect]);

  const linkWallet = useCallback(
    async ({
      chainType = 'evm',
      initialChainId,
    }: {
      chainType?: ChainType;
      initialChainId?: number;
    }) => {
      if (
        walletType !== chainType ||
        (chainType === 'evm' && !evmAccount.isConnected) ||
        (chainType === 'tron' && !tronAccount.isConnected)
      ) {
        onOpen({
          initialChainId,
          onConnected({ wallet }) {
            setWalletType(wallet.walletType as ChainType);
          },
        });
      } else {
        if (walletType === 'evm' && initialChainId && evmAccount.chainId !== initialChainId) {
          switchChain({
            chainId: initialChainId,
          });
        }
      }
    },
    [
      evmAccount.chainId,
      evmAccount.isConnected,
      onOpen,
      switchChain,
      tronAccount.isConnected,
      walletType,
    ],
  );

  const commonProps = {
    disconnect,
    linkWallet,
    walletType,
    isEvmConnected: evmAccount.isConnected,
    isTronConnected: tronAccount.isConnected,
  };

  const tronChain = chainConfigs.find((e) => e.chainType === 'tron');
  const evmChain = chainConfigs.find((e) => e.chainType === 'evm' && e.id === evmAccount.chainId);

  let value: CurrentWalletContextProps;
  if (walletType === 'tron') {
    value = {
      ...commonProps,
      walletId: tronWalletId,
      isConnected: tronAccount.isConnected,
      address: tronAccount.address,
      balance: tronBalance.data,
      chain: tronChain,
      chainId: tronChain?.id,
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
