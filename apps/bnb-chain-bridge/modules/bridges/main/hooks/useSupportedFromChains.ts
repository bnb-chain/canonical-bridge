import { useMemo } from 'react';

import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';
import { GetSupportedFromChainsParams } from '@/modules/bridges/main/utils/createAdapter';
import { useSavedValueRef } from '@/core/hooks/useSavedValueRef';

export function useSupportedFromChains(props: GetSupportedFromChainsParams) {
  const { getSupportedFromChains } = useBridgeConfigs();

  const params = useSavedValueRef(props);

  const fromChains = useMemo(() => {
    return getSupportedFromChains(params);
  }, [getSupportedFromChains, params]);

  return fromChains;
}
