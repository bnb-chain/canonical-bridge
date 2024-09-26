import { useAccount, useChains } from 'wagmi';

import { getTokenBalances } from '@/modules/aggregator/shared/getTokenBalances';
import { IBridgeToken } from '@/modules/aggregator/types';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { useTokenPrice } from '@/modules/aggregator/hooks/useTokenPrice';

export function useSortTokens() {
  const chains = useChains();
  const { address } = useAccount();
  const { config } = useAggregator();
  const { getTokenPrice } = useTokenPrice();

  return {
    async sortTokens<T extends IBridgeToken>({
      fromChainId,
      tokens,
    }: {
      fromChainId: number;
      tokens: T[];
    }) {
      const chain = chains.find((e) => e.id === fromChainId);

      const balances = await getTokenBalances({
        account: address,
        chain,
        tokens,
      });

      const tokenOrder = config.order.tokens.map((item) => item.toUpperCase());

      const sortedTokens = [...tokens].sort((a, b) => {
        const aSymbol = a.displaySymbol.toUpperCase();
        const bSymbol = b.displaySymbol.toUpperCase();

        const aPrice = getTokenPrice(a);
        const bPrice = getTokenPrice(b);

        const aBalance = balances[aSymbol];
        const bBalance = balances[bSymbol];

        const aValue = aPrice && aBalance ? aPrice * aBalance : 0;
        const bValue = bPrice && bBalance ? bPrice * bBalance : 0;

        const isA = isChainOrTokenCompatible(a);
        const isB = isChainOrTokenCompatible(b);

        if (isA && !isB) {
          return -1;
        }
        if (!isA && isB) {
          return 1;
        }
        if (isA && isB) {
          if (aValue && !bValue) {
            return -1;
          }
          if (!aValue && bValue) {
            return 1;
          }
          if (aValue && bValue) {
            return aValue - bValue;
          }
        }

        const indexA = tokenOrder.indexOf(aSymbol);
        const indexB = tokenOrder.indexOf(bSymbol);

        if (indexA > -1 && indexB === -1) {
          return -1;
        }
        if (indexA === -1 && indexB > -1) {
          return 1;
        }
        if (indexA > -1 && indexB > -1) {
          return indexA - indexB;
        }

        return a.displaySymbol < b.displaySymbol ? -1 : 1;
      });

      return sortedTokens;
    },
  };
}
