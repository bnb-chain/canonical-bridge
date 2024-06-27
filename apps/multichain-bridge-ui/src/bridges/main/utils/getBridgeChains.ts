import { CBridgePeggedPairConfig } from '@/bridges/cbridge/types';
import { BridgeConfigsResponse, MultiBurnPairConfig } from '@/bridges/main/types';
import { normalizedChains } from '@/bridges/main/utils/normalizedChains';

interface GetBridgeChainsParams {
  peggedPairConfigs: CBridgePeggedPairConfig[];
  multiBurnConfigs: MultiBurnPairConfig[];
  rawData: BridgeConfigsResponse;
}

export function getBridgeChains(params: GetBridgeChainsParams) {
  const { rawData } = params;

  const cbridgeRes = getCBridgeChainIds(params);
  const deBridgetRes = getDeBridgeChainIds(params);

  const cbridgeChains = rawData.cbridge.chains.filter((item) =>
    cbridgeRes.fromChainIdSet.has(item.id),
  );
  const deBridgeChains = rawData.debridge.chains.filter((item) =>
    deBridgetRes.fromChainIdSet.has(item.chainId),
  );

  const chains = normalizedChains({
    cbridgeChains,
    deBridgeChains,
  });

  return {
    chains,
    cbridgeToChainIdMap: cbridgeRes.toChainIdMap,
    debridgeToChainIdMap: deBridgetRes.toChainIdMap,
  };
}

function createToChainIdMap() {
  const toChainIdMap = new Map<number, Set<number>>();

  return {
    toChainIdMap,
    addToChainId(fromChainId: number, toChainId: number) {
      if (!toChainIdMap.has(fromChainId)) {
        toChainIdMap.set(fromChainId, new Set());
      }
      const toChainIdSet = toChainIdMap.get(fromChainId);
      toChainIdSet?.add(toChainId);
    },
  };
}

function getCBridgeChainIds(params: GetBridgeChainsParams) {
  const { rawData, peggedPairConfigs, multiBurnConfigs } = params;
  const { chains, chain_token: tokensMap } = rawData.cbridge;

  const fromChainIdSet = new Set<number>();
  const { toChainIdMap, addToChainId } = createToChainIdMap();

  chains.forEach((fromChain) => {
    const fromTokens = tokensMap[fromChain.id].token.filter((t) => !t.token.xfer_disabled);
    const fromSymbolSet = new Set(fromTokens.map((t) => t.token.symbol));

    chains.forEach((toChain) => {
      if (fromChain.id === toChain.id) return;

      // pool-based
      const toTokens = tokensMap[toChain.id]?.token;
      const hasToToken = toTokens?.find(
        (t) => !t.token.xfer_disabled && fromSymbolSet.has(t.token.symbol),
      );

      if (hasToToken) {
        fromChainIdSet.add(fromChain.id);
        addToChainId(fromChain.id, toChain.id);
        return;
      }

      // burn
      const hasBurnConfig = multiBurnConfigs.find((e) => {
        return (
          (e.burn_config_as_org.chain_id === fromChain.id &&
            e.burn_config_as_dst.chain_id === toChain.id) ||
          (e.burn_config_as_org.chain_id === toChain.id &&
            e.burn_config_as_dst.chain_id === fromChain.id)
        );
      });

      if (hasBurnConfig) {
        fromChainIdSet.add(fromChain.id);
        addToChainId(fromChain.id, toChain.id);
        return;
      }

      // pegged
      const hasPeggedToken = peggedPairConfigs.find((e) => {
        return (
          (e.org_chain_id === fromChain.id && e.pegged_chain_id === toChain.id) ||
          (e.org_chain_id === toChain.id && e.pegged_chain_id === fromChain.id)
        );
      });

      if (hasPeggedToken) {
        fromChainIdSet.add(fromChain.id);
        addToChainId(fromChain.id, toChain.id);
      }
    });
  });

  return {
    fromChainIdSet,
    toChainIdMap,
  };
}

function getDeBridgeChainIds(params: GetBridgeChainsParams) {
  const { rawData } = params;
  const { chains, chain_token: tokensMap } = rawData.debridge;

  const fromChainIdSet = new Set();
  const { toChainIdMap, addToChainId } = createToChainIdMap();

  chains.forEach((fromChain) => {
    const fromTokens = tokensMap[fromChain.chainId];
    const fromSymbolSet = new Set(fromTokens.map((t) => t.symbol));

    chains.forEach((toChain) => {
      if (fromChain.chainId === toChain.chainId) return;

      const toTokens = tokensMap[toChain.chainId];
      const hasToToken = toTokens?.find((t) => fromSymbolSet.has(t.symbol));

      if (hasToToken) {
        fromChainIdSet.add(fromChain.chainId);
        addToChainId(fromChain.chainId, toChain.chainId);
      }
    });
  });

  return {
    fromChainIdSet,
    toChainIdMap,
  };
}
