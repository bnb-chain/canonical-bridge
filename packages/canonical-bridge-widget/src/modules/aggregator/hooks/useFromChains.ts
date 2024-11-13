import { useMemo } from 'react';

import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

export function useFromChains() {
  const bridgeSDK = useBridgeSDK();

  const fromChains = useMemo(() => {
    return bridgeSDK.getFromChains();
  }, [bridgeSDK]);

  return fromChains;
}
