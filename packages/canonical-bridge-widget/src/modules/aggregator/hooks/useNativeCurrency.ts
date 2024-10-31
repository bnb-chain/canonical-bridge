import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useNativeCurrency(chainId?: number) {
  const { nativeCurrencies } = useAggregator();
  if (!chainId || !nativeCurrencies) return;

  return nativeCurrencies[chainId];
}
