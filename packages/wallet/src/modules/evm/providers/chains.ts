const bscMainnet = {
  id: 56,
  network: `BNB Smart Chain Mainnet`,
  rpcUrls: {
    default: {
      http: ['https://bsc.nodereal.io'],
    },
    public: {
      http: ['https://bsc.nodereal.io'],
    },
  },
  name: `BNB Smart Chain`,
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'BscScan', url: 'https://bscscan.com' },
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
};

const bscTestnet = {
  id: 97,
  network: `BNB Smart Chain Testnet`,
  rpcUrls: {
    default: {
      http: ['https://bsc-testnet.bnbchain.org'],
    },
    public: {
      http: ['https://bsc-testnet.bnbchain.org'],
    },
  },
  name: `BNB Smart Chain Testnet`,
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
};

const goerliTestnet = {
  id: 5,
  network: `Goerli Testnet`,
  rpcUrls: {
    default: {
      http: ['https://eth-goerli.public.blastapi.io'],
    },
    public: {
      http: ['https://eth-goerli.public.blastapi.io'],
    },
  },
  name: `Goerli Testnet`,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'Goerli Etherscan', url: 'https://goerli.etherscan.io' },
    default: { name: 'Goerli Etherscan', url: 'https://goerli.etherscan.io' },
  },
};

const ethMainnet = {
  id: 1,
  network: `Eth Mainnet`,
  rpcUrls: {
    default: {
      http: ['https://eth-pokt.nodies.app'],
    },
    public: {
      http: ['https://eth-pokt.nodies.app'],
    },
  },
  name: `Ethereum Mainnet`,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'EtherScan', url: 'https://etherscan.io/' },
    default: { name: 'EtherScan', url: 'https://etherscan.io/' },
  },
};

const polygonMainnet = {
  id: 137,
  network: `Polygon Mainnet`,
  rpcUrls: {
    default: {
      http: ['https://polygon.rpc.blxrbdn.com'],
    },
    public: {
      http: ['https://polygon.rpc.blxrbdn.com'],
    },
  },
  name: `Polygon Mainnet`,
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'PolygonScan', url: 'https://polygonscan.com/' },
    default: { name: 'PolygonScan', url: 'https://polygonscan.com/' },
  },
};

export const chains = [
  bscMainnet,
  bscTestnet,
  polygonMainnet,
  ethMainnet,
  goerliTestnet,
];
