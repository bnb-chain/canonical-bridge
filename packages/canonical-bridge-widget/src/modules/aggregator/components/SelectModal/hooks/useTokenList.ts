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
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isLoadingTokenBalances = useAppSelector((state) => state.aggregator.isLoadingTokenBalances);
  const isLoadingTokenPrices = useAppSelector((state) => state.aggregator.isLoadingTokenPrices);

  const { getTokenBalance } = useTokenBalance();
  const { getTokenPrice } = useTokenPrice();

  const sortedTokens = useMemo(() => {
    const tmpTokens = tokens.map((item) => {
      const balance = getTokenBalance(item);
      const price = getTokenPrice({
        chainId: fromChain?.id,
        chainType: fromChain?.chainType,
        tokenAddress: item?.address,
        tokenSymbol: item.symbol,
      });

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
    }).sort((a) => {
      return isSameAddress(a.address, selectedToken?.address) && a.isCompatible ? -1 : 0;
    });

    return sortedTokens;
  }, [
    tokens,
    getTokenBalance,
    getTokenPrice,
    fromChain?.id,
    fromChain?.chainType,
    selectedToken?.address,
  ]);

  return { data: sortedTokens, isLoading: isLoadingTokenBalances || isLoadingTokenPrices };
}
