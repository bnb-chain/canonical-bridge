import { IChainConfig } from '@bnb-chain/canonical-bridge-widget';

export const chains: IChainConfig[] = [
  {
    id: 1,
    name: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://ethereum-rpc.publicnode.com/',
    explorer: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  {
    id: 10,
    name: 'Optimism',
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
  },
  {
    id: 14,
    name: 'Flare',
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
  },
  {
    id: 57,
    name: 'Syscoin',
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
  },
  {
    id: 58,
    name: 'Ontology',
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
  },
  {
    id: 66,
    name: 'OKXChain',
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
  },
  {
    id: 128,
    name: 'Huobi ECO Chain',
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
  },
  {
    id: 137,
    name: 'Polygon',
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
  },
  {
    id: 169,
    name: 'Manta Pacific',
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
  },
  {
    id: 196,
    name: 'X Layer',
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
  },
  {
    id: 204,
    name: 'opBNB',
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
  },
  {
    id: 248,
    name: 'Oasys',
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
  },
  {
    id: 314,
    name: 'Filecoin',
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
  },
  {
    id: 324,
    name: 'zkSync',
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
  },
  {
    id: 416,
    name: 'SX Network',
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
  },
  {
    id: 1088,
    name: 'Metis Andromeda',
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
  },
  {
    id: 1625,
    name: 'Gravity Alpha',
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
  },
  {
    id: 2001,
    name: 'Milkomeda C1',
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
  },
  {
    id: 2002,
    name: 'Milkomeda A1',
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
  },
  {
    id: 8217,
    name: 'Klaytn',
    nativeCurrency: {
      name: 'KLAY',
      symbol: 'KLAY',
      decimals: 18,
    },
    rpcUrl: 'https://klaytn.blockpi.network/v1/rpc/public',
    explorer: {
      name: 'Klaytnscope',
      url: 'https://scope.klaytn.com',
    },
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
  },
  {
    id: 42220,
    name: 'Celo',
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
  },
  {
    id: 43114,
    name: 'Avalanche',
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
  },
  {
    id: 71402,
    name: 'Godwoken',
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
  },
  {
    id: 112358,
    name: 'Metachain One',
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
  },
  {
    id: 167000,
    name: 'Taiko',
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
  },
  {
    id: 210425,
    name: 'PlatON',
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
  },
  {
    id: 1313161554,
    name: 'Aurora',
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
  },
  {
    id: 728126428,
    name: 'Tron',
    nativeCurrency: {
      name: 'TRX',
      symbol: 'TRX',
      decimals: 6,
    },
    rpcUrl: 'https://api.trongrid.io',
    explorer: {
      name: 'Tron Scan',
      url: 'https://tronscan.io/',
      tokenUrlPattern: 'https://tronscan.io/#/token20/{0}',
    },
    chainType: 'tron',
  },
];
