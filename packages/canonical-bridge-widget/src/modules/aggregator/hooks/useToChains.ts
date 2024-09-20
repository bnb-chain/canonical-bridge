import { useMemo } from 'react';

import { useSavedValue } from '@/core/hooks/useSavedValue';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { IGetToChainsParams } from '@/modules/aggregator/shared/aggregateChains';

export function useToChains(props: IGetToChainsParams) {
  const { getToChains } = useAggregator();

  const params = useSavedValue(props);

  const toChains = useMemo(() => {
    return getToChains(params);
  }, [getToChains, params]);

  return toChains;
}
