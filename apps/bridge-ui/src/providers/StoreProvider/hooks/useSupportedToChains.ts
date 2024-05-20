import { CBridgeChain } from '@/bridges/cbridge/types';
import { useBridgeConfig } from '@/providers/BridgeConfigProvider/hooks/useBridgeConfig';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useMemo } from 'react';

export function useSupportedToChains() {
  const { chainsMap, peggedPairConfigs } = useBridgeConfig();
  const { fromChainId } = useStore();

  const chains = useMemo(() => {
    const tmpChainsMap = new Map<number, CBridgeChain>();

    peggedPairConfigs.forEach((ppItem) => {
      if (ppItem.org_chain_id === fromChainId) {
        tmpChainsMap.set(
          ppItem.pegged_chain_id,
          chainsMap.get(ppItem.pegged_chain_id)!
        );
      }
    });

    const chains = [...tmpChainsMap.values()].sort((a, b) =>
      a.name < b.name ? -1 : 1
    );

    return chains;
  }, [chainsMap, fromChainId, peggedPairConfigs]);

  return chains;
}
