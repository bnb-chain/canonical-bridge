import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useBridgeSDK() {
  return useAggregator().bridgeSDK;
}
