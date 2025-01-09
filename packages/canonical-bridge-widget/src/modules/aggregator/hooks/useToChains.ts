import { useMemo } from 'react';

import { useAggregator } from '@/modules/aggregator/providers/AggregatorProvider';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useToChains() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const aggregator = useAggregator();

  const toChains = useMemo(() => {
    if (fromChain?.id) {
      return aggregator.getToChains({ fromChainId: fromChain.id });
    }
    return [];
  }, [aggregator, fromChain?.id]);

  return toChains;
}
