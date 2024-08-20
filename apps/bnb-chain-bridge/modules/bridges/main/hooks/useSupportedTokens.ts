import { useMemo } from 'react';

import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';
import { GetSupportedTokensParams } from '@/modules/bridges/main/utils/createAdapter';
import { useSavedValue } from '@/core/hooks/useSavedValue';

export function useSupportedTokens(props: GetSupportedTokensParams) {
  const { getSupportedTokens } = useBridgeConfigs();

  const params = useSavedValue(props);

  const tokens = useMemo(() => {
    return getSupportedTokens(params);
  }, [params, getSupportedTokens]);

  return tokens;
}
