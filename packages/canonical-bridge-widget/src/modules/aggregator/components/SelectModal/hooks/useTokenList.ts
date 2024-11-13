import { useMemo } from 'react';
import { IBridgeToken, isSameAddress } from '@bnb-chain/canonical-bridge-sdk';

import { IBridgeTokenWithBalance } from '@/modules/aggregator/types';
import { useTokenPrice } from '@/modules/aggregator/hooks/useTokenPrice';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useTokenBalance } from '@/modules/aggregator/hooks/useTokenBalance';
import { sortTokens } from '@/modules/aggregator/shared/sortTokens';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useTokenList(tokens: IBridgeToken[] = []) {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isLoadingTokenBalances = useAppSelector((state) => state.aggregator.isLoadingTokenBalances);
  const isLoadingTokenPrices = useAppSelector((state) => state.aggregator.isLoadingTokenPrices);

  const { transferConfig } = useAggregator();
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
      orders: transferConfig.order?.tokens,
    }).sort((a) => {
      return isSameAddress(a.address, selectedToken?.address) && a.isCompatible ? -1 : 0;
    });

    return sortedTokens;
  }, [
    transferConfig.order?.tokens,
    getTokenBalance,
    getTokenPrice,
    selectedToken?.address,
    tokens,
  ]);

  return { data: sortedTokens, isLoading: isLoadingTokenBalances || isLoadingTokenPrices };
}
