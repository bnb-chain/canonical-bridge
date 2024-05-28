export interface TokenPair {
  org_chain_id: number;
  org_token: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
  };
  dst_chain_id: number;
  dst_token: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
  };
  bridge_type: 'cbridge' | 'debridge';
}
