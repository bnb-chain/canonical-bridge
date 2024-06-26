import { ChainInfo, BridgeConfigsContextProps } from '@/bridges/main';
import { normalizedChains } from '@/bridges/main/utils/normalizedChains';

export function getSupportedToChains(configs: BridgeConfigsContextProps, fromChain: ChainInfo) {
  const { rawData } = configs;

  const cbridgeChainIdSet = getCBridgeChainIdSet(configs, fromChain.id);
  const deBridgeChainIdSet = getDeBridgeChainIdSet(configs, fromChain.id);

  const cbridgeChains = rawData.cbridge.chains.filter((item) => cbridgeChainIdSet.has(item.id));
  const deBridgeChains = rawData.debridge.chains.filter((item) =>
    deBridgeChainIdSet.has(item.chainId),
  );

  const chains = normalizedChains({
    cbridgeChains,
    deBridgeChains,
  });

  return chains;
}

function getCBridgeChainIdSet(configs: BridgeConfigsContextProps, fromChainId: number) {
  const { rawData, peggedPairConfigs, multiBurnConfigs } = configs;
  const { chains, chain_token: tokensMap } = rawData.cbridge;

  const toChainIdSet = new Set();

  const fromTokens = tokensMap[fromChainId].token.filter((t) => !t.token.xfer_disabled);
  const fromSymbolSet = new Set(fromTokens.map((t) => t.token.symbol));

  chains.forEach((toChain) => {
    if (fromChainId === toChain.id) return;

    // pool-based
    const toTokens = tokensMap[toChain.id]?.token;
    const hasToToken = toTokens?.find(
      (t) => !t.token.xfer_disabled && fromSymbolSet.has(t.token.symbol),
    );

    if (hasToToken) {
      toChainIdSet.add(toChain.id);
      return;
    }

    // burn
    const hasBurnConfig = multiBurnConfigs.find((e) => {
      return (
        (e.burn_config_as_org.chain_id === fromChainId &&
          e.burn_config_as_dst.chain_id === toChain.id) ||
        (e.burn_config_as_org.chain_id === toChain.id &&
          e.burn_config_as_dst.chain_id === fromChainId)
      );
    });

    if (hasBurnConfig) {
      toChainIdSet.add(toChain.id);
      return;
    }

    // pegged
    const hasPeggedToken = peggedPairConfigs.find((e) => {
      return (
        (e.org_chain_id === fromChainId && e.pegged_chain_id === toChain.id) ||
        (e.org_chain_id === toChain.id && e.pegged_chain_id === fromChainId)
      );
    });

    if (hasPeggedToken) {
      toChainIdSet.add(toChain.id);
    }
  });

  return toChainIdSet;
}

function getDeBridgeChainIdSet(configs: BridgeConfigsContextProps, fromChainId: number) {
  const { rawData } = configs;
  const { chains, chain_token: tokensMap } = rawData.debridge;

  const toChainIdSet = new Set();

  const fromTokens = tokensMap[fromChainId];
  const fromSymbolSet = new Set(fromTokens.map((t) => t.symbol));

  chains.forEach((toChain) => {
    if (fromChainId === toChain.chainId) return;

    const toTokens = tokensMap[toChain.chainId];
    const hasToToken = toTokens?.find((t) => fromSymbolSet.has(t.symbol));

    if (hasToToken) {
      toChainIdSet.add(toChain.chainId);
    }
  });

  return toChainIdSet;
}
