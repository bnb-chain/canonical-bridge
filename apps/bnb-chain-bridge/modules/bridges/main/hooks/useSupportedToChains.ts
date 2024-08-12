import { useMemo } from 'react';

import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';
import { GetSupportedToChainsParams } from '@/modules/bridges/main/utils/createAdapter';
import { useSavedValueRef } from '@/core/hooks/useSavedValueRef';

export function useSupportedToChains(props: GetSupportedToChainsParams) {
  const { getSupportedToChains } = useBridgeConfigs();

  const params = useSavedValueRef(props);

  const toChains = useMemo(() => {
    return getSupportedToChains(params);
  }, [getSupportedToChains, params]);

  return toChains;
}
