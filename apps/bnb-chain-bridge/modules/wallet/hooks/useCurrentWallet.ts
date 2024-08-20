import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWallets } from '@node-real/walletkit';
import { SolanaWallet } from '@node-real/walletkit/solana';

import { useAppSelector } from '@/core/store/hooks';
import { useEvmBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useSolanaBalance } from '@/modules/wallet/hooks/useSolanaBalance';

export function useCurrentWallet() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const evmAccount = useAccount();
  const evmBalance = useEvmBalance(evmAccount.address);

  const solanaAccount = useSolanaAccount();
  const solanaBalance = useSolanaBalance(solanaAccount.address);

  const solanaDisconnect = useWallet();
  const evmDisconnect = useDisconnect();

  const solanaWalletId = useSolanaWalletId();

  const disconnect = useCallback(() => {
    if (evmAccount.isConnected) {
      evmDisconnect.disconnect();
    }
    if (solanaAccount.isConnected) {
      setTimeout(() => {
        solanaDisconnect.disconnect();
      }, 50);
    }
  }, [evmAccount.isConnected, solanaAccount.isConnected]);

  let walletType = 'evm';
  if (solanaAccount.isConnected && (!evmAccount.isConnected || fromChain?.chainType === 'solana')) {
    walletType = 'solana';
  }

  const commonProps = {
    disconnect,
    isEvmConnected: evmAccount.isConnected,
    isSolanaConnected: solanaAccount.isConnected,
    walletType,
  };

  if (walletType === 'solana') {
    return {
      ...commonProps,
      walletId: solanaWalletId,
      isConnected: solanaAccount.isConnected,
      address: solanaAccount.address,
      chain: solanaAccount.chain,
      balance: solanaBalance.data,
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

function useSolanaWalletId() {
  const { wallets } = useWallets('solana');

  const { wallet } = useWallet();
  const target = (wallets as SolanaWallet[]).find(
    (item) => item.adapterName === wallet?.adapter.name,
  );

  return target?.id;
}
