import { CBridgeToken } from '@/bridges/cbridge/types';
import { useBridgeConfig } from '@/providers/BridgeConfigProvider/hooks/useBridgeConfig';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useMemo } from 'react';

export function useSupportedToTokens() {
  const { peggedPairConfigs, chainTokensMap } = useBridgeConfig();
  const { fromChainId, toChainId, fromTokenInfo } = useStore();

  const tokens = useMemo(() => {
    const tokens: CBridgeToken[] = [];

    peggedPairConfigs.forEach((ppItem) => {
      if (
        ppItem.org_chain_id === fromChainId &&
        ppItem.pegged_chain_id === toChainId
      ) {
        tokens.push({ ...ppItem.pegged_token });
      }
    });

    // CBridge supported pool-based tokens
    chainTokensMap.get(toChainId)?.forEach((token) => {
      if (
        !token.token.xfer_disabled &&
        token.token.symbol === fromTokenInfo.fromTokenSymbol
      ) {
        tokens.push({ ...token });
      }
    });

    return tokens;
  }, [
    fromChainId,
    peggedPairConfigs,
    toChainId,
    chainTokensMap,
    fromTokenInfo.fromTokenSymbol,
  ]);

  return tokens;
}
