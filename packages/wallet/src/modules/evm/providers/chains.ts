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

const optimism = {
  id: 10,
  network: `Optimism`,
  rpcUrls: {
    default: {
      http: ['https://optimistic.etherscan.io'],
    },
    public: {
      http: ['https://optimistic.etherscan.io'],
    },
  },
  name: `Optimism`,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: {
      name: 'OP Mainnet Explorer',
      url: 'https://optimistic.etherscan.io/',
    },
    default: {
      name: 'OP Mainnet Explorer',
      url: 'https://optimistic.etherscan.io/',
    },
  },
};

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

const syscoin = {
  id: 57,
  network: `Syscoin Mainnet`,
  rpcUrls: {
    default: {
      http: ['https://rpc.syscoin.org'],
    },
    public: {
      http: ['https://rpc.syscoin.org'],
    },
  },
  name: `Syscoin Mainnet`,
  nativeCurrency: {
    name: 'SYS',
    symbol: 'SYS',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: {
      name: 'Syscoin Explorer',
      url: 'https://explorer.syscoin.org/',
    },
    default: {
      name: 'Syscoin Explorer',
      url: 'https://explorer.syscoin.org/',
    },
  },
};

const ontology = {
  id: 58,
  network: `Ontology Mainnet`,
  rpcUrls: {
    default: {
      http: ['https://dappnode1.ont.io:10339'],
    },
    public: {
      http: ['https://dappnode1.ont.io:10339'],
    },
  },
  name: `Ontology Mainnet`,
  nativeCurrency: {
    name: 'ONG',
    symbol: 'ONG',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: {
      name: 'Ontology Explorer',
      url: 'https://explorer.ont.io',
    },
    default: {
      name: 'Ontology Explorer',
      url: 'https://explorer.ont.io',
    },
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

const okx = {
  id: 66,
  network: `OKXChain`,
  rpcUrls: {
    default: {
      http: ['https://exchainrpc.okex.org'],
    },
    public: {
      http: ['https://exchainrpc.okex.org'],
    },
  },
  name: `OKXChain`,
  nativeCurrency: {
    name: 'OKT',
    symbol: 'OKT',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'X Layer', url: 'https://www.oklink.com/xlayer' },
    default: { name: 'X Layer', url: 'https://www.oklink.com/xlayer' },
  },
};

const fncy = {
  id: 73,
  network: `FNCY`,
  rpcUrls: {
    default: {
      http: ['https://fncy-seed1.fncy.world'],
    },
    public: {
      http: ['https://fncy-seed1.fncy.world'],
    },
  },
  name: `FNCY`,
  nativeCurrency: {
    name: 'FNCY',
    symbol: 'FNCY',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'Fncyscan', url: 'https://fncyscan.fncy.world' },
    default: { name: 'Fncyscan', url: 'https://fncyscan.fncy.world' },
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

const arbitrumMainnet = {
  id: 42161,
  network: `Arbitrum`,
  rpcUrls: {
    default: {
      http: ['https://arbitrum.llamarpc.com'],
    },
    public: {
      http: ['https://arbitrum.llamarpc.com'],
    },
  },
  name: `Arbitrum`,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'Arbiscan', url: 'https://arbiscan.io/' },
    default: { name: 'Arbiscan', url: 'https://arbiscan.io/' },
  },
};

const base = {
  id: 8453,
  network: `Base LlamaNodes`,
  rpcUrls: {
    default: {
      http: ['https://base.llamarpc.com'],
    },
    public: {
      http: ['https://base.llamarpc.com'],
    },
  },
  name: `Base`,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'BaseScan', url: 'https://basescan.org/' },
    default: { name: 'BaseScan', url: 'https://basescan.org/' },
  },
};

const avalanche = {
  id: 43114,
  network: `Avalanche`,
  rpcUrls: {
    default: {
      http: ['https://api.avax.network/ext/bc/C/rpc'],
    },
    public: {
      http: ['https://api.avax.network/ext/bc/C/rpc'],
    },
  },
  name: `Avalanche`,
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io/' },
    default: { name: 'SnowTrace', url: 'https://snowtrace.io/' },
  },
};

const linea = {
  id: 59144,
  network: `Linea`,
  rpcUrls: {
    default: {
      http: ['https://linea.blockpi.network/v1/rpc/public'],
    },
    public: {
      http: ['https://linea.blockpi.network/v1/rpc/public'],
    },
  },
  name: `Linea`,
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: {
      name: 'Linea Mainnet Explorer',
      url: 'https://lineascan.build/',
    },
    default: {
      name: 'Linea Mainnet Explorer',
      url: 'https://lineascan.build/',
    },
  },
};

const crab = {
  id: 59144,
  network: `Crab`,
  rpcUrls: {
    default: {
      http: ['https://crab-rpc.darwinia.network'],
    },
    public: {
      http: ['https://crab-rpc.darwinia.network'],
    },
  },
  name: `Crab`,
  nativeCurrency: {
    name: 'CRAB',
    symbol: 'CRAB',
    decimals: 18,
  },
  blockExplorers: {
    etherscan: {
      name: 'Subscan',
      url: 'https://crab.subscan.io/',
    },
    default: {
      name: 'Subscan',
      url: 'https://crab.subscan.io/',
    },
  },
};

export const chains = [
  bscMainnet,
  bscTestnet,
  polygonMainnet,
  ethMainnet,
  goerliTestnet,
  arbitrumMainnet,
  base,
  avalanche,
  optimism,
  linea,
  crab,
  syscoin,
  ontology,
  okx,
  fncy,
];
