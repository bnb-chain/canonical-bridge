import { IChainConfig } from '@bnb-chain/canonical-bridge-widget';

export const chains: IChainConfig[] = [
  {
    chainType: 'evm',
    id: 56,
    name: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://bsc-dataseed.bnbchain.org'] } },
    blockExplorers: {
      default: { name: 'bscscan', url: 'https://bscscan.com' },
    },
  },
  {
    chainType: 'evm',
    id: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://ethereum-rpc.publicnode.com/'] },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://etherscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 10,
    name: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.optimism.io'] } },
    blockExplorers: {
      default: {
        name: 'OP Mainnet Explorer',
        url: 'https://optimistic.etherscan.io',
      },
    },
  },
  {
    chainType: 'evm',
    id: 14,
    name: 'Flare',
    nativeCurrency: { name: 'FLR', symbol: 'FLR', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://flare-api.flare.network/ext/bc/C/rpc'] },
    },
    blockExplorers: {
      default: { name: 'Flare Scan', url: 'https://flarescan.com/' },
    },
  },
  {
    chainType: 'evm',
    id: 25,
    name: 'Cronos',
    nativeCurrency: { name: 'CRO', symbol: 'CRO', decimals: 18 },
    rpcUrls: { default: { http: ['https://evm.cronos.org'] } },
    blockExplorers: {
      default: { name: 'Crono Scan', url: 'https://cronoscan.com/' },
    },
  },
  {
    chainType: 'evm',
    id: 44,
    name: 'Crab Network',
    nativeCurrency: {
      name: 'Crab Network Native Token',
      symbol: 'CRAB',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://crab-rpc.darwinia.network'] } },
    blockExplorers: {
      default: {
        name: 'Crab explorer',
        url: 'https://crab-scan.darwinia.network',
      },
    },
  },
  {
    chainType: 'evm',
    id: 57,
    name: 'Syscoin',
    nativeCurrency: { name: 'Syscoin', symbol: 'SYS', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.syscoin.org'] } },
    blockExplorers: {
      default: {
        name: 'Syscoin Block Explorer',
        url: 'https://explorer.syscoin.org',
      },
    },
  },
  {
    chainType: 'evm',
    id: 58,
    name: 'Ontology',
    nativeCurrency: { name: 'ONG', symbol: 'ONG', decimals: 18 },
    rpcUrls: { default: { http: ['https://dappnode1.ont.io:10339'] } },
    blockExplorers: {
      default: { name: 'explorer', url: 'https://explorer.ont.io' },
    },
  },
  {
    chainType: 'evm',
    id: 66,
    name: 'OKXChain',
    nativeCurrency: {
      name: 'OKXChain Global Utility Token',
      symbol: 'OKT',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://exchainrpc.okex.org'] } },
    blockExplorers: {
      default: { name: 'oklink', url: 'https://www.oklink.com/oktc' },
    },
  },
  {
    chainType: 'evm',
    id: 73,
    name: 'FNCY',
    nativeCurrency: { name: 'FNCY', symbol: 'FNCY', decimals: 18 },
    rpcUrls: { default: { http: ['https://fncy-seed1.fncy.world'] } },
    blockExplorers: {
      default: { name: 'fncy scan', url: 'https://fncyscan.fncy.world' },
    },
  },
  {
    chainType: 'evm',
    id: 100,
    name: 'Gnosis',
    nativeCurrency: { name: 'xDAI', symbol: 'XDAI', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.gnosischain.com'] } },
    blockExplorers: {
      default: { name: 'gnosisscan', url: 'https://gnosisscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 128,
    name: 'Huobi ECO Chain',
    nativeCurrency: {
      name: 'Huobi ECO Chain Native Token',
      symbol: 'HT',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['https://http-mainnet.hecochain.com'] },
    },
    blockExplorers: {
      default: {
        name: 'hecoinfo',
        url: 'https://hecoinfo.com',
        tokenUrlPattern: 'https://hecoscan.io/#/token20/{0}',
      },
    },
  },
  {
    chainType: 'evm',
    id: 137,
    name: 'Polygon',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: { default: { http: ['https://polygon-rpc.com'] } },
    blockExplorers: {
      default: { name: 'polygonscan', url: 'https://polygonscan.com' },
    },
  },
  {
    chainType: 'evm',
    id: 169,
    name: 'Manta Pacific',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://pacific-rpc.manta.network/http'] },
    },
    blockExplorers: {
      default: {
        name: 'manta-pacific Explorer',
        url: 'https://pacific-explorer.manta.network',
      },
    },
  },
  {
    chainType: 'evm',
    id: 196,
    name: 'X Layer',
    nativeCurrency: {
      name: 'X Layer Global Utility Token',
      symbol: 'OKB',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://rpc.xlayer.tech'] } },
    blockExplorers: {
      default: { name: 'OKLink', url: 'https://www.oklink.com/xlayer' },
    },
  },
  {
    chainType: 'evm',
    id: 204,
    name: 'opBNB',
    nativeCurrency: {
      name: 'BNB Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
    },
    blockExplorers: {
      default: { name: 'opbnbscan', url: 'https://mainnet.opbnbscan.com' },
    },
  },
  {
    chainType: 'evm',
    id: 223,
    name: 'b2',
    nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.bsquared.network'] } },
    blockExplorers: {
      default: {
        name: 'B2 Network Explorer',
        url: 'https://explorer.bsquared.network',
      },
    },
  },
  {
    chainType: 'evm',
    id: 248,
    name: 'Oasys',
    nativeCurrency: { name: 'OAS', symbol: 'OAS', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.mainnet.oasys.games'] } },
    blockExplorers: {
      default: {
        name: 'Oasys-Mainnet explorer',
        url: 'https://explorer.oasys.games',
      },
    },
  },
  {
    chainType: 'evm',
    id: 250,
    name: 'Fantom Opera',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpcapi.fantom.network'] } },
    blockExplorers: {
      default: { name: 'ftmscan', url: 'https://ftmscan.com' },
    },
  },
  {
    chainType: 'evm',
    id: 255,
    name: 'Kroma',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://api.kroma.network'] } },
    blockExplorers: {
      default: { name: 'Kroma Scan', url: 'https://kromascan.com' },
    },
  },
  {
    chainType: 'evm',
    id: 288,
    name: 'Boba Network',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.boba.network'] } },
    blockExplorers: {
      default: { name: 'Bobascan', url: 'https://bobascan.com' },
    },
  },
  {
    chainType: 'evm',
    id: 314,
    name: 'Filecoin',
    nativeCurrency: { name: 'filecoin', symbol: 'FIL', decimals: 18 },
    rpcUrls: { default: { http: ['https://api.node.glif.io'] } },
    blockExplorers: {
      default: { name: 'Filfox', url: 'https://filfox.info/en' },
    },
  },
  {
    chainType: 'evm',
    id: 324,
    name: 'zkSync',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.era.zksync.io'] } },
    blockExplorers: {
      default: {
        name: 'zkSync Era Block Explorer',
        url: 'https://explorer.zksync.io',
        tokenUrlPattern: 'https://explorer.zksync.io/address/{0}',
      },
    },
  },
  {
    chainType: 'evm',
    id: 336,
    name: 'Shiden',
    nativeCurrency: { name: 'Shiden', symbol: 'SDN', decimals: 18 },
    rpcUrls: { default: { http: ['https://shiden.public.blastapi.io'] } },
    blockExplorers: {
      default: { name: 'subscan', url: 'https://shiden.subscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 416,
    name: 'SX Network',
    nativeCurrency: { name: 'SX Network', symbol: 'SX', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.sx.technology'] } },
    blockExplorers: {
      default: {
        name: 'SX Network Explorer',
        url: 'https://explorer.sx.technology',
      },
    },
  },
  {
    chainType: 'evm',
    id: 592,
    name: 'Astar',
    nativeCurrency: { name: 'Astar', symbol: 'ASTR', decimals: 18 },
    rpcUrls: { default: { http: ['https://evm.astar.network'] } },
    blockExplorers: {
      default: { name: 'subscan', url: 'https://astar.subscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 1024,
    name: 'CLV Parachain',
    nativeCurrency: { name: 'CLV', symbol: 'CLV', decimals: 18 },
    rpcUrls: { default: { http: ['https://api-para.clover.finance'] } },
    blockExplorers: {
      default: {
        name: 'CLV Blockchain Explore',
        url: 'https://clvscan.com/',
      },
    },
  },
  {
    chainType: 'evm',
    id: 1030,
    name: 'Conflux eSpace',
    nativeCurrency: { name: 'CFX', symbol: 'CFX', decimals: 18 },
    rpcUrls: { default: { http: ['https://evm.confluxrpc.com'] } },
    blockExplorers: {
      default: {
        name: 'Conflux Scan',
        url: 'https://evm.confluxscan.net',
      },
    },
  },
  {
    chainType: 'evm',
    id: 1088,
    name: 'Metis Andromeda',
    nativeCurrency: { name: 'Metis', symbol: 'METIS', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://andromeda.metis.io/?owner=1088'] },
    },
    blockExplorers: {
      default: {
        name: 'Metis Andromeda explorer',
        url: 'https://andromeda-explorer.metis.io',
      },
    },
  },
  {
    chainType: 'evm',
    id: 1101,
    name: 'Polygon zkEVM',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://zkevm-rpc.com'] } },
    blockExplorers: {
      default: {
        name: 'PolygonScan',
        url: 'https://zkevm.polygonscan.com',
      },
    },
  },
  {
    chainType: 'evm',
    id: 1116,
    name: 'Core',
    nativeCurrency: { name: 'CORE', symbol: 'CORE', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.coredao.org'] } },
    blockExplorers: {
      default: { name: 'Core Explorer', url: 'https://scan.coredao.org' },
    },
  },
  {
    chainType: 'evm',
    id: 1284,
    name: 'Moonbeam',
    nativeCurrency: { name: 'Glimmer', symbol: 'GLMR', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.api.moonbeam.network'] } },
    blockExplorers: {
      default: { name: 'moonscan', url: 'https://moonbeam.moonscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 1285,
    name: 'Moonriver',
    nativeCurrency: { name: 'Moonriver', symbol: 'MOVR', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://rpc.api.moonriver.moonbeam.network'] },
    },
    blockExplorers: {
      default: { name: 'moonscan', url: 'https://moonriver.moonscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 1329,
    name: 'Sei Network',
    nativeCurrency: { name: 'SEI', symbol: 'SEI', decimals: 18 },
    rpcUrls: { default: { http: ['https://evm-rpc.sei-apis.com'] } },
    blockExplorers: {
      default: { name: 'Sei Scan', url: 'https://www.seiscan.app/' },
    },
  },
  {
    chainType: 'evm',
    id: 1625,
    name: 'Gravity Alpha',
    nativeCurrency: { name: 'Gravity', symbol: 'G.', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.gravity.xyz'] } },
    blockExplorers: {
      default: {
        name: 'Gravity Alpha Mainnet Explorer',
        url: 'https://explorer.gravity.xyz',
      },
    },
  },
  {
    chainType: 'evm',
    id: 2001,
    name: 'Milkomeda C1',
    nativeCurrency: { name: 'milkAda', symbol: 'mADA', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc-mainnet-cardano-evm.c1.milkomeda.com'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Blockscout',
        url: 'https://explorer-mainnet-cardano-evm.c1.milkomeda.com',
      },
    },
  },
  {
    chainType: 'evm',
    id: 2002,
    name: 'Milkomeda A1',
    nativeCurrency: { name: 'milkALGO', symbol: 'mALGO', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://rpc-mainnet-algorand-rollup.a1.milkomeda.com'],
      },
    },
    blockExplorers: { default: { name: '', url: '' } },
  },
  {
    chainType: 'evm',
    id: 2222,
    name: 'Kava',
    nativeCurrency: { name: 'Kava', symbol: 'KAVA', decimals: 18 },
    rpcUrls: { default: { http: ['https://evm.kava.io'] } },
    blockExplorers: {
      default: { name: 'Kava EVM Explorer', url: 'https://kavascan.com' },
    },
  },
  {
    chainType: 'evm',
    id: 2525,
    name: 'inEVM',
    nativeCurrency: { name: 'INJ', symbol: 'INJ', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://mainnet.rpc.inevm.com/http'] },
    },
    blockExplorers: {
      default: {
        name: 'inEVM Explorer',
        url: 'https://explorer.inevm.com',
      },
    },
  },
  {
    chainType: 'evm',
    id: 2649,
    name: 'AILayer',
    nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet-rpc.ailayer.xyz'] } },
    blockExplorers: {
      default: {
        name: 'AI Layer Explorer',
        url: 'https://mainnet-explorer.ailayer.xyz',
      },
    },
  },
  {
    chainType: 'evm',
    id: 4200,
    name: 'Merlin',
    nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.merlinchain.io'] } },
    blockExplorers: {
      default: { name: 'Merlin Scan', url: 'https://scan.merlinchain.io' },
    },
  },
  {
    chainType: 'evm',
    id: 5000,
    name: 'Mantle',
    nativeCurrency: { name: 'Mantle', symbol: 'MNT', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.mantle.xyz/'] } },
    blockExplorers: {
      default: {
        name: 'Mantle Mainnet Explorer',
        url: 'https://explorer.mantle.xyz/',
      },
    },
  },
  {
    chainType: 'evm',
    id: 6001,
    name: 'BB',
    nativeCurrency: { name: 'BB', symbol: 'BB', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://fullnode-mainnet.bouncebitapi.com'] },
    },
    blockExplorers: {
      default: { name: 'BB Scan', url: 'https://bbscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 7000,
    name: 'ZetaChain',
    nativeCurrency: { name: 'ZETA', symbol: 'ZETA', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://zetachain-evm.blockpi.network:443/v1/rpc/public'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Zeta Chain Explorer',
        url: 'https://explorer.zetachain.com/',
      },
    },
  },
  {
    chainType: 'evm',
    id: 7700,
    name: 'Canto',
    nativeCurrency: { name: 'Canto', symbol: 'CANTO', decimals: 18 },
    rpcUrls: { default: { http: ['https://canto.gravitychain.io'] } },
    blockExplorers: {
      default: {
        name: 'Canto Explorer (OKLink)',
        url: 'https://www.oklink.com/canto',
      },
    },
  },
  {
    chainType: 'evm',
    id: 8217,
    name: 'Kaia',
    nativeCurrency: {
      name: 'KAIA',
      symbol: 'KAIA',
      decimals: 18,
    },
    rpcUrls: { default: { http: 'https://public-en.node.kaia.io' } },
    explorer: {
      name: 'Kaiascope',
      url: 'https://kaiascope.com',
    },
  },
  {
    chainType: 'evm',
    id: 8453,
    name: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.base.org'] } },
    blockExplorers: {
      default: { name: 'basescan', url: 'https://basescan.org' },
    },
  },
  {
    chainType: 'evm',
    id: 8822,
    name: 'IOTA EVM',
    nativeCurrency: {
      name: 'IOTA Token',
      symbol: 'IOTA',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ['https://json-rpc.evm.iotaledger.net'] },
    },
    blockExplorers: {
      default: {
        name: 'IOTA EVM explorer',
        url: 'https://explorer.evm.iota.org',
      },
    },
  },
  {
    chainType: 'evm',
    id: 9001,
    name: 'Evmos',
    nativeCurrency: { name: 'Evmos', symbol: 'EVMOS', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://evmos-mainnet.public.blastapi.io'] },
    },
    blockExplorers: {
      default: {
        name: 'Evmos Explorer (Escan)',
        url: 'https://www.mintscan.io/evmos',
        tokenUrlPattern: 'https://www.mintscan.io/evmos/address/{0}',
      },
    },
  },
  {
    chainType: 'evm',
    id: 11501,
    name: 'BEVM',
    nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc-mainnet-1.bevm.io'] } },
    blockExplorers: {
      default: {
        name: 'BEVM Explorer',
        url: 'https://scan-mainnet.bevm.io',
      },
    },
  },
  {
    chainType: 'evm',
    id: 13000,
    name: 'SPS',
    nativeCurrency: { name: 'ECG', symbol: 'ECG', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.ssquad.games'] } },
    blockExplorers: {
      default: {
        name: 'SPS Explorer',
        url: 'http://spsscan.ssquad.games',
      },
    },
  },
  {
    chainType: 'evm',
    id: 17777,
    name: 'EOS EVM',
    nativeCurrency: { name: 'EOS', symbol: 'EOS', decimals: 18 },
    rpcUrls: { default: { http: ['https://api.evm.eosnetwork.com'] } },
    blockExplorers: {
      default: {
        name: 'EOS EVM Explorer',
        url: 'https://explorer.evm.eosnetwork.com',
      },
    },
  },
  {
    chainType: 'evm',
    id: 22776,
    name: 'MAP Protocol',
    nativeCurrency: { name: 'MAPO', symbol: 'MAPO', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.maplabs.io'] } },
    blockExplorers: {
      default: { name: 'MAPO Scan', url: 'https://maposcan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 23294,
    name: 'Oasis Sapphire',
    nativeCurrency: {
      name: 'Sapphire Rose',
      symbol: 'ROSE',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://sapphire.oasis.io'] } },
    blockExplorers: {
      default: {
        name: 'Oasis Sapphire Explorer',
        url: 'https://explorer.oasis.io/mainnet/sapphire',
      },
    },
  },
  {
    chainType: 'evm',
    id: 34443,
    name: 'Mode',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.mode.network'] } },
    blockExplorers: {
      default: {
        name: 'Mode Explorer',
        url: 'https://explorer.mode.network',
      },
    },
  },
  {
    chainType: 'evm',
    id: 42161,
    name: 'Arbitrum One',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://arb1.arbitrum.io/rpc'] } },
    blockExplorers: {
      default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 42170,
    name: 'Arbitrum Nova',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://nova.arbitrum.io/rpc'] } },
    blockExplorers: {
      default: {
        name: 'Arbitrum Nova Chain Explorer',
        url: 'https://nova-explorer.arbitrum.io',
      },
    },
  },
  {
    chainType: 'evm',
    id: 42220,
    name: 'Celo',
    nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
    rpcUrls: { default: { http: ['https://forno.celo.org'] } },
    blockExplorers: {
      default: { name: 'Celoscan', url: 'https://celoscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 42262,
    name: 'Oasis Emerald',
    nativeCurrency: {
      name: 'Emerald Rose',
      symbol: 'ROSE',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://emerald.oasis.io'] } },
    blockExplorers: {
      default: {
        name: 'Oasis Emerald Explorer',
        url: 'https://explorer.oasis.io/mainnet/emerald',
      },
    },
  },
  {
    chainType: 'evm',
    id: 42766,
    name: 'ZKFair',
    nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.zkfair.io'] } },
    blockExplorers: {
      default: { name: 'Zkfair Scan', url: 'https://scan.zkfair.io' },
    },
  },
  {
    chainType: 'evm',
    id: 43114,
    name: 'Avalanche',
    nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
    },
    blockExplorers: {
      default: { name: 'snowtrace', url: 'https://snowtrace.io' },
    },
  },
  {
    chainType: 'evm',
    id: 47805,
    name: 'REI Network',
    nativeCurrency: { name: 'REI', symbol: 'REI', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.rei.network'] } },
    blockExplorers: {
      default: { name: 'rei-scan', url: 'https://scan.rei.network' },
    },
  },
  {
    chainType: 'evm',
    id: 48900,
    name: 'Zircuit',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://zircuit-mainnet.drpc.org'] } },
    blockExplorers: {
      default: {
        name: 'Zircuit Explorer',
        url: 'https://explorer.zircuit.com',
      },
    },
  },
  {
    chainType: 'evm',
    id: 59144,
    name: 'Linea',
    nativeCurrency: {
      name: 'Linea Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: { default: { http: ['https://rpc.linea.build'] } },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://lineascan.build' },
    },
  },
  {
    chainType: 'evm',
    id: 71402,
    name: 'Godwoken',
    nativeCurrency: { name: 'pCKB', symbol: 'pCKB', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://v1.mainnet.godwoken.io/rpc'] },
    },
    blockExplorers: {
      default: {
        name: 'GWScan Block Explorer',
        url: 'https://v1.gwscan.com',
        tokenUrlPattern: 'https://v1.gwscan.com/account/{0}',
      },
    },
  },
  {
    chainType: 'evm',
    id: 81457,
    name: 'Blast',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.blast.io'] } },
    blockExplorers: {
      default: { name: 'Blastscan', url: 'https://blastscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 112358,
    name: 'Metachain One',
    nativeCurrency: { name: 'Metao', symbol: 'METAO', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.metachain.one'] } },
    blockExplorers: {
      default: {
        name: 'blockscout',
        url: 'https://explorer.metachain.one',
      },
    },
  },
  {
    chainType: 'evm',
    id: 167000,
    name: 'Taiko',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.mainnet.taiko.xyz'] } },
    blockExplorers: {
      default: { name: 'Taiko Scan', url: 'https://taikoscan.io' },
    },
  },
  {
    chainType: 'evm',
    id: 200901,
    name: 'Bitlayer Mainnet',
    nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.bitlayer.org'] } },
    blockExplorers: {
      default: { name: 'Bitlayer Scan', url: 'https://www.btrscan.com' },
    },
  },
  {
    chainType: 'evm',
    id: 210425,
    name: 'PlatON',
    nativeCurrency: { name: 'LAT', symbol: 'lat', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://openapi2.platon.network/rpc'] },
    },
    blockExplorers: {
      default: {
        name: 'PlatON explorer',
        url: 'https://scan.platon.network',
        tokenUrlPattern: 'https://scan.platon.network/tokens-detail?type=erc20&address={0}',
      },
    },
  },
  {
    chainType: 'evm',
    id: 534352,
    name: 'Scroll',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.scroll.io'] } },
    blockExplorers: {
      default: { name: 'Scrollscan', url: 'https://scrollscan.com' },
    },
  },
  {
    chainType: 'evm',
    id: 60808,
    name: 'BOB',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.gobob.xyz'] } },
    blockExplorers: {
      default: { name: 'BOB Explorer', url: 'https://explorer.gobob.xyz' },
    },
  },
  {
    chainType: 'evm',
    id: 810180,
    name: 'zkLink',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.zklink.io'] } },
    blockExplorers: {
      default: {
        name: 'ZKLink Explorer',
        url: 'https://explorer.zklink.io',
      },
    },
  },
  {
    chainType: 'evm',
    id: 888888888,
    name: 'Ancient8',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.ancient8.gg'] } },
    blockExplorers: {
      default: { name: 'Ancient8 Scan', url: 'https://scan.ancient8.gg' },
    },
  },
  {
    chainType: 'evm',
    id: 1313161554,
    name: 'Aurora',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.aurora.dev'] } },
    blockExplorers: {
      default: { name: 'aurorascan.dev', url: 'https://aurorascan.dev' },
    },
  },
  {
    chainType: 'evm',
    id: 1380012617,
    name: 'RARI Chain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://mainnet.rpc.rarichain.org/http'] },
    },
    blockExplorers: {
      default: {
        name: 'Rari Mainnet Explorer',
        url: 'https://mainnet.explorer.rarichain.org/',
      },
    },
  },
  {
    chainType: 'evm',
    id: 1482601649,
    name: 'SKALE Nebula Hub',
    nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://mainnet.skalenodes.com/v1/green-giddy-denebola'],
      },
    },
    blockExplorers: {
      default: {
        name: 'SKALE Nebula Explorer',
        url: 'https://green-giddy-denebola.explorer.mainnet.skalenodes.com',
      },
    },
  },
  {
    chainType: 'evm',
    id: 1564830818,
    name: 'SKALE Calypso',
    nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague'],
      },
    },
    blockExplorers: {
      default: {
        name: 'SKALE Calypso Hub Explorer',
        url: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com/',
      },
    },
  },
  {
    chainType: 'evm',
    id: 1666600000,
    name: 'Harmony One',
    nativeCurrency: { name: 'ONE', symbol: 'ONE', decimals: 18 },
    rpcUrls: { default: { http: ['https://api.harmony.one'] } },
    blockExplorers: {
      default: {
        name: 'Harmony Block Explorer',
        url: 'https://explorer.harmony.one',
      },
    },
  },
  {
    chainType: 'evm',
    id: 2046399126,
    name: 'SKALE Europa Hub',
    nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://mainnet.skalenodes.com/v1/elated-tan-skat'],
      },
    },
    blockExplorers: {
      default: {
        name: 'SKALE Europa Hub Explorer',
        url: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com',
      },
    },
  },
  {
    chainType: 'tron',
    id: 728126428,
    name: 'Tron',
    nativeCurrency: { name: 'TRX', symbol: 'TRX', decimals: 6 },
    rpcUrls: { default: { http: ['https://api.trongrid.io'] } },
    blockExplorers: {
      default: {
        name: 'Tron Scan',
        url: 'https://tronscan.io/',
        tokenUrlPattern: 'https://tronscan.io/#/token20/{0}',
      },
    },
  },
  {
    chainType: 'solana',
    id: 7565164,
    name: 'Solana',
    nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
    rpcUrls: {
      default: { http: ['https://solana-rpc.debridge.finance'] },
    },
    blockExplorers: {
      default: {
        name: 'Solana explorer',
        url: 'https://explorer.solana.com',
        tokenUrlPattern: 'https://explorer.solana.com/address/{0}',
      },
    },
  },
];
