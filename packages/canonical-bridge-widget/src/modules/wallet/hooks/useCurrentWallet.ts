import { useAccount, useDisconnect } from 'wagmi';
import { useCallback } from 'react';
import { TronWallet, useTronWallet } from '@node-real/walletkit/tron';
import { useWalletKit } from '@node-real/walletkit';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useEvmBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useTronBalance } from '@/modules/wallet/hooks/useTronBalance';

export function useCurrentWallet() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const evmAccount = useAccount();
  const evmBalance = useEvmBalance(evmAccount.address);

  const tronAccount = useTronAccount();
  const tronBalance = useTronBalance(tronAccount.address);

  const evmDisconnect = useDisconnect();
  const tronDisconnect = useTronWallet();

  const tronWalletId = useTronWalletId();

  const disconnect = useCallback(() => {
    if (evmAccount.isConnected) {
      evmDisconnect.disconnect();
    }
    if (tronAccount.isConnected) {
      tronDisconnect.disconnect();
    }
  }, [evmAccount.isConnected, evmDisconnect, tronAccount.isConnected, tronDisconnect]);

  let walletType = 'evm';
  if (tronAccount.isConnected && (!evmAccount.isConnected || fromChain?.chainType === 'tron')) {
    walletType = 'tron';
  }

  const commonProps = {
    disconnect,
    isEvmConnected: evmAccount.isConnected,
    isTronConnected: tronAccount.isConnected,
    walletType,
  };

  if (walletType === 'tron') {
    return {
      ...commonProps,
      walletId: tronWalletId,
      isConnected: tronAccount.isConnected,
      address: tronAccount.address,
      balance: tronBalance.data,
      chain: undefined,
    };
  }

  return {
    ...commonProps,
    walletId: evmAccount.connector?.id,
    isConnected: evmAccount.isConnected,
    address: evmAccount.address,
    chain: evmAccount.chain,
    balance: evmBalance.data,
  };
}

function useTronWalletId() {
  const { tronConfig } = useWalletKit();
  const { wallet } = useTronWallet();

  const target = (tronConfig?.wallets as TronWallet[]).find(
    (item) => item.adapterName === wallet?.adapter.name,
  );

  return target?.id;
}
