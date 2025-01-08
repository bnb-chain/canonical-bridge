import { useMemo } from 'react';

import { useAggregator } from '@/modules/aggregator/providers/AggregatorProvider';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useTokens() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const aggregator = useAggregator();

  const tokens = useMemo(() => {
    if (fromChain?.id && toChain?.id) {
      return aggregator.getTokens({ fromChainId: fromChain.id, toChainId: toChain.id });
    }
    return [];
  }, [aggregator, fromChain?.id, toChain?.id]);

  return tokens;
}
