import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { IBridgeToken } from '@/modules/aggregator/types';
import { useTokenBalances } from '@/modules/transfer/components/SelectModal/hooks/useTokenBalances';
import { useTokenPrices } from '@/modules/transfer/components/SelectModal/hooks/useTokenPrices';
import { useAppSelector } from '@/modules/store/StoreProvider';

interface IBridgeTokenWithBalance extends IBridgeToken {
  balance: number | undefined;
  value: number | undefined;
}

export function useTokenList(tokens: IBridgeToken[] = []) {
  const { config } = useAggregator();

  const { chainId, isConnected } = useAccount();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const isEnabled = chainId === fromChain?.id && isConnected;

  const { isLoading, data: tokenBalances } = useTokenBalances(tokens, isEnabled);
  const { data: tokenPrices } = useTokenPrices(tokens, isEnabled);

  const data = useMemo(() => {
    const tokenOrder = config.order.tokens.map((item) => item.toUpperCase());
    return tokens
      .map((item) => {
        const rawBalance = tokenBalances?.[item.displaySymbol];
        const price = tokenPrices?.[item.displaySymbol];

        let balance: number | undefined;
        if (rawBalance !== undefined) {
          balance = Number(formatUnits(rawBalance, item.decimals));
        }
        let value: number | undefined;
        if (balance !== undefined && price !== undefined) {
          value = balance * price;
        }

        return {
          ...item,
          balance,
          value,
        } as IBridgeTokenWithBalance;
      })
      .sort((a, b) => {
        const isA = isChainOrTokenCompatible(a);
        const isB = isChainOrTokenCompatible(b);

        if (isA && !isB) {
          return -1;
        }
        if (!isA && isB) {
          return 1;
        }

        const indexA = tokenOrder.indexOf(a.displaySymbol.toUpperCase());
        const indexB = tokenOrder.indexOf(b.displaySymbol.toUpperCase());

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
  }, [config.order.tokens, tokenBalances, tokenPrices, tokens]);

  return {
    data,
    isLoading,
  };
}
