import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { useEffect } from 'react';

import { TIME } from '@/core/constants';
import { useTokens } from '@/modules/aggregator/hooks/useTokens';
import { getTokenBalances } from '@/modules/aggregator/shared/getTokenBalances';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setIsLoadingTokenBalances, setTokenBalances } from '@/modules/aggregator/action';

export function TokenBalancesProvider() {
  const { address } = useAccount();
  const chains = useChains();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const dispatch = useAppDispatch();

  const tokens = useTokens({
    fromChainId: fromChain?.id,
    toChainId: toChain?.id,
  });

  const { isLoading, data } = useQuery<Record<string, number | undefined>>({
    enabled: !!address && !!fromChain?.id && !!toChain?.id,
    refetchInterval: TIME.SECOND * 5,
    queryKey: ['tokenBalances', address, fromChain?.id, toChain?.id],
    queryFn: async () => {
      const chain = chains?.find((item) => item.id === fromChain?.id);
      const balances = await getTokenBalances({
        chain,
        account: address,
        tokens,
      });
      return balances;
    },
  });

  useEffect(() => {
    dispatch(setTokenBalances(data));
    dispatch(setIsLoadingTokenBalances(isLoading));
  }, [data, dispatch, isLoading]);

  return null;
}
