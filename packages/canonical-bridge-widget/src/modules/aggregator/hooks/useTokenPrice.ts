import { useCallback } from 'react';

import { IBridgeToken } from '@/modules/aggregator/types';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useTokenPrice() {
  const tokenPrices = useAppSelector((state) => state.aggregator.tokenPrices);

  const getTokenPrice = useCallback(
    (params: IBridgeToken | { symbol?: string; address?: string } = {}) => {
      const tokenSymbol = (params as IBridgeToken).displaySymbol ?? params.symbol;
      const tokenAddress = params.address;

      if (tokenSymbol && tokenAddress) {
        const { cmcPrices, llamaPrices } = tokenPrices;

        const key1 = tokenSymbol.toLowerCase();
        const key2 = `${tokenSymbol.toLowerCase()}:${tokenAddress.toLowerCase()}`;

        let price =
          cmcPrices?.[key2]?.price ??
          llamaPrices?.[key2]?.price ??
          cmcPrices?.[key1]?.price ??
          llamaPrices?.[key1]?.price;

        if (price !== undefined) {
          price = Number(price);
        }

        return price;
      }
    },
    [tokenPrices],
  );

  return {
    getTokenPrice,
  };
}
