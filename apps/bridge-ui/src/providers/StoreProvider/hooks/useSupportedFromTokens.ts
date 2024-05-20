import { CBridgeToken } from '@/bridges/cbridge/types';
import { useBridgeConfig } from '@/providers/BridgeConfigProvider/hooks/useBridgeConfig';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useMemo } from 'react';

export function useSupportedFromTokens() {
  const { peggedPairConfigs } = useBridgeConfig();
  const { fromChainId, toChainId } = useStore();

  const tokens = useMemo(() => {
    const tokens: CBridgeToken[] = [];

    peggedPairConfigs.forEach((ppItem) => {
      if (
        ppItem.org_chain_id === fromChainId &&
        ppItem.pegged_chain_id === toChainId
      ) {
        tokens.push({ ...ppItem.org_token });
      }
    });

    return tokens;
  }, [fromChainId, peggedPairConfigs, toChainId]);

  return tokens;
}
