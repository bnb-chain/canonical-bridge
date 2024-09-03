import { useMemo } from 'react';

import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';
import { useSavedValue } from '@/core/hooks/useSavedValue';
import { GetSupportedFromChainsParams } from '@/modules/bridges/main/utils/extendAdapters';

export function useSupportedFromChains(props: GetSupportedFromChainsParams) {
  const { getSupportedFromChains } = useBridgeConfigs();

  const params = useSavedValue(props);

  const fromChains = useMemo(() => {
    return getSupportedFromChains(params);
  }, [getSupportedFromChains, params]);

  return fromChains;
}
