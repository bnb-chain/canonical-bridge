export interface IMesonToken {
  id: string;
  addr: string;
  decimals: number;
}

export interface IMesonChain {
  id: string;
  name: string;
  chainId: string;
  address: string; // bridge address
  tokens: IMesonToken[];
}
