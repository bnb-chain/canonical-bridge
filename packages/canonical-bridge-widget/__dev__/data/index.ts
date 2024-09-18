import { IBridgeConfig } from '@/modules/aggregator/types';
import { chains } from '@/dev/data/chains';
import { testnetChains } from '@/dev/data/chains-testnet';

import cBridgeConfig from './cbridge/config.json';
import deBridgeConfig from './deBridge';
import stargateConfig from './stargate/config.json';
import layerZeroConfig from './layerZero/config.json';

export const bridgeConfig: IBridgeConfig = {
  defaultSelectedInfo: {
    fromChainId: 1,
    toChainId: 56,
    tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    amount: '',
  },
  order: {
    // [Ethereum, Arbitrum, Base, Tron, Solana, Polygon, Avalanche, Blast, Linea, Optimism]
    chains: [56, 204, 1, 42161, 8453, 1000, 7565164, 137, 43114, 81457, 59144, 10],
    tokens: [
      'USDC',
      'USDT',
      'FDUSD',
      'USDC.e',
      'ETH',
      'wBETH',
      'wstETH',
      'weETH',
      'CAKE',
      'UNI',
      'AAVE',
      'LDO',
      'LINK',
      'BTCB',
      'WBTC',
      'sUSDe',
      'DOGE',
      'ADA',
      'DAI',
      'XRP',
      'PEPE',
      'ELON',
      'FLOKI',
      'MAGA',
      'BabyDoge',
      'BABYGROK',
      'PLANET',
      'OMNI',
      'AGI',
      'FET',
      'AIOZ',
      'AI',
      'NFP',
      'CGPT',
      'PHB',
      'ZIG',
      'NUM',
      'GHX',
      'PENDLE',
      'RDNT',
      'ROSE',
      'HOOK',
      'MASK',
      'EDU',
      'MBOX',
      'BNX',
    ],
  },
  displayTokenSymbols: {
    10: {
      '0x7F5c764cBc14f9669B88837ca1490cCa17c31607': 'USDC.e',
    },
    56: {
      '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': 'ETH',
    },
    137: {
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'USDC.e',
    },
    42161: {
      '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8': 'USDC.e',
    },
    43114: {
      '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664': 'USDC.e',
      '0xc7198437980c041c805A1EDcbA50c1Ce5db95118': 'USDT.e',
      '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB': 'WETH.e',
    },
  },
  chainConfigs: [...chains, ...testnetChains],
  cBridge: {
    config: cBridgeConfig,
    exclude: {
      chains: [1990, 73772, 12340001, 12360001, 12370001, 999999996, 999999997, 16350],
      tokens: {
        56: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
        42161: [
          '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        ], // ['USDT', 'USDC.e']
      },
    },
    bridgedTokenGroups: [],
  },
  deBridge: {
    config: deBridgeConfig,
    exclude: {
      chains: [7565164, 100000001, 100000002, 100000003],
      tokens: {
        1: ['cUSDCv3'],
        56: ['0x67d66e8ec1fd25d98b3ccd3b19b7dc4b4b7fc493'],
        137: ['cUSDCv3'],
        42161: ['cUSDCv3'],
        43114: ['BNB'],
      },
    },
    bridgedTokenGroups: [
      ['USDT', 'USDT.e'],
      ['USDC', 'USDC.e'],
      ['WETH', 'WETH.e'],
      ['DAI', 'DAI.e'],
      ['WBTC', 'WBTC.e'],
      ['LINK', 'LINK.e'],
      ['AAVE', 'AAVE.e'],
      ['WOO', 'WOO.e'],
      ['BUSD', 'BUSD.e'],
      ['ALPHA', 'ALPHA.e'],
      ['SUSHI', 'SUSHI.e'],
      ['SWAP', 'SWAP.e'],
    ],
  },
  stargate: {
    config: stargateConfig,
    exclude: {
      chains: [],
      tokens: {},
    },
    bridgedTokenGroups: [
      ['ETH', 'mETH'],
      ['USDT', 'm.USDT'],
      ['USDC', 'USDC.e'],
    ],
  },
  layerZero: {
    config: layerZeroConfig,
    exclude: {
      chains: [],
      tokens: {},
    },
    bridgedTokenGroups: [],
  },
};
