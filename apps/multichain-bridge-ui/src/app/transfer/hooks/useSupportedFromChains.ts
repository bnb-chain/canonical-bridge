import { useBridgeConfigs } from '@/bridges/main';

export function useSupportedFromChains() {
  const { getSupportedFromChains } = useBridgeConfigs();

  const chains = getSupportedFromChains();

  return chains;
}
