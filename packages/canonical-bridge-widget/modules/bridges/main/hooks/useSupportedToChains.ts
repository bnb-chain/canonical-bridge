import { useMemo } from 'react';

import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';
import { useSavedValue } from '@/core/hooks/useSavedValue';
import { GetSupportedToChainsParams } from '@/modules/bridges/main/utils/extendAdapters';

export function useSupportedToChains(props: GetSupportedToChainsParams) {
  const { getSupportedToChains } = useBridgeConfigs();

  const params = useSavedValue(props);

  const toChains = useMemo(() => {
    return getSupportedToChains(params);
  }, [getSupportedToChains, params]);

  return toChains;
}
