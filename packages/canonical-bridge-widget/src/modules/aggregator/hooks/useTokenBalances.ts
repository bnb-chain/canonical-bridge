import { useAccount, useChains } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

import { IBridgeToken } from '@/modules/aggregator/types';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { TIME } from '@/core/constants';
import { getTokenBalances } from '@/modules/aggregator/shared/getTokenBalances';

export function useTokenBalances(tokens: IBridgeToken[]) {
  const { address } = useAccount();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const chains = useChains();

  const result = useQuery<Record<string, number | undefined>>({
    enabled: !!address,
    refetchInterval: TIME.SECOND * 5,
    queryKey: ['token-balances', address, fromChain?.id],
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

  return result;
}
