import { ChainConfig } from './types';

export const chains: ChainConfig[] = [
  {
    id: 1,
    name: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://ethereum-rpc.publicnode.com/', // TODO
    explorer: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 10,
    name: 'OP Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://mainnet.optimism.io',
    explorer: {
      name: 'OP Mainnet Explorer',
      url: 'https://optimistic.etherscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 14,
    name: 'Flare Mainnet',
    nativeCurrency: {
      name: 'FLR',
      symbol: 'FLR',
      decimals: 18,
    },
    rpcUrl: 'https://flare-api.flare.network/ext/bc/C/rpc',
    explorer: {
      name: 'Flare Scan',
      url: 'https://flarescan.com/',
    },
    chainType: 'evm',
  },
  {
    id: 44,
    name: 'Crab Network',
    nativeCurrency: {
      name: 'Crab Network Native Token',
      symbol: 'CRAB',
      decimals: 18,
    },
    rpcUrl: 'https://crab-rpc.darwinia.network',
    explorer: {
      name: 'Crab explorer',
      url: 'https://crab-scan.darwinia.network',
    },
    chainType: 'evm',
  },
  {
    id: 56,
    name: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrl: 'https://bsc-dataseed.bnbchain.org',
    explorer: {
      name: 'bscscan',
      url: 'https://bscscan.com',
    },
    chainType: 'evm',
  },
  {
    id: 57,
    name: 'Syscoin Mainnet',
    nativeCurrency: {
      name: 'Syscoin',
      symbol: 'SYS',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.syscoin.org',
    explorer: {
      name: 'Syscoin Block Explorer',
      url: 'https://explorer.syscoin.org',
    },
    chainType: 'evm',
  },
  {
    id: 58,
    name: 'Ontology Mainnet',
    nativeCurrency: {
      name: 'ONG',
      symbol: 'ONG',
      decimals: 18,
    },
    rpcUrl: 'https://dappnode1.ont.io:10339',
    explorer: {
      name: 'explorer',
      url: 'https://explorer.ont.io',
    },
    chainType: 'evm',
  },
  {
    id: 66,
    name: 'OKXChain Mainnet',
    nativeCurrency: {
      name: 'OKXChain Global Utility Token',
      symbol: 'OKT',
      decimals: 18,
    },
    rpcUrl: 'https://exchainrpc.okex.org',
    explorer: {
      name: 'oklink',
      url: 'https://www.oklink.com/oktc',
    },
    chainType: 'evm',
  },
  {
    id: 73,
    name: 'FNCY',
    nativeCurrency: {
      name: 'FNCY',
      symbol: 'FNCY',
      decimals: 18,
    },
    rpcUrl: 'https://fncy-seed1.fncy.world',
    explorer: {
      name: 'fncy scan',
      url: 'https://fncyscan.fncy.world',
    },
    chainType: 'evm',
  },
  {
    id: 100,
    name: 'Gnosis',
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'XDAI',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.gnosischain.com',
    explorer: {
      name: 'gnosisscan',
      url: 'https://gnosisscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 128,
    name: 'Huobi ECO Chain Mainnet',
    nativeCurrency: {
      name: 'Huobi ECO Chain Native Token',
      symbol: 'HT',
      decimals: 18,
    },
    rpcUrl: 'https://http-mainnet.hecochain.com',
    explorer: {
      name: 'hecoinfo',
      url: 'https://hecoinfo.com',
      tokenUrlPattern: 'https://hecoscan.io/#/token20/{0}',
    },
    chainType: 'evm',
  },
  {
    id: 137,
    name: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrl: 'https://polygon-rpc.com',
    explorer: {
      name: 'polygonscan',
      url: 'https://polygonscan.com',
    },
    chainType: 'evm',
  },
  {
    id: 169,
    name: 'Manta Pacific Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://pacific-rpc.manta.network/http',
    explorer: {
      name: 'manta-pacific Explorer',
      url: 'https://pacific-explorer.manta.network',
    },
    chainType: 'evm',
  },
  {
    id: 196,
    name: 'X Layer Mainnet',
    nativeCurrency: {
      name: 'X Layer Global Utility Token',
      symbol: 'OKB',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.xlayer.tech',
    explorer: {
      name: 'OKLink',
      url: 'https://www.oklink.com/xlayer',
    },
    chainType: 'evm',
  },
  {
    id: 204,
    name: 'opBNB Mainnet',
    nativeCurrency: {
      name: 'BNB Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrl: 'https://opbnb-mainnet-rpc.bnbchain.org',
    explorer: {
      name: 'opbnbscan',
      url: 'https://mainnet.opbnbscan.com',
    },
    chainType: 'evm',
  },
  {
    id: 248,
    name: 'Oasys Mainnet',
    nativeCurrency: {
      name: 'OAS',
      symbol: 'OAS',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.mainnet.oasys.games',
    explorer: {
      name: 'Oasys-Mainnet explorer',
      url: 'https://explorer.oasys.games',
    },
    chainType: 'evm',
  },
  {
    id: 250,
    name: 'Fantom Opera',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrl: 'https://rpcapi.fantom.network',
    explorer: {
      name: 'ftmscan',
      url: 'https://ftmscan.com',
    },
    chainType: 'evm',
  },
  {
    id: 288,
    name: 'Boba Network',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://mainnet.boba.network',
    explorer: {
      name: 'Bobascan',
      url: 'https://bobascan.com',
    },
    chainType: 'evm',
  },
  {
    id: 314,
    name: 'Filecoin - Mainnet',
    nativeCurrency: {
      name: 'filecoin',
      symbol: 'FIL',
      decimals: 18,
    },
    rpcUrl: 'https://api.node.glif.io',
    explorer: {
      name: 'Filfox',
      url: 'https://filfox.info/en',
    },
    chainType: 'evm',
  },
  {
    id: 324,
    name: 'zkSync Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://mainnet.era.zksync.io',
    explorer: {
      name: 'zkSync Era Block Explorer',
      url: 'https://explorer.zksync.io',
      tokenUrlPattern: 'https://explorer.zksync.io/address/{0}',
    },
    chainType: 'evm',
  },
  {
    id: 336,
    name: 'Shiden',
    nativeCurrency: {
      name: 'Shiden',
      symbol: 'SDN',
      decimals: 18,
    },
    rpcUrl: 'https://shiden.public.blastapi.io',
    explorer: {
      name: 'subscan',
      url: 'https://shiden.subscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 416,
    name: 'SX Network Mainnet',
    nativeCurrency: {
      name: 'SX Network',
      symbol: 'SX',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.sx.technology',
    explorer: {
      name: 'SX Network Explorer',
      url: 'https://explorer.sx.technology',
    },
    chainType: 'evm',
  },
  {
    id: 592,
    name: 'Astar',
    nativeCurrency: {
      name: 'Astar',
      symbol: 'ASTR',
      decimals: 18,
    },
    rpcUrl: 'https://evm.astar.network',
    explorer: {
      name: 'subscan',
      url: 'https://astar.subscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 1024,
    name: 'CLV Parachain',
    nativeCurrency: {
      name: 'CLV',
      symbol: 'CLV',
      decimals: 18,
    },
    rpcUrl: 'https://api-para.clover.finance',
    explorer: {
      name: 'CLV Blockchain Explore',
      url: 'https://clvscan.com/',
    },
    chainType: 'evm',
  },
  {
    id: 1030,
    name: 'Conflux eSpace',
    nativeCurrency: {
      name: 'CFX',
      symbol: 'CFX',
      decimals: 18,
    },
    rpcUrl: 'https://evm.confluxrpc.com',
    explorer: {
      name: 'Conflux Scan',
      url: 'https://evm.confluxscan.net',
    },
    chainType: 'evm',
  },
  {
    id: 1088,
    name: 'Metis Andromeda Mainnet',
    nativeCurrency: {
      name: 'Metis',
      symbol: 'METIS',
      decimals: 18,
    },
    rpcUrl: 'https://andromeda.metis.io/?owner=1088',
    explorer: {
      name: 'Metis Andromeda explorer',
      url: 'https://andromeda-explorer.metis.io',
    },
    chainType: 'evm',
  },
  {
    id: 1101,
    name: 'Polygon zkEVM',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://zkevm-rpc.com',
    explorer: {
      name: 'PolygonScan',
      url: 'https://zkevm.polygonscan.com',
    },
    chainType: 'evm',
  },
  {
    id: 1284,
    name: 'Moonbeam',
    nativeCurrency: {
      name: 'Glimmer',
      symbol: 'GLMR',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.api.moonbeam.network',
    explorer: {
      name: 'moonscan',
      url: 'https://moonbeam.moonscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 1285,
    name: 'Moonriver',
    nativeCurrency: {
      name: 'Moonriver',
      symbol: 'MOVR',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.api.moonriver.moonbeam.network',
    explorer: {
      name: 'moonscan',
      url: 'https://moonriver.moonscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 1329,
    name: 'Sei Network',
    nativeCurrency: {
      name: 'SEI',
      symbol: 'SEI',
      decimals: 18,
    },
    rpcUrl: 'https://evm-rpc.sei-apis.com',
    explorer: {
      name: 'Sei Scan',
      url: 'https://www.seiscan.app/',
    },
    chainType: 'evm',
  },
  {
    id: 1625,
    name: 'Gravity Alpha Mainnet',
    nativeCurrency: {
      name: 'Gravity',
      symbol: 'G.',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.gravity.xyz',
    explorer: {
      name: 'Gravity Alpha Mainnet Explorer',
      url: 'https://explorer.gravity.xyz',
    },
    chainType: 'evm',
  },
  {
    id: 2001,
    name: 'Milkomeda C1 Mainnet',
    nativeCurrency: {
      name: 'milkAda',
      symbol: 'mADA',
      decimals: 18,
    },
    rpcUrl: 'https://rpc-mainnet-cardano-evm.c1.milkomeda.com',
    explorer: {
      name: 'Blockscout',
      url: 'https://explorer-mainnet-cardano-evm.c1.milkomeda.com',
    },
    chainType: 'evm',
  },
  {
    id: 2002,
    name: 'Milkomeda A1 Mainnet',
    nativeCurrency: {
      name: 'milkALGO',
      symbol: 'mALGO',
      decimals: 18,
    },
    rpcUrl: 'https://rpc-mainnet-algorand-rollup.a1.milkomeda.com',
    explorer: {
      name: '',
      url: '',
    },
    chainType: 'evm',
  },
  {
    id: 2222,
    name: 'Kava',
    nativeCurrency: {
      name: 'Kava',
      symbol: 'KAVA',
      decimals: 18,
    },
    rpcUrl: 'https://evm.kava.io',
    explorer: {
      name: 'Kava EVM Explorer',
      url: 'https://kavascan.com',
    },
    chainType: 'evm',
  },
  {
    id: 5000,
    name: 'Mantle',
    nativeCurrency: {
      name: 'Mantle',
      symbol: 'MNT',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.mantle.xyz/',
    explorer: {
      name: 'Mantle Mainnet Explorer',
      url: 'https://explorer.mantle.xyz/',
    },
    chainType: 'evm',
  },
  {
    id: 7700,
    name: 'Canto',
    nativeCurrency: {
      name: 'Canto',
      symbol: 'CANTO',
      decimals: 18,
    },
    rpcUrl: 'https://canto.gravitychain.io',
    explorer: {
      name: 'Canto Explorer (OKLink)',
      url: 'https://www.oklink.com/canto',
    },
    chainType: 'evm',
  },
  {
    id: 8217,
    name: 'Klaytn Mainnet Cypress',
    nativeCurrency: {
      name: 'KLAY',
      symbol: 'KLAY',
      decimals: 18,
    },
    rpcUrl: 'https://public-en-cypress.klaytn.net',
    explorer: {
      name: 'Klaytnscope',
      url: 'https://scope.klaytn.com',
    },
    chainType: 'evm',
  },
  {
    id: 8453,
    name: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://mainnet.base.org',
    explorer: {
      name: 'basescan',
      url: 'https://basescan.org',
    },
    chainType: 'evm',
  },
  {
    id: 8822,
    name: 'IOTA EVM',
    nativeCurrency: {
      name: 'IOTA Token',
      symbol: 'IOTA',
      decimals: 18,
    },
    rpcUrl: 'https://json-rpc.evm.iotaledger.net',
    explorer: {
      name: 'IOTA EVM explorer',
      url: 'https://explorer.evm.iota.org',
    },
    chainType: 'evm',
  },
  {
    id: 9001,
    name: 'Evmos',
    nativeCurrency: {
      name: 'Evmos',
      symbol: 'EVMOS',
      decimals: 18,
    },
    rpcUrl: 'https://evmos-mainnet.public.blastapi.io',
    explorer: {
      name: 'Evmos Explorer (Escan)',
      url: 'https://www.mintscan.io/evmos',
      tokenUrlPattern: 'https://www.mintscan.io/evmos/address/{0}',
    },
    chainType: 'evm',
  },
  {
    id: 13000,
    name: 'SPS',
    nativeCurrency: {
      name: 'ECG',
      symbol: 'ECG',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.ssquad.games',
    explorer: {
      name: 'SPS Explorer',
      url: 'http://spsscan.ssquad.games',
    },
    chainType: 'evm',
  },
  {
    id: 16350,
    name: 'Incentiv Devnet',
    nativeCurrency: {
      name: 'Testnet INC',
      symbol: 'INC',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.ankr.com/incentiv_devnet',
    explorer: {
      name: '',
      url: '',
    },
    chainType: 'evm',
  },
  {
    id: 23294,
    name: 'Oasis Sapphire',
    nativeCurrency: {
      name: 'Sapphire Rose',
      symbol: 'ROSE',
      decimals: 18,
    },
    rpcUrl: 'https://sapphire.oasis.io',
    explorer: {
      name: 'Oasis Sapphire Explorer',
      url: 'https://explorer.oasis.io/mainnet/sapphire',
    },
    chainType: 'evm',
  },
  {
    id: 42161,
    name: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 42170,
    name: 'Arbitrum Nova',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://nova.arbitrum.io/rpc',
    explorer: {
      name: 'Arbitrum Nova Chain Explorer',
      url: 'https://nova-explorer.arbitrum.io',
    },
    chainType: 'evm',
  },
  {
    id: 42220,
    name: 'Celo Mainnet',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
    rpcUrl: 'https://forno.celo.org',
    explorer: {
      name: 'Celoscan',
      url: 'https://celoscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 42262,
    name: 'Oasis Emerald',
    nativeCurrency: {
      name: 'Emerald Rose',
      symbol: 'ROSE',
      decimals: 18,
    },
    rpcUrl: 'https://emerald.oasis.io',
    explorer: {
      name: 'Oasis Emerald Explorer',
      url: 'https://explorer.oasis.io/mainnet/emerald',
    },
    chainType: 'evm',
  },
  {
    id: 43114,
    name: 'Avalanche C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: {
      name: 'snowtrace',
      url: 'https://snowtrace.io',
    },
    chainType: 'evm',
  },
  {
    id: 47805,
    name: 'REI Network',
    nativeCurrency: {
      name: 'REI',
      symbol: 'REI',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.rei.network',
    explorer: {
      name: 'rei-scan',
      url: 'https://scan.rei.network',
    },
    chainType: 'evm',
  },
  {
    id: 59144,
    name: 'Linea',
    nativeCurrency: {
      name: 'Linea Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.linea.build',
    explorer: {
      name: 'Etherscan',
      url: 'https://lineascan.build',
    },
    chainType: 'evm',
  },
  {
    id: 71402,
    name: 'Godwoken Mainnet',
    nativeCurrency: {
      name: 'pCKB',
      symbol: 'pCKB',
      decimals: 18,
    },
    rpcUrl: 'https://v1.mainnet.godwoken.io/rpc',
    explorer: {
      name: 'GWScan Block Explorer',
      url: 'https://v1.gwscan.com',
      tokenUrlPattern: 'https://v1.gwscan.com/account/{0}',
    },
    chainType: 'evm',
  },
  {
    id: 81457,
    name: 'Blast',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.blast.io',
    explorer: {
      name: 'Blastscan',
      url: 'https://blastscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 112358,
    name: 'Metachain One Mainnet',
    nativeCurrency: {
      name: 'Metao',
      symbol: 'METAO',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.metachain.one',
    explorer: {
      name: 'blockscout',
      url: 'https://explorer.metachain.one',
    },
    chainType: 'evm',
  },
  {
    id: 167000,
    name: 'Taiko Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.mainnet.taiko.xyz',
    explorer: {
      name: 'Taiko Scan',
      url: 'https://taikoscan.io',
    },
    chainType: 'evm',
  },
  {
    id: 210425,
    name: 'PlatON Mainnet',
    nativeCurrency: {
      name: 'LAT',
      symbol: 'lat',
      decimals: 18,
    },
    rpcUrl: 'https://openapi2.platon.network/rpc',
    explorer: {
      name: 'PlatON explorer',
      url: 'https://scan.platon.network',
      tokenUrlPattern: 'https://scan.platon.network/tokens-detail?type=erc20&address={0}',
    },
    chainType: 'evm',
  },
  {
    id: 534352,
    name: 'Scroll',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://rpc.scroll.io',
    explorer: {
      name: 'Scrollscan',
      url: 'https://scrollscan.com',
    },
    chainType: 'evm',
  },
  {
    id: 1313161554,
    name: 'Aurora Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://mainnet.aurora.dev',
    explorer: {
      name: 'aurorascan.dev',
      url: 'https://aurorascan.dev',
    },
    chainType: 'evm',
  },
  {
    id: 1380012617,
    name: 'RARI Chain',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://mainnet.rpc.rarichain.org/http',
    explorer: {
      name: 'Rari Mainnet Explorer',
      url: 'https://mainnet.explorer.rarichain.org/',
    },
    chainType: 'evm',
  },
  {
    id: 1666600000,
    name: 'Harmony One',
    nativeCurrency: {
      name: 'ONE',
      symbol: 'ONE',
      decimals: 18,
    },
    rpcUrl: 'https://api.harmony.one',
    explorer: {
      name: 'Harmony Block Explorer',
      url: 'https://explorer.harmony.one',
    },
    chainType: 'evm',
  },
  {
    id: 7565164,
    name: 'Solana',
    nativeCurrency: {
      name: 'SOL',
      symbol: 'SOL',
      decimals: 9,
    },
    rpcUrl: '',
    explorer: {
      name: 'Solana explorer',
      url: 'https://explorer.solana.com',
      tokenUrlPattern: 'https://explorer.solana.com/address/{0}',
    },
    chainType: 'solana',
  },
];
