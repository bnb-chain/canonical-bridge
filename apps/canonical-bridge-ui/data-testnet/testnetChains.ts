import { IChainConfig } from '@bnb-chain/canonical-bridge-widget';

export const testnetChains: IChainConfig[] = [
  {
    id: 97,
    name: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrl: 'https://bsc-testnet.bnbchain.org',
    explorer: {
      name: 'BSC Testnet',
      url: 'https://testnet.bscscan.com',
    },
  },
  {
    id: 1001,
    name: 'Klaytn Testnet Baobab',
    nativeCurrency: {
      name: 'KLAY',
      symbol: 'KLAY',
      decimals: 18,
    },
    rpcUrl: 'https://public-en-baobab.klaytn.net',
    explorer: {
      name: 'Klaytn Scope',
      url: 'https://baobab.klaytnscope.com',
    },
  },
  {
    id: 11155111,
    name: 'Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    explorer: {
      name: 'Sepolia Scan',
      url: 'https://sepolia.etherscan.io',
    },
  },
  {
    id: 421614,
    name: 'Arbitrum Sepolia Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorer: {
      name: 'Sepolia ArbiScan',
      url: 'https://sepolia.arbiscan.io/',
    },
  },
  {
    id: 11155420,
    name: 'OP Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://sepolia.optimism.io',
    explorer: {
      name: 'OP Sepolia Scan',
      url: 'https://sepolia-optimistic.etherscan.io',
    },
  },
  {
    id: 3448148188,
    name: 'Tron Nile Testnet',
    nativeCurrency: {
      name: 'TRX',
      symbol: 'TRX',
      decimals: 6,
    },
    rpcUrl: 'https://api.nileex.io',
    explorer: {
      name: 'Tron Nile Scan',
      url: 'https://nile.tronscan.org/',
      tokenUrlPattern: 'https://nile.tronscan.org/#/token20/{0}',
    },
    chainType: 'tron',
  },
];
