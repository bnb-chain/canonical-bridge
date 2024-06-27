import {
  CBridgeChainInfo,
  CBridgePeggedPairConfig,
  CBridgeTokenInfo,
} from '@/bridges/cbridge/types';

interface GetPeggedPairConfigsParams {
  cbridgeChains: CBridgeChainInfo[];
  peggedPairConfigs: CBridgePeggedPairConfig[];
}

export function getPeggedPairConfigs(params: GetPeggedPairConfigsParams) {
  const { cbridgeChains, peggedPairConfigs } = params;

  const chainMap = new Map<number, CBridgeChainInfo>();

  cbridgeChains.forEach((item) => {
    chainMap.set(item.id, item);
  });

  const checkPeggedPair = (chainId: number, token: CBridgeTokenInfo) => {
    const hasChainInfo = chainMap.has(chainId);
    const isEnabledToken = !token.token.xfer_disabled;

    return hasChainInfo && isEnabledToken;
  };

  const filteredPeggedPairConfigs = peggedPairConfigs.filter((item) => {
    return (
      checkPeggedPair(item.org_chain_id, item.org_token) &&
      checkPeggedPair(item.pegged_chain_id, item.pegged_token)
    );
  });

  return filteredPeggedPairConfigs;
}
