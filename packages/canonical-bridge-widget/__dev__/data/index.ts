import { BridgeConfigsResponse } from '@/modules/bridges';

import cBridgeConfigs from './cbridge/transfer_configs.json';
import starGateConfigs from './stargate/stargate-configs.json';
import layerZeroConfigs from './layerzero/layerzero-configs.json';
import deBridgeConfig from './debridge';

export const bridgeConfigs: BridgeConfigsResponse = {
  version: new Date().toUTCString(),
  defaultSelectedInfo: {
    fromChainId: 1,
    toChainId: 56,
    tokenSymbol: 'USDT',
    tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    amount: '',
  },
  defaultWallets: {
    evm: {
      pc: ['trust', 'metaMask', 'okxWallet', 'binanceWeb3Wallet', 'walletConnect'],
      mobile: ['trust', 'metaMask', 'okxWallet', 'binanceWeb3Wallet', 'walletConnect'],
    },
  },
  order: {
    // [BSC, opBNB, Ethereum, Arbitrum, Base, Tron, Polygon, Avalanche, Blast, Linea, Optimism]
    chain: [56, 204, 1, 42161, 8453, 1000, 137, 43114, 81457, 59144, 10],
    token: [
      'USDC',
      'USDT',
      'FDUSD',
      'BNB',
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
  cBridge: {
    configs: cBridgeConfigs,
    exclude: {
      chains: [1990, 73772, 12340001, 12360001, 12370001, 999999996, 999999997, 16350],
      tokens: {},
    },
    bridgedTokenGroups: [],
  },
  deBridge: {
    configs: deBridgeConfig,
    exclude: {
      chains: [100000001, 100000002, 100000003],
      tokens: {
        1: ['cUSDCv3'],
        137: ['cUSDCv3'],
        42161: ['cUSDCv3'],
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
    configs: starGateConfigs,
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
    configs: layerZeroConfigs,
    exclude: {
      chains: [],
      tokens: {},
    },
    bridgedTokenGroups: [],
  },
};
