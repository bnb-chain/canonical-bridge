import { CBridgeChain } from '@/bridges/cbridge/types';
import { useBridgeConfig } from '@/providers/BridgeConfigProvider/hooks/useBridgeConfig';
import { useMemo } from 'react';

export function useSupportedFromChains() {
  const { CBSupportedFromChains } = useBridgeConfig();

  const chains = useMemo(() => {
    // const tmpChainsMap = new Map<number, CBridgeChain>();

    const chains = CBSupportedFromChains.sort(
      (a: CBridgeChain, b: CBridgeChain) => (a.name < b.name ? -1 : 1)
    );

    return chains;
  }, [CBSupportedFromChains]);

  return chains;
}
