import { useMemo } from 'react';

import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';
import { GetSupportedTokensParams } from '@/modules/bridges/main/utils/createAdapter';
import { useSavedValueRef } from '@/core/hooks/useSavedValueRef';

export function useSupportedTokens(props: GetSupportedTokensParams) {
  const { getSupportedTokens } = useBridgeConfigs();

  const params = useSavedValueRef(props);

  const tokens = useMemo(() => {
    return getSupportedTokens(params);
  }, [params, getSupportedTokens]);

  return tokens;
}
