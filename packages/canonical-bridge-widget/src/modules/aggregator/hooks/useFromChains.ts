import { useMemo } from 'react';

import { useSavedValue } from '@/core/hooks/useSavedValue';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { IGetFromChainsParams } from '@/modules/aggregator/shared/aggregateChains';

export function useFromChains(props: IGetFromChainsParams = {}) {
  const { getFromChains } = useAggregator();

  const params = useSavedValue(props);

  const fromChains = useMemo(() => {
    return getFromChains(params);
  }, [getFromChains, params]);

  return fromChains;
}
