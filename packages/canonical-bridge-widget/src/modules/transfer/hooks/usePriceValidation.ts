import { useCallback } from 'react';

import { useBridgeConfig } from '@/index';
import { useTokenPrice } from '@/modules/aggregator/providers/TokenPricesProvider';

export const usePriceValidation = () => {
  const { fetchApiTokenPrices } = useTokenPrice();
  const bridgeConfig = useBridgeConfig();

  const validateTokenPrice = useCallback(
    async ({ tokenSymbol, tokenAddress }: { tokenSymbol: string; tokenAddress: string }) => {
      const { cmcPrices, llamaPrices } = await fetchApiTokenPrices(bridgeConfig);

      const key1 = `${tokenSymbol?.toLowerCase()}:${tokenAddress?.toLowerCase()}`;
      const key3 = tokenSymbol?.toLowerCase();
      const key2 = `ethereum:${key3}`;
      let price =
        cmcPrices?.[key1]?.price ??
        llamaPrices?.[key1]?.price ??
        cmcPrices?.[key2]?.price ??
        llamaPrices?.[key2]?.price ??
        cmcPrices?.[key3]?.price ??
        llamaPrices?.[key3]?.price;
      if (price !== undefined) {
        price = Number(price);
      }
      return price;
    },
    [bridgeConfig, fetchApiTokenPrices],
  );

  return { validateTokenPrice };
};
