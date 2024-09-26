import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { TIME } from '@/core/constants';
import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setTokenPrices } from '@/modules/aggregator/action';

interface TokenPriceContextProps {
  cmcPrices: Record<string, { price: number }>;
  llamaPrices: Record<string, { price: number }>;
}

interface ITokenPriceResponse {
  code: number;
  data: Record<string, { price: number }>;
}

export function TokenPriceProvider() {
  const { transferConfigEndpoint } = useBridgeConfig();

  const dispatch = useAppDispatch();

  const { isLoading, data } = useQuery<TokenPriceContextProps>({
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

      return {
        cmcPrices,
        llamaPrices,
      };
    },
  });

  useEffect(() => {
    if (!isLoading && data) {
      dispatch(setTokenPrices(data));
    }
  }, [data, dispatch, isLoading]);

  return null;
}
