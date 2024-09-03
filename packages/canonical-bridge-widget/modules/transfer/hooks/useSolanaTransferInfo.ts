import { useMemo } from 'react';

import { isEvmAddress, isSolanaAddress } from '@/core/utils/address';
import { useAppSelector } from '@/core/store/hooks';

export function useSolanaTransferInfo() {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const toAccount = useAppSelector((state) => state.transfer.toAccount);

  const result = useMemo(() => {
    const isSolanaTransfer =
      (selectedToken && fromChain?.chainType == 'solana' && toChain) ||
      (toChain?.chainType === 'solana' && fromChain);

    const isAvailableAccount =
      (fromChain?.chainType == 'solana' && isEvmAddress(toAccount.address)) ||
      (toChain?.chainType === 'solana' && isSolanaAddress(toAccount.address));

    return {
      isSolanaTransfer,
      isAvailableAccount,
    };
  }, [fromChain, selectedToken, toAccount.address, toChain]);

  return result;
}
