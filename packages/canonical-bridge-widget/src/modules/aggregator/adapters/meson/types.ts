export interface IMesonToken {
  id: string;
  addr: string;
  decimals: number;
  min: string;
  max: string;
}

export interface IMesonChain {
  id: string;
  name: string;
  chainId: string;
  address: string; // bridge address
  tokens: IMesonToken[];
}
