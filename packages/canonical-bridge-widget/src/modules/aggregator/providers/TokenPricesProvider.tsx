import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { IBridgeToken } from '@bnb-chain/canonical-bridge-sdk';

import { useBridgeConfig } from '@/CanonicalBrideProvider';
import { TIME } from '@/core/constants';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
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
  const bridgeConfig = useBridgeConfig();
  const dispatch = useAppDispatch();

  const { isLoading, data } = useQuery<TokenPricesContextProps>({
    staleTime: TIME.MINUTE * 5,
    refetchInterval: TIME.MINUTE * 5,
    queryKey: ['tokenPrices'],
    queryFn: async () => {
      const { serverEndpoint } = bridgeConfig.http;

      const [cmcRes, llamaRes] = await Promise.allSettled([
        axios.get<ITokenPricesResponse>(`${serverEndpoint}/api/token/cmc`),
        axios.get<ITokenPricesResponse>(`${serverEndpoint}/api/token/llama`),
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
        const key3 = `ethereum:${key1}`;

        let price =
          cmcPrices?.[key2]?.price ??
          llamaPrices?.[key2]?.price ??
          cmcPrices?.[key1]?.price ??
          llamaPrices?.[key1]?.price ??
          cmcPrices?.[key3]?.price ??
          llamaPrices?.[key3]?.price;

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
