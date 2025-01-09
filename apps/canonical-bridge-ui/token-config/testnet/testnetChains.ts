import { IChainConfig } from '@bnb-chain/canonical-bridge-widget';

export const testnetChains: IChainConfig[] = [
  {
    chainType: 'evm',
    id: 97,
    name: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://bsc-testnet.bnbchain.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'BSC Testnet',
        url: 'https://testnet.bscscan.com',
      },
    },
  },
  {
    chainType: 'evm',
    id: 1001,
    name: 'Klaytn Testnet Baobab',
    nativeCurrency: {
      name: 'KLAY',
      symbol: 'KLAY',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['https://public-en-baobab.klaytn.net'] },
    },
    blockExplorers: {
      default: {
        name: 'Klaytn Scope',
        url: 'https://baobab.klaytnscope.com',
      },
    },
  },
  {
    chainType: 'evm',
    id: 11155111,
    name: 'Sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://ethereum-sepolia-rpc.publicnode.com'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Sepolia Scan',
        url: 'https://sepolia.etherscan.io',
      },
    },
  },
  {
    chainType: 'evm',
    id: 421614,
    name: 'Arbitrum Sepolia Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://sepolia-rollup.arbitrum.io/rpc'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Sepolia ArbiScan',
        url: 'https://sepolia.arbiscan.io/',
      },
    },
  },
  {
    chainType: 'evm',
    id: 11155420,
    name: 'OP Sepolia',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://sepolia.optimism.io'],
      },
    },
    blockExplorers: {
      default: {
        name: 'OP Sepolia Scan',
        url: 'https://sepolia-optimistic.etherscan.io',
      },
    },
  },
  {
    chainType: 'tron',
    id: 3448148188,
    name: 'Tron Nile Testnet',
    nativeCurrency: {
      name: 'TRX',
      symbol: 'TRX',
      decimals: 6,
    },
    rpcUrls: {
      default: {
        http: ['https://api.nileex.io'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Tron Nile Scan',
        url: 'https://nile.tronscan.org/',
        tokenUrlPattern: 'https://nile.tronscan.org/#/token20/{0}',
      },
    },
  },
];
