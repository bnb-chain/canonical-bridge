import { useMemo } from 'react';

import { useSavedValue } from '@/core/hooks/useSavedValue';
import { IGetTokensParams } from '@/modules/aggregator/shared/aggregateTokens';
import { useBridgeConfig } from '@/modules/aggregator/components/BridgeConfigProvider';

export function useTokens(props: IGetTokensParams) {
  const { getTokens } = useBridgeConfig();

  const params = useSavedValue(props);

  const tokens = useMemo(() => {
    return getTokens(params);
  }, [params, getTokens]);

  return tokens;
}
