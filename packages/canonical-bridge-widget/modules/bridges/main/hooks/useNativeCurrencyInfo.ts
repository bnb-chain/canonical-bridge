import { useBridgeConfigs } from '@/modules/bridges/main/providers/BridgeConfigsProvider';

export function useNativeCurrencyInfo(chainId?: number) {
  const { nativeCurrencies } = useBridgeConfigs();
  return chainId ? nativeCurrencies[chainId] : undefined;
}
