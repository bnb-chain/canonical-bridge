import { CBridgePeggedPairConfig } from '@/bridges/cbridge/types';
import { MultiBurnPairConfig } from '@/bridges/main';

interface GetMultiBurnConfigsParams {
  peggedPairConfigs: CBridgePeggedPairConfig[];
}

export function getMultiBurnConfigs(params: GetMultiBurnConfigsParams) {
  const { peggedPairConfigs } = params;

  const multiBurnConfigs: MultiBurnPairConfig[] = [];
  const configsLength = peggedPairConfigs.length;

  if (configsLength === 0) {
    return [];
  }

  for (let i = 0; i < configsLength; i++) {
    for (let j = i + 1; j < configsLength; j++) {
      const A = peggedPairConfigs[i];
      const B = peggedPairConfigs[j];
      if (
        A.org_chain_id === B.org_chain_id &&
        A.org_token.token.symbol === B.org_token.token.symbol
      ) {
        /// Only upgraded PegBridge can support multi burn to other pegged chain
        if (A.bridge_version === 2 && B.bridge_version === 2) {
          multiBurnConfigs.push({
            burn_config_as_org: {
              chain_id: A.pegged_chain_id,
              token: A.pegged_token,
              burn_contract_addr: A.pegged_burn_contract_addr,
              canonical_token_contract_addr: A.canonical_token_contract_addr,
              burn_contract_version: A.bridge_version,
            },
            burn_config_as_dst: {
              chain_id: B.pegged_chain_id,
              token: B.pegged_token,
              burn_contract_addr: B.pegged_burn_contract_addr,
              canonical_token_contract_addr: B.canonical_token_contract_addr,
              burn_contract_version: B.bridge_version,
            },
          });
          multiBurnConfigs.push({
            burn_config_as_org: {
              chain_id: B.pegged_chain_id,
              token: B.pegged_token,
              burn_contract_addr: B.pegged_burn_contract_addr,
              canonical_token_contract_addr: B.canonical_token_contract_addr,
              burn_contract_version: B.bridge_version,
            },
            burn_config_as_dst: {
              chain_id: A.pegged_chain_id,
              token: A.pegged_token,
              burn_contract_addr: A.pegged_burn_contract_addr,
              canonical_token_contract_addr: A.canonical_token_contract_addr,
              burn_contract_version: A.bridge_version,
            },
          });
        }
      }
    }
  }

  return multiBurnConfigs;
}
