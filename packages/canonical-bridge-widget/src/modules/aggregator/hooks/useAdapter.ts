import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { useMemo } from 'react';

import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

export function useAdapter<T = unknown>(bridgeType: BridgeType) {
  const bridgeSDK = useBridgeSDK();

  const adapter = useMemo(() => {
    const adapters = bridgeSDK.getSDKOptions().adapters;
    return adapters.find((adapter) => adapter.bridgeType === bridgeType);
  }, [bridgeSDK, bridgeType]);

  return adapter as T;
}
