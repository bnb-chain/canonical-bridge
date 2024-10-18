import { useMemo } from 'react';

import { useSavedValue } from '@/core/hooks/useSavedValue';
import { IGetFromChainsParams } from '@/modules/aggregator/shared/aggregateChains';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useFromChains(props: IGetFromChainsParams = {}) {
  const { getFromChains } = useAggregator();

  const params = useSavedValue(props);

  const fromChains = useMemo(() => {
    return getFromChains(params);
  }, [getFromChains, params]);

  return fromChains;
}
