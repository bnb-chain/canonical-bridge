import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { useMemo } from 'react';

import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useAdapter<T = unknown>(bridgeType: BridgeType) {
  const { adapters } = useAggregator();

  const adapter = useMemo(() => {
    return adapters.find((adapter) => adapter.bridgeType === bridgeType);
  }, [adapters, bridgeType]);

  return adapter as T;
}
