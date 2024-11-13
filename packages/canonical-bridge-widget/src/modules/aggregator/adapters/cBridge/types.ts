import { ICBridgeChain, ICBridgePeggedPairConfig } from '@bnb-chain/canonical-bridge-sdk';
import { type PublicClient, type WalletClient } from 'viem';

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
