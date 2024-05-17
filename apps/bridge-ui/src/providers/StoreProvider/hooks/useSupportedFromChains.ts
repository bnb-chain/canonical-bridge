import { ICBridgeChain } from '@/bridges/cbridge/types';
import { useBridgeConfig } from '@/providers/BridgeConfigProvider/hooks/useBridgeConfig';
import { useMemo } from 'react';

export function useSupportedFromChains() {
  const { chainsMap, peggedPairConfigs } = useBridgeConfig();

  const chains = useMemo(() => {
    const tmpChainsMap = new Map<number, ICBridgeChain>();

    peggedPairConfigs.forEach((ppItem) => {
      tmpChainsMap.set(
        ppItem.org_chain_id,
        chainsMap.get(ppItem.org_chain_id)!
      );
    });

    const chains = [...tmpChainsMap.values()].sort((a, b) =>
      a.name < b.name ? -1 : 1
    );

    return chains;
  }, [chainsMap, peggedPairConfigs]);

  return chains;
}
