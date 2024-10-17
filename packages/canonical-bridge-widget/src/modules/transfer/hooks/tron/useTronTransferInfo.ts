import { useMemo } from 'react';

import { isEvmAddress, isTronAddress } from '@/core/utils/address';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useTronTransferInfo() {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const toAccount = useAppSelector((state) => state.transfer.toAccount);

  const result = useMemo(() => {
    const isTronTransfer =
      (!!selectedToken && fromChain?.chainType == 'tron' && !!toChain) ||
      (toChain?.chainType === 'tron' && !!fromChain);

    const isAvailableAccount =
      (fromChain?.chainType == 'tron' && isEvmAddress(toAccount.address)) ||
      (toChain?.chainType == 'tron' && isTronAddress(toAccount.address));

    return {
      isTronTransfer,
      isAvailableAccount,
    };
  }, [fromChain, selectedToken, toAccount.address, toChain]);

  return result;
}
