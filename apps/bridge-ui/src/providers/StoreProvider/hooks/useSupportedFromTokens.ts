import { CBridgeToken } from '@/bridges/cbridge/types';
import { useBridgeConfig } from '@/providers/BridgeConfigProvider/hooks/useBridgeConfig';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useMemo } from 'react';

export function useSupportedFromTokens() {
  const { peggedPairConfigs, chainTokensMap, chainsMap } = useBridgeConfig();
  const { fromChainId, toChainId } = useStore();

  const tokens = useMemo(() => {
    const tokens: CBridgeToken[] = [];

    // CBridge supported pegged tokens
    peggedPairConfigs.forEach((ppItem) => {
      // Deposit to pegged chain
      if (
        ppItem.org_chain_id === fromChainId &&
        ppItem.pegged_chain_id === toChainId
      ) {
        tokens.push({
          ...ppItem.org_token,
          bridgeAddress: ppItem.pegged_deposit_contract_addr,
        });
      }
      // Withdraw from pegged chain
      // if (
      //   ppItem.pegged_chain_id === fromChainId &&
      //   ppItem.org_chain_id === toChainId
      // ) {
      //   tokens.push({
      //     ...ppItem.org_token,
      //     bridgeAddress: ppItem.pegged_burn_contract_addr,
      //   });
      // }
    });

    // CBridge supported pool-based tokens
    chainTokensMap.get(fromChainId)?.forEach((token) => {
      chainTokensMap.get(toChainId)?.forEach((tokenInner) => {
        if (
          !token.token.xfer_disabled &&
          !tokenInner.token.xfer_disabled &&
          token.token.symbol === tokenInner.token.symbol
        ) {
          tokens.push({
            ...token,
            method: 'CB_POOL_BASED',
            bridgeAddress: chainsMap.get(fromChainId)?.contract_addr,
          });
        }
      });
    });

    // TODO: DeBridge supported tokens

    return tokens.sort((a, b) => (a.name < b.name ? -1 : 1));
  }, [fromChainId, peggedPairConfigs, toChainId, chainTokensMap, chainsMap]);

  return tokens;
}
