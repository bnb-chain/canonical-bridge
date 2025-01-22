import { useCallback } from 'react';
import { ChainType } from '@bnb-chain/canonical-bridge-sdk';

import { useTokenPrice } from '@/modules/aggregator/providers/TokenPricesProvider';

export const usePriceValidation = () => {
  const { fetchTokenPrice } = useTokenPrice();

  const validateTokenPrice = useCallback(
    async ({
      chainId,
      chainType,
      tokenAddress,
    }: {
      chainId: number;
      chainType: ChainType;
      tokenAddress: string;
    }) => {
      const { data: price } = await fetchTokenPrice({
        chainId,
        chainType,
        tokenAddress,
      });
      return price;
    },
    [fetchTokenPrice],
  );

  return { validateTokenPrice };
};
