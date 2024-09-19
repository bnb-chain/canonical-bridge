import { type PublicClient, type WalletClient } from 'viem';

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
  disabled: boolean;
}

export interface ICBridgeToken {
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

export interface ICBridgeBurnConfig {
  chain_id: number;
  token: ICBridgeToken;
  burn_contract_addr: string;
  canonical_token_contract_addr: string;
  burn_contract_version: number;
}

/// burn_config_as_org.bridge_version === 2
/// burn_config_as_dst.bridge_version is not required
/// If the bridge_version of burnConfig1 and burnConfig2 are 2,
/// There should be two MultiBurnPairConfigs
/// 1: burnConfig1 ----> burnConfig2
/// 2: burnConfig2 ----> burnConfig1
export interface ICBridgeBurnPairConfig {
  burn_config_as_org: ICBridgeBurnConfig; /// Could be used only as from chain
  burn_config_as_dst: ICBridgeBurnConfig; /// Could be used only as to chain
}

export interface ICBridgeTransferConfig {
  chains: ICBridgeChain[];
  chain_token: {
    [k: number]: {
      token: ICBridgeToken[];
    };
  };
  farming_reward_contract_addr: string;
  pegged_pair_configs: ICBridgePeggedPairConfig[];
  blocked_bridge_direct: {
    symbol: string;
    src_chain_id: string;
    dst_chain_id: string;
  }[];
  redirect_to_aggregators_config: {
    symbol: string;
    src_chain_id: string;
    dst_chain_id: string;
  }[];
}

export interface ICBridgeTransferStatusResponse {
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

export interface ICBridgeTransferInfo {
  chain: any;
  token: any;
  amount: string;
}

export interface ICBridgeTransferHistory {
  transfer_id: string;
  src_send_info: ICBridgeTransferInfo;
  dst_received_info: ICBridgeTransferInfo;
  ts: number;
  src_block_tx_link: string;
  dst_block_tx_link: string;
  status: string;
  refund_reason: string;
}

export interface ICBridgeTransferHistoryResponse {
  err: object;
  history: ICBridgeTransferHistory[];
  next_page_token: string;
  current_size: string;
}

export interface ICBridgeTransferEstimatedTime {
  err: object;
  median_transfer_latency_in_second: number;
}

export interface ICBridgeTransactionResponse {
  data: null | {
    gasFee: bigint;
    gasPrice: bigint;
    transferId: string;
    send: () => Promise<`0x${string}`>;
  };
  isLoading: boolean;
  isError: boolean;
  error: null | unknown;
}

export interface ICBridgeEstimateAmountRequest {
  src_chain_id: number;
  dst_chain_id: number;
  token_symbol: string;
  amt: string;
  user_addr?: string;
  slippage_tolerance: number;
  is_pegged?: boolean;
}

export interface ICBridgeEstimateAmountResponse {
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

export interface ICBridgeGetSupportedFuncParams {
  fromChainId?: number;
  toChainId?: number;
  fromTokenSymbol?: string;
  peggedPairConfigs: ICBridgePeggedPairConfig[];
  burnPairConfigs: ICBridgeBurnPairConfig[];
  data: ICBridgeTransferConfig;
}

export interface ICBridgeSendRangeInput {
  bridgeAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  isPegged?: boolean;
  client: PublicClient;
}

export interface ISendCBridgeToken {
  walletClient: WalletClient;
  publicClient: PublicClient;
  bridgeAddress: string;
  fromChainId: number;
  address: `0x${string}`;
  peggedConfig?: ICBridgePeggedPairConfig;
  isPegged: boolean;
  args: any;
}

export interface IGetCBridgeTransferAddressInput {
  fromChainId: number;
  isPegged: boolean;
  peggedConfig?: ICBridgePeggedPairConfig;
  chainConfig?: ICBridgeChain;
}

export interface IGetCBridgeTransferParamsInput {
  amount: bigint;
  isPegged: boolean;
  toChainId: number;
  address: `0x${string}`;
  tokenAddress: `0x${string}`;
  maxSlippage: number;
  transferType?: 'deposit' | 'withdraw';
  peggedConfig?: ICBridgePeggedPairConfig;
  nonce: number;
}

export interface IGetCBridgeABI {
  isPegged: boolean;
  transferType?: 'deposit' | 'withdraw';
  peggedConfig?: ICBridgePeggedPairConfig;
}

export interface IGetCBridgeTransferFunction {
  isPegged: boolean;
  transferType?: 'deposit' | 'withdraw';
}

export interface ICBridgeMaxMinSendAmt {
  max: string;
  min: string;
}
