import { ChainConfig } from '@/modules/bridges';

export const testnetChains: ChainConfig[] = [
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
    chainType: 'evm',
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
    chainType: 'evm',
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
    chainType: 'evm',
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
    chainType: 'evm',
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
    chainType: 'evm',
  },
];
