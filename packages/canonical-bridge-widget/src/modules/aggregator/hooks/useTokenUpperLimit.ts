import { useMemo } from 'react';
import { parseUnits } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { useTokenPrice } from '@/modules/aggregator/providers/TokenPricesProvider';
import { useBridgeConfig } from '@/index';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { TIME } from '@/core/constants';

export function useTokenUpperLimit() {
  const { fetchTokenPrice } = useTokenPrice();

  const bridgeConfig = useBridgeConfig();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const { data: price } = useQuery({
    staleTime: TIME.MINUTE * 5,
    queryKey: ['tokenPrice', fromChain?.id, fromChain?.chainType, selectedToken?.address],
    queryFn: async () => {
      if (fromChain && selectedToken) {
        return (
          await fetchTokenPrice({
            chainId: fromChain?.id,
            chainType: fromChain?.chainType,
            tokenAddress: selectedToken?.address,
          })
        ).data;
      }
    },
  });

  const result = useMemo(() => {
    if (price !== undefined && selectedToken) {
      const upperLimit = bridgeConfig.transfer.dollarUpperLimit / price;
      const value = parseUnits(String(upperLimit), selectedToken.decimals);

      return {
        upperLimit,
        value,
        price,
        decimals: selectedToken.decimals,
      };
    }
  }, [bridgeConfig.transfer.dollarUpperLimit, price, selectedToken]);

  return result;
}
