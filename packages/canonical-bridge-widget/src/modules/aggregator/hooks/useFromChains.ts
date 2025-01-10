import { useMemo } from 'react';

import { useAggregator } from '@/modules/aggregator/providers/AggregatorProvider';

export function useFromChains() {
  const aggregator = useAggregator();

  const fromChains = useMemo(() => {
    return aggregator?.getFromChains();
  }, [aggregator]);

  return fromChains;
}
