import { useMemo } from 'react';

import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';
import { GetSupportedToChainsParams } from '@/modules/bridges/main/utils/createAdapter';
import { useSavedValue } from '@/core/hooks/useSavedValue';

export function useSupportedToChains(props: GetSupportedToChainsParams) {
  const { getSupportedToChains } = useBridgeConfigs();

  const params = useSavedValue(props);

  const toChains = useMemo(() => {
    return getSupportedToChains(params);
  }, [getSupportedToChains, params]);

  return toChains;
}
