import { useMemo } from 'react';

import { useSavedValue } from '@/core/hooks/useSavedValue';
import { useBridgeConfig } from '@/modules/aggregator/components/BridgeConfigProvider';
import { IGetFromChainsParams } from '@/modules/aggregator/shared/aggregateChains';

export function useFromChains(props: IGetFromChainsParams) {
  const { getFromChains } = useBridgeConfig();

  const params = useSavedValue(props);

  const fromChains = useMemo(() => {
    return getFromChains(params);
  }, [getFromChains, params]);

  return fromChains;
}
