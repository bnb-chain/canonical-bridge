import { useMemo } from 'react';

import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';
import { useSavedValue } from '@/core/hooks/useSavedValue';
import { GetSupportedTokensParams } from '@/modules/bridges/main/utils/extendAdapters';

export function useSupportedTokens(props: GetSupportedTokensParams) {
  const { getSupportedTokens } = useBridgeConfigs();

  const params = useSavedValue(props);

  const tokens = useMemo(() => {
    return getSupportedTokens(params);
  }, [params, getSupportedTokens]);

  return tokens;
}
