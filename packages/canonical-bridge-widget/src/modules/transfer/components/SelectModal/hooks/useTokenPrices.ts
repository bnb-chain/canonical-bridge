import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { TIME } from '@/core/constants';
import { IBridgeToken } from '@/modules/aggregator/types';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';

interface ITokenPriceResponse {
  code: number;
  data: Record<string, { price: number }>;
}

export function useTokenPrices(tokens: IBridgeToken[], isEnabled = true) {
  const { transferConfigEndpoint } = useBridgeConfig();

  const result = useQuery<Record<string, number | undefined>>({
    enabled: isEnabled,
    staleTime: TIME.MINUTE * 5,
    refetchInterval: TIME.MINUTE * 5,
    queryKey: ['token-prices'],
    queryFn: async () => {
      const [cmcRes, llamaRes] = await Promise.allSettled([
        axios.get<ITokenPriceResponse>(`${transferConfigEndpoint}/api/token/cmc`),
        axios.get<ITokenPriceResponse>(`${transferConfigEndpoint}/api/token/llama`),
      ]);

      const cmcPrices = cmcRes.status === 'fulfilled' ? cmcRes.value.data.data : {};
      const llamaPrices = llamaRes.status === 'fulfilled' ? llamaRes.value.data.data : {};

      const prices: Record<string, number | undefined> = {};
      tokens.forEach((item) => {
        const key1 = item.displaySymbol.toLowerCase();
        const key2 = `${item.displaySymbol.toLowerCase()}:${item.address.toLowerCase()}`;

        prices[item.displaySymbol] =
          cmcPrices?.[key2]?.price ??
          llamaPrices?.[key2]?.price ??
          cmcPrices?.[key1]?.price ??
          llamaPrices?.[key1]?.price;

        if (prices[item.displaySymbol] !== undefined) {
          prices[item.displaySymbol] = Number(prices[item.displaySymbol]);
        }
      });

      return prices;
    },
  });

  return result;
}
