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
      tokenSymbol,
    }: {
      chainId: number;
      chainType: ChainType;
      tokenAddress: string;
      tokenSymbol: string;
    }) => {
      const { data: price } = await fetchTokenPrice({
        chainId,
        chainType,
        tokenAddress,
        tokenSymbol,
      });
      return price;
    },
    [fetchTokenPrice],
  );

  return { validateTokenPrice };
};
