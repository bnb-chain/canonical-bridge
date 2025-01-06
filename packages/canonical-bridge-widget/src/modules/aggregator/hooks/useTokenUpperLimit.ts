import { useMemo } from 'react';
import { IBridgeToken } from '@bnb-chain/canonical-bridge-sdk';
import { parseUnits } from 'viem';

import { useTokenPrice } from '@/modules/aggregator/providers/TokenPricesProvider';
import { useBridgeConfig } from '@/index';

export function useTokenUpperLimit(token?: IBridgeToken) {
  const { getTokenPrice } = useTokenPrice();

  const bridgeConfig = useBridgeConfig();

  const result = useMemo(() => {
    if (!token) return;

    const price = getTokenPrice(token);
    if (price) {
      const upperLimit = bridgeConfig.transfer.dollarUpperLimit / price;
      const value = parseUnits(String(upperLimit), token.decimals);

      return {
        upperLimit,
        value,
        price,
        decimals: token.decimals,
      };
    }
  }, [bridgeConfig.transfer.dollarUpperLimit, getTokenPrice, token]);

  return result;
}
