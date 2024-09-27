import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { TIME } from '@/core/constants';
import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setIsLoadingTokenPrices, setTokenPrices } from '@/modules/aggregator/action';

interface TokenPricesContextProps {
  cmcPrices: Record<string, { price: number }>;
  llamaPrices: Record<string, { price: number }>;
}

interface ITokenPricesResponse {
  code: number;
  data: Record<string, { price: number }>;
}

export function TokenPricesProvider() {
  const { transferConfigEndpoint } = useBridgeConfig();

  const dispatch = useAppDispatch();

  const { isLoading, data } = useQuery<TokenPricesContextProps>({
    staleTime: TIME.MINUTE * 5,
    refetchInterval: TIME.MINUTE * 5,
    queryKey: ['token-prices'],
    queryFn: async () => {
      const [cmcRes, llamaRes] = await Promise.allSettled([
        axios.get<ITokenPricesResponse>(`${transferConfigEndpoint}/api/token/cmc`),
        axios.get<ITokenPricesResponse>(`${transferConfigEndpoint}/api/token/llama`),
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
    dispatch(setTokenPrices(data));
    dispatch(setIsLoadingTokenPrices(isLoading));
  }, [data, dispatch, isLoading]);

  return null;
}
