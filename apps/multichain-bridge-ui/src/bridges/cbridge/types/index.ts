export interface CBridgeChainInfo {
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
  disabled: boolean;
}

export interface CBridgeTokenInfo {
  token: {
    symbol: string;
    address: string;
    decimal: number;
    xfer_disabled: boolean;
    display_symbol?: string; /// FOR ETH <=====> WETH
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
  method?: string;
  bridgeAddress?: string; //bridge address for transfer
}

export interface CBridgePeggedPairConfig {
  org_chain_id: number;
  org_token: CBridgeTokenInfo;
  pegged_chain_id: number;
  pegged_token: CBridgeTokenInfo;
  pegged_deposit_contract_addr: string;
  pegged_burn_contract_addr: string;
  canonical_token_contract_addr: string;
  vault_version: number;
  bridge_version: number;
  migration_peg_burn_contract_addr: string;
}

export interface CBridgeTransferConfigResponse {
  chains: CBridgeChainInfo[];
  chain_token: {
    [k: string]: {
      token: CBridgeTokenInfo[];
    };
  };
  farming_reward_contract_addr: string;
  pegged_pair_configs: CBridgePeggedPairConfig[];
  blocked_bridge_direct: string[];
  redirect_to_aggregators_config: {
    symbol: string;
    src_chain_id: string;
    dst_chain_id: string;
  }[];
}

export interface CBridgeEstimateAmountResponse {
  err: object;
  eq_value_token_amt: string;
  bridge_rate: number;
  perc_fee: string;
  base_fee: string;
  slippage_tolerance: number;
  max_slippage: number;
  estimated_receive_amt: string;
  drop_gas_amt: string;
  op_fee_rebate: number;
  op_fee_rebate_portion: number;
  op_fee_rebate_end_time: string;
}

export interface CBridgeTransferStatusResponse {
  err: object;
  status: number;
  wd_onchain: null;
  sorted_sigs: string[];
  signers: string[];
  powers: string[];
  refund_reason: number;
  block_delay: number;
  src_block_tx_link: string;
  dst_block_tx_link: string;
}

export interface CBridgeTransferInfo {
  chain: any;
  token: any;
  amount: string;
}

export interface CBridgeTransferHistory {
  transfer_id: string;
  src_send_info: CBridgeTransferInfo;
  dst_received_info: CBridgeTransferInfo;
  ts: number;
  src_block_tx_link: string;
  dst_block_tx_link: string;
  status: string;
  refund_reason: string;
}

export interface CBridgeTransferHistoryResponse {
  err: object;
  history: CBridgeTransferHistory[];
  next_page_token: string;
  current_size: string;
}

export interface CBridgeTransferEstimatedTime {
  err: object;
  median_transfer_latency_in_second: number;
}

export type CBridgeTransactionResponse = {
  data: null | {
    gasFee: bigint;
    gasPrice: bigint;
    transferId: string;
    send: () => Promise<`0x${string}`>;
  };
  isLoading: boolean;
  isError: boolean;
  error: null | unknown;
};

export type CBridgeEstimateAmountRequest = {
  src_chain_id: number;
  dst_chain_id: number;
  token_symbol: string;
  amt: string;
  user_addr?: string;
  slippage_tolerance: number;
  is_pegged?: boolean;
};
