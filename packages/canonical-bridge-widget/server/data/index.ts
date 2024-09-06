// cBridge

import { BridgeConfigsResponse } from '@/modules/bridges';

import cBridgeConfigs from './cbridge/transfer_configs.json';
// deBridge
import deBridgeChainList from './debridge/chain_list.json';
import deBridgeTokenList1 from './debridge/token_list/chain_id_1.json';
import deBridgeTokenList10 from './debridge/token_list/chain_id_10.json';
import deBridgeTokenList56 from './debridge/token_list/chain_id_56.json';
import deBridgeTokenList137 from './debridge/token_list/chain_id_137.json';
import deBridgeTokenList8453 from './debridge/token_list/chain_id_8453.json';
import deBridgeTokenList42161 from './debridge/token_list/chain_id_42161.json';
import deBridgeTokenList43114 from './debridge/token_list/chain_id_43114.json';
import deBridgeTokenList59144 from './debridge/token_list/chain_id_59144.json';
import deBridgeTokenList7565164 from './debridge/token_list/chain_id_7565164.json';
import deBridgeTokenList100000001 from './debridge/token_list/chain_id_100000001.json';
import deBridgeTokenList100000002 from './debridge/token_list/chain_id_100000002.json';
import deBridgeTokenList100000003 from './debridge/token_list/chain_id_100000003.json';
// stargate
import starGateConfigs from './stargate/stargate-configs.json';
// layerZero
import layerZeroConfigs from './layerzero/layerzero-configs.json';

const deBridgeConfigs = {
  chains: deBridgeChainList.chains,
  tokens: {
    1: Object.values(deBridgeTokenList1.tokens),
    10: Object.values(deBridgeTokenList10.tokens),
    56: Object.values(deBridgeTokenList56.tokens),
    137: Object.values(deBridgeTokenList137.tokens),
    8453: Object.values(deBridgeTokenList8453.tokens),
    42161: Object.values(deBridgeTokenList42161.tokens),
    43114: Object.values(deBridgeTokenList43114.tokens),
    59144: Object.values(deBridgeTokenList59144.tokens),
    7565164: Object.values(deBridgeTokenList7565164.tokens),
    100000001: Object.values(deBridgeTokenList100000001.tokens),
    100000002: Object.values(deBridgeTokenList100000002.tokens),
    100000003: Object.values(deBridgeTokenList100000003.tokens),
  },
};

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
    configs: deBridgeConfigs,
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
