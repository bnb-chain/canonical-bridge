import { useEffect, useState } from 'react';

import { IBridgeToken } from '@/modules/aggregator/types';
import { useTokenPrice } from '@/modules/aggregator/hooks/useTokenPrice';
import { useTokenBalances } from '@/modules/aggregator/hooks/useTokenBalances';
import { useSortTokens } from '@/modules/aggregator/hooks/useSortTokens';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { isSameAddress } from '@/core/utils/address';

interface IBridgeTokenWithBalance extends IBridgeToken {
  balance: number | undefined;
  value: number | undefined;
}

export function useTokenList(tokens: IBridgeToken[] = [], isEnabled = true) {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { isLoading, data: tokenBalances } = useTokenBalances(tokens);
  const { getTokenPrice } = useTokenPrice();
  const { sortTokens } = useSortTokens();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const [sortedTokens, setSortedTokens] = useState<IBridgeTokenWithBalance[]>([]);
  useEffect(() => {
    if (!isEnabled || !fromChain) {
      return;
    }

    const updateTokens = async () => {
      const tmpTokens = tokens.map((item) => {
        const balance = tokenBalances?.[item.displaySymbol.toUpperCase()];
        const price = getTokenPrice(item);

        let value: number | undefined;
        if (balance !== undefined && price !== undefined) {
          value = balance * price;
        }

        return {
          ...item,
          balance,
          value,
        } as IBridgeTokenWithBalance;
      });

      const sortedTokens = (
        await sortTokens({
          fromChainId: fromChain.id,
          tokens: tmpTokens,
        })
      ).sort((a) => {
        if (isSameAddress(a.address, selectedToken?.address)) {
          return -1;
        }
        return 0;
      });

      setSortedTokens(sortedTokens);
    };

    updateTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromChain, tokenBalances, tokens, isEnabled, selectedToken?.address]);

  return {
    data: sortedTokens,
    isLoading,
  };
}
