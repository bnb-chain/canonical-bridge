import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';

export function useNativeCurrencyInfo(chainId?: number) {
  const { nativeCurrencyMap } = useBridgeConfigs();
  return chainId ? nativeCurrencyMap.get(chainId) : undefined;
}
