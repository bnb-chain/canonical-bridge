import { useAccount } from 'wagmi';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';

export function useIsWalletCompatible() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const evmAccount = useAccount();
  const tronAccount = useTronAccount();
  const solanaAccount = useSolanaAccount();

  const isCompatible =
    (fromChain?.chainType === 'evm' && evmAccount.isConnected) ||
    (fromChain?.chainType === 'tron' && tronAccount.isConnected) ||
    (fromChain?.chainType === 'solana' && solanaAccount.isConnected);

  return isCompatible;
}
