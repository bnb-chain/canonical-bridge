import { CBridgeChainInfo, CBridgeTokenInfo } from '@/bridges/cbridge/types';
import { CBRIDGE_TRANSFER_CONFIGS } from '../data';
import { ChainInfo } from '@/bridges/index/types';

export function getPeggedPairConfigs(chains: ChainInfo[]) {
  const chainMap = new Map<number, CBridgeChainInfo>();

  chains.forEach((item) => {
    if (item.rawData.cbridge) {
      chainMap.set(item.id, item.rawData.cbridge);
    }
  });

  const checkPeggedPair = (chainId: number, token: CBridgeTokenInfo) => {
    const hasChainInfo = chainMap.has(chainId);
    const isEnabledToken = !token.token.xfer_disabled;

    return hasChainInfo && isEnabledToken;
  };

  const filteredPeggedPairConfigs =
    CBRIDGE_TRANSFER_CONFIGS.pegged_pair_configs.filter((item) => {
      return (
        checkPeggedPair(item.org_chain_id, item.org_token) &&
        checkPeggedPair(item.pegged_chain_id, item.pegged_token)
      );
    });

  return filteredPeggedPairConfigs;
}
