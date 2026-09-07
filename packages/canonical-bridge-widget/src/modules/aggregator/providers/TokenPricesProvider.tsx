import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { ChainType, isNativeToken } from '@bnb-chain/canonical-bridge-sdk';

import { useBridgeConfig } from '@/CanonicalBridgeProvider';
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
  const dispatch = useAppDispatch();
  const { fetchApiTokenPrices } = useTokenPrice();

  const { isLoading, data } = useQuery<TokenPricesContextProps>({
    staleTime: TIME.MINUTE * 5,
    refetchInterval: TIME.MINUTE * 5,
    queryKey: ['tokenPrices'],
    queryFn: async () => fetchApiTokenPrices(),
  });

  useEffect(() => {
    dispatch(setTokenPrices(data));
    dispatch(setIsLoadingTokenPrices(isLoading));
  }, [data, dispatch, isLoading]);

  return null;
}

export function useTokenPrice() {
  const tokenPrices = useAppSelector((state) => state.aggregator.tokenPrices);
  const bridgeConfig = useBridgeConfig();

  const { serverEndpoint } = bridgeConfig.http;

  const getTokenPrice = useCallback(
    ({
      chainId,
      chainType,
      tokenAddress,
      tokenSymbol,
    }: {
      chainId?: number;
      chainType?: ChainType;
      tokenAddress?: string;
      tokenSymbol?: string;
    } = {}) => {
      if (chainId && chainType && tokenAddress) {
        const { cmcPrices, llamaPrices } = tokenPrices;

        let key = '';
        const isNative = isNativeToken(tokenAddress, chainType);
        if (isNative) {
          // todo Arbitrum One ETH
          key = chainId === 42161 && tokenSymbol === 'ETH' ? '1' : `${chainId}`;
        } else {
          if (chainType === 'evm') {
            key = `${chainId}:${tokenAddress.toLowerCase()}`;
          } else {
            key = `${chainId}:${tokenAddress}`;
          }
        }

        const symbolKey = `1:${tokenSymbol?.toLowerCase()}`;
        let price =
          cmcPrices[key]?.price ??
          llamaPrices[key]?.price ??
          cmcPrices[symbolKey]?.price ??
          llamaPrices[symbolKey]?.price;

        if (price !== undefined) {
          price = Number(price);
        }

        return price;
      }
    },
    [tokenPrices],
  );

  const fetchApiTokenPrices = useCallback(async () => {
    const [cmcRes, llamaRes] = await Promise.allSettled([
      axios.get<ITokenPricesResponse>(`${serverEndpoint}/api/token/v2/cmc`),
      axios.get<ITokenPricesResponse>(`${serverEndpoint}/api/token/v2/llama`),
    ]);

    const cmcPrices = cmcRes.status === 'fulfilled' ? cmcRes.value.data.data : {};
    const llamaPrices = llamaRes.status === 'fulfilled' ? llamaRes.value.data.data : {};

    return {
      cmcPrices,
      llamaPrices,
    };
  }, [serverEndpoint]);

  const fetchTokenPrice = useCallback(
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
      const { data } = await axios.get<{ data: number }>(`${serverEndpoint}/api/token/v2/price`, {
        params: {
          chainId,
          tokenAddress: isNativeToken(tokenAddress, chainType) ? undefined : tokenAddress,
          tokenSymbol,
        },
      });
      return data;
    },
    [serverEndpoint],
  );

  return {
    getTokenPrice,
    fetchTokenPrice,
    fetchApiTokenPrices,
  };
}
