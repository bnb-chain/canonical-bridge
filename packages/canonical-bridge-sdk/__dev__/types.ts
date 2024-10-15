export type WalletType =
  | 'metaMask'
  | 'trust'
  | 'walletConnect'
  | 'okxWallet'
  | 'binanceWeb3Wallet'
  | 'solana:phantom'
  | 'solana:trust';

export type ChainType = 'evm' | 'solana' | 'tron';

export interface ChainConfig {
  id: number | string;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  explorer: {
    name: string;
    url: string;
    tokenUrlPattern?: string;
  };
  chainType: ChainType;
  wallets?: {
    pc: WalletType[];
    mobile: WalletType[];
  };
}
