import { useAccount, useDisconnect } from 'wagmi';
import { useCallback } from 'react';

import { useEvmBalance } from '@/modules/wallet/hooks/useEvmBalance';

export function useCurrentWallet() {
  const evmAccount = useAccount();
  const evmBalance = useEvmBalance(evmAccount.address);

  const evmDisconnect = useDisconnect();

  const disconnect = useCallback(() => {
    if (evmAccount.isConnected) {
      evmDisconnect.disconnect();
    }
  }, [evmAccount.isConnected, evmDisconnect]);

  const walletType = 'evm';

  const commonProps = {
    disconnect,
    isEvmConnected: evmAccount.isConnected,
    walletType,
  };

  return {
    ...commonProps,
    walletId: evmAccount.connector?.id,
    isConnected: evmAccount.isConnected,
    address: evmAccount.address,
    chain: evmAccount.chain,
    balance: evmBalance.data,
  };
}
