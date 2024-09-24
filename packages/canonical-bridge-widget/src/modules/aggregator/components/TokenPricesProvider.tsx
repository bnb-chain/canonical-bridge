import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';

import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { TIME } from '@/core/constants';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setTokenPrices } from '@/modules/aggregator/action';
import { IBridgeToken } from '@/modules/aggregator/types';

interface TokenPricesContextProps {
  cmcPrices: Record<string, { price: number }>;
  llamaPrices: Record<string, { price: number }>;
}

interface ITokenPriceResponse {
  code: number;
  data: Record<string, { price: number }>;
}

export function TokenPricesProvider() {
  const { transferConfigEndpoint } = useBridgeConfig();

  const { isConnected } = useAccount();
  const dispatch = useAppDispatch();

  const { isLoading, data } = useQuery<TokenPricesContextProps>({
    enabled: isConnected,
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
