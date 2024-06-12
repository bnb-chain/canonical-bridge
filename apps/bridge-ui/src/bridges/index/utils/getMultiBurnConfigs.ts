import { MultiBurnPairConfig } from '@/bridges/index';
import { CBRIDGE_TRANSFER_CONFIGS } from '@/bridges/index/data';

export function getMultiBurnConfigs() {
  const multiBurnConfigs: MultiBurnPairConfig[] = [];

  const config = CBRIDGE_TRANSFER_CONFIGS;

  if (config?.pegged_pair_configs?.length === 0) {
    return [];
  }
  const configsLength = config?.pegged_pair_configs?.length;

  for (let i = 0; i < configsLength; i++) {
    for (let j = i + 1; j < configsLength; j++) {
      const peggedConfigI = config.pegged_pair_configs[i];
      const peggedConfigJ = config.pegged_pair_configs[j];
      if (
        peggedConfigI.org_chain_id === peggedConfigJ.org_chain_id &&
        peggedConfigI.org_token.token.symbol ===
          peggedConfigJ.org_token.token.symbol
      ) {
        /// Only upgraded PegBridge can support multi burn to other pegged chain
        if (
          peggedConfigI.bridge_version === 2 &&
          peggedConfigJ.bridge_version === 2
        ) {
          multiBurnConfigs.push({
            burn_config_as_org: {
              chain_id: peggedConfigI.pegged_chain_id,
              token: peggedConfigI.pegged_token,
              burn_contract_addr: peggedConfigI.pegged_burn_contract_addr,
              canonical_token_contract_addr:
                peggedConfigI.canonical_token_contract_addr,
              burn_contract_version: peggedConfigI.bridge_version,
            },
            burn_config_as_dst: {
              chain_id: peggedConfigJ.pegged_chain_id,
              token: peggedConfigJ.pegged_token,
              burn_contract_addr: peggedConfigJ.pegged_burn_contract_addr,
              canonical_token_contract_addr:
                peggedConfigJ.canonical_token_contract_addr,
              burn_contract_version: peggedConfigJ.bridge_version,
            },
          });
          multiBurnConfigs.push({
            burn_config_as_org: {
              chain_id: peggedConfigJ.pegged_chain_id,
              token: peggedConfigJ.pegged_token,
              burn_contract_addr: peggedConfigJ.pegged_burn_contract_addr,
              canonical_token_contract_addr:
                peggedConfigJ.canonical_token_contract_addr,
              burn_contract_version: peggedConfigJ.bridge_version,
            },
            burn_config_as_dst: {
              chain_id: peggedConfigI.pegged_chain_id,
              token: peggedConfigI.pegged_token,
              burn_contract_addr: peggedConfigI.pegged_burn_contract_addr,
              canonical_token_contract_addr:
                peggedConfigI.canonical_token_contract_addr,
              burn_contract_version: peggedConfigI.bridge_version,
            },
          });
        }
      }
    }
  }

  return multiBurnConfigs;
}
