export interface TokenPair {
  org_chain_id: number;
  org_token: {
    name: string;
    symbol: string;
    address: string;
  };
  dst_chain_id: number;
  dst_token: {
    name: string;
    symbol: string;
    address: string;
  };
  bridge_type: 'cbridge' | 'debridge';
}
