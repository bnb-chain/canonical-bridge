export interface ICBridgeChain {
  id: number;
  name: string;
  icon: string;
  block_delay: number;
  gas_token_symbol: string;
  explore_url: string;
  contract_addr: string;
  drop_gas_amt: string;
  drop_gas_cost_amt: string;
  drop_gas_balance_alert: string;
  suggested_gas_cost: string;
  flat_usd_fee: number;
  farming_reward_contract_addr: string;
  transfer_agent_contract_addr: string;
}

export interface ICBridgeToken {
  token: {
    symbol: string;
    address: string;
    decimal: number;
    xfer_disabled: boolean;
  };
  name: string;
  icon: string;
  inbound_lmt: string;
  inbound_epoch_cap: string;
  transfer_disabled: boolean;
  liq_add_disabled: boolean;
  liq_rm_disabled: boolean;
  liq_agg_rm_src_disabled: boolean;
  delay_threshold: string;
  delay_period: number;
}

export interface ICBridgePeggedPairConfig {
  org_chain_id: number;
  org_token: ICBridgeToken;
  pegged_chain_id: number;
  pegged_token: ICBridgeToken;
  pegged_deposit_contract_addr: string;
  pegged_burn_contract_addr: string;
  canonical_token_contract_addr: string;
  vault_version: number;
  bridge_version: number;
  migration_peg_burn_contract_addr: string;
}

export interface ICBridgeTransferConfig {
  chains: ICBridgeChain[];
  chain_token: {
    [k: string]: {
      token: ICBridgeToken[];
    };
  };
  farming_reward_contract_addr: string;
  pegged_pair_configs: ICBridgePeggedPairConfig[];
  blocked_bridge_direct: string[];
  redirect_to_aggregators_config: {
    symbol: string;
    src_chain_id: string;
    dst_chain_id: string;
  }[];
}
