import { useCallback } from 'react';
import { IBridgeToken } from '@bnb-chain/canonical-bridge-sdk';

import { useAppSelector } from '@/modules/store/StoreProvider';

export function useTokenBalance() {
  const tokenBalances = useAppSelector((state) => state.aggregator.tokenBalances);

  const getTokenBalance = useCallback(
    (params: IBridgeToken | { symbol?: string } = {}) => {
      const tokenSymbol = (params as IBridgeToken).displaySymbol ?? params.symbol;

      if (tokenSymbol) {
        return tokenBalances[tokenSymbol.toUpperCase()];
      }
    },
    [tokenBalances],
  );

  return {
    getTokenBalance,
  };
}
