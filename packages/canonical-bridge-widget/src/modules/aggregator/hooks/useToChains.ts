import { useMemo } from 'react';

import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

export function useToChains({ fromChainId }: { fromChainId?: number }) {
  const bridgeSDK = useBridgeSDK();

  const toChains = useMemo(() => {
    if (!fromChainId) return [];
    return bridgeSDK.getToChains({
      fromChainId,
    });
  }, [bridgeSDK, fromChainId]);

  return toChains;
}
