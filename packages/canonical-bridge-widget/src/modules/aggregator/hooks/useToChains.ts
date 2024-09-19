import { useMemo } from 'react';

import { useSavedValue } from '@/core/hooks/useSavedValue';
import { useBridgeConfig } from '@/modules/aggregator/components/BridgeConfigProvider';
import { IGetToChainsParams } from '@/modules/aggregator/shared/aggregateChains';

export function useToChains(props: IGetToChainsParams) {
  const { getToChains } = useBridgeConfig();

  const params = useSavedValue(props);

  const toChains = useMemo(() => {
    return getToChains(params);
  }, [getToChains, params]);

  return toChains;
}
