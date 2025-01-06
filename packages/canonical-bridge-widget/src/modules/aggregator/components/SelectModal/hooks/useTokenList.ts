import { useMemo } from 'react';
import {
  IBridgeToken,
  IBridgeTokenWithBalance,
  isSameAddress,
} from '@bnb-chain/canonical-bridge-sdk';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { sortTokens } from '@/modules/aggregator/shared/sortTokens';
import { useTokenBalance } from '@/modules/aggregator/providers/TokenBalancesProvider';
import { useTokenPrice } from '@/modules/aggregator/providers/TokenPricesProvider';

export function useTokenList(tokens: IBridgeToken[] = [], keyword?: string) {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isLoadingTokenBalances = useAppSelector((state) => state.aggregator.isLoadingTokenBalances);
  const isLoadingTokenPrices = useAppSelector((state) => state.aggregator.isLoadingTokenPrices);

  const { getTokenBalance } = useTokenBalance();
  const { getTokenPrice } = useTokenPrice();

  const sortedTokens = useMemo(() => {
    const tmpTokens = tokens.map((item) => {
      const balance = getTokenBalance(item);
      const price = getTokenPrice(item);

      let value: number | undefined;
      if (balance !== undefined && price !== undefined) {
        value = Number(balance) * price;
      }

      return {
        ...item,
        balance,
        value,
      } as IBridgeTokenWithBalance;
    });

    const sortedTokens = sortTokens({
      tokens: tmpTokens,
      orders: [],
    }).sort((a) => {
      return isSameAddress(a.address, selectedToken?.address) && a.isCompatible ? -1 : 0;
    });

    return sortedTokens;
  }, [tokens, getTokenBalance, getTokenPrice, selectedToken?.address]);

  return { data: sortedTokens, isLoading: isLoadingTokenBalances || isLoadingTokenPrices };
}
