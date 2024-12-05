import { useCallback } from 'react';

import { IBridgeToken } from '@/modules/aggregator/types';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useTokenBalance() {
  const tokenBalances = useAppSelector((state) => state.aggregator.tokenBalances);

  const getTokenBalance = useCallback(
    (params: IBridgeToken | { address?: string } = {}) => {
      const tokenAddress = (params as IBridgeToken).address ?? params.address;

      if (tokenAddress) {
        return tokenBalances[tokenAddress.toLowerCase()];
      }
    },
    [tokenBalances],
  );

  return {
    getTokenBalance,
  };
}
