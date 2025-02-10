export interface ICryptoCurrencyMapPayload {
  listing_status: 'active' | 'inactive' | 'untracked';
  start: number;
  limit: number;
  sort: 'cmc_rank' | 'id';
  symbol: string;
  aux: string;
}

export interface ITokenPlatform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  token_address: string;
}

export interface ICryptoCurrencyMapEntity {
  id: number;
  rank: number;
  name: string;
  symbol: string;
  slug: string;
  is_active: number;
  first_historical_data: string;
  last_historical_data: string;
  platform: null | ITokenPlatform;
}

export interface ICryptoCurrencyQuoteEntity {
  id: number;
  is_active: number;
  quote: {
    USD: {
      price: number;
    };
  };
}

export interface IBlockedBridgeDirect {
  dst_chain_id: string;
  src_chain_id: string;
  symbol: string;
  web_env: string;
}

export interface ITransferToken {
  delay_period: number;
  delay_threshold: string;
  icon: string;
  inbound_epoch_cap: string;
  inbound_lmt: string;
  liq_add_disabled: boolean;
  liq_agg_rm_src_disabled: boolean;
  liq_rm_disabled: boolean;
  name: string;
  cmc_price: string;
  token: {
    address: string;
    decimal: number;
    symbol: string;
    xfer_disabled: boolean;
    transfer_disabled: boolean;
  };
}

export interface ITransferChain {
  block_delay: number;
  contract_addr: string;
  disabled: boolean;
  drop_gas_amt: string;
  drop_gas_balance_alert: string;
  drop_gas_cost_amt: string;
  explore_url: string;
  farming_reward_contract_addr: string;
  flat_usd_fee: number;
  gas_token_symbol: string;
  icon: string;
  id: number;
  name: string;
  suggested_gas_cost: string;
  transfer_agent_contract_addr: string;
  cmc_price: string;
}

export interface IAssetPlatform {
  id: string;
  chain_identifier: number;
  name: string;
  shortname: string;
  native_coin_id: string;
}

export interface ICoin {
  id: string;
  name: string;
  symbol: string;
  platforms: Record<string, string>;
}

export interface ICoinPrice {
  id: string;
  price: number;
  decimals: number;
}

export interface IStargateBridgeTokenInfo {
  stargateType: string;
  address: `0x${string}`;
  token: {
    address: `0x${string}`;
    decimals: number;
    symbol: string;
  };
  lpToken?: {
    address: `0x${string}`;
    decimals: number;
    symbol: string;
  };
  farm?: {
    stargateStaking: {
      address: `0x${string}`;
      rewardTokens: [
        {
          address: `0x${string}`;
          decimals: number;
          symbol: string;
        },
        {
          address: `0x${string}`;
          decimals: number;
          symbol: string;
        },
      ];
    };
  };
  id: string;
  assetId: string;
  chainKey: string;
  chainName: string;
  tokenMessaging: `0x${string}`;
  sharedDecimals: number;
}
export interface IStargateTokenList {
  v1: IStargateBridgeTokenInfo[];
  v2: IStargateBridgeTokenInfo[];
}

export interface IMesonToken {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  addr?: string;
  min: string;
  max: string;
}
export interface IMesonChain {
  id: string;
  name: string;
  chainId: string;
  address: string;
  tokens: IMesonToken[];
}

export interface ILayerZeroToken {
  address: string;
  bridgeAddress: string;
  decimals: number;
  symbol: string;
  name: string;
  endpointID: number;
  version: number; // LayerZero version
}

export interface ILayerZeroChain {
  chainId: number;
  chainName: string;
  network?: string;
}

export interface ILayerZeroTransferConfigs {
  chains: ILayerZeroChain[];
  tokens: Record<number, ILayerZeroToken[]>;
}
