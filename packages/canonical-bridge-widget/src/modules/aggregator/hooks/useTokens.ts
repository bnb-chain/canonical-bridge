import { useMemo } from 'react';

import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

export function useTokens({
  fromChainId,
  toChainId,
}: {
  fromChainId?: number;
  toChainId?: number;
}) {
  const bridgeSDK = useBridgeSDK();

  const tokens = useMemo(() => {
    if (!fromChainId || !toChainId) return [];

    return bridgeSDK.getTokens({
      fromChainId,
      toChainId,
    });
  }, [bridgeSDK, fromChainId, toChainId]);

  return tokens;
}
