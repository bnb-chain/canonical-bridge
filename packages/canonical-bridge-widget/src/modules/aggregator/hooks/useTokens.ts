import { useMemo } from 'react';

import { useSavedValue } from '@/core/hooks/useSavedValue';
import { IGetTokensParams } from '@/modules/aggregator/shared/aggregateTokens';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useTokens(props: IGetTokensParams) {
  const { getTokens } = useAggregator();

  const params = useSavedValue(props);

  const tokens = useMemo(() => {
    return getTokens(params);
  }, [params, getTokens]);

  return tokens;
}
