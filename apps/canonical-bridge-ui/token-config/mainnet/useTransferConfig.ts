import { useEffect, useState } from 'react';
import {
  ICBridgeTransferConfig,
  IDeBridgeTransferConfig,
  ITransferConfig,
  IMesonChain,
  IStargateApiTokenConfig,
} from '@bnb-chain/canonical-bridge-widget';
import axios from 'axios';

import { env } from '@/core/env';
import layerZeroConfig from '@/token-config/mainnet/layerZero/config.json';

export function useTransferConfig() {
  const [transferConfig, setTransferConfig] = useState<ITransferConfig>();

  useEffect(() => {
    const initConfig = async () => {
      const [cBridgeRes, deBridgeRes, stargateRes, mesonRes] = await Promise.all([
        axios.get<{ data: ICBridgeTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/cbridge`),
        axios.get<{ data: IDeBridgeTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/debridge`),
        axios.get<{ data: IStargateApiTokenConfig[] }>(
          `${env.SERVER_ENDPOINT}/api/bridge/stargate`,
        ),
        axios.get<{ data: IMesonChain[] }>(`${env.SERVER_ENDPOINT}/api/bridge/meson`),
      ]);

      const cBridgeConfig = cBridgeRes.data.data;
      const deBridgeConfig = deBridgeRes.data.data;
      const mesonConfig = mesonRes.data.data;
      const stargateConfig = stargateRes.data.data;

      const transferConfig: ITransferConfig = {
        defaultSelectedInfo: {
          fromChainId: 1,
          toChainId: 56,
          tokenSymbol: 'USDT', // USDT
          amount: '',
        },
        order: {
          chains: [56, 204, 1, 42161, 8453, 728126428, 7565164, 137, 43114, 81457, 59144, 10],
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
            'BTC',
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
          324: {
            '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4': 'USDC',
            '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4': 'USDC.e',
          },
          1101: {
            '0x37eAA0eF3549a5Bb7D431be78a3D99BD360d19e5': 'USDC.e',
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
        cBridge: cBridgeConfig
          ? {
              config: cBridgeConfig,
              exclude: {
                chains: [],
                tokens: {
                  56: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
                  42161: [
                    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
                    '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
                  ], // ['USDT', 'USDC.e']
                },
              },
              bridgedTokenGroups: [],
            }
          : undefined,
        deBridge: deBridgeConfig
          ? {
              config: handleDeBridgeConfig(deBridgeRes.data.data),
              exclude: {
                chains: [],
                tokens: {
                  1: ['cUSDCv3', '0x5e21d1ee5cf0077b314c381720273ae82378d613'],
                  56: [
                    '0x67d66e8ec1fd25d98b3ccd3b19b7dc4b4b7fc493',
                    '0x0000000000000000000000000000000000000000',
                    '0x9c7beba8f6ef6643abd725e45a4e8387ef260649',
                  ],
                  137: ['cUSDCv3'],
                  42161: ['cUSDCv3'],
                  43114: ['BNB'],
                  7565164: [
                    'So11111111111111111111111111111111111111112',
                    'FmqVMWXBESyu4g6FT1uz1GABKdJ4j6wbuuLFwPJtqpmu',
                  ],
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
            }
          : undefined,
        stargate: stargateConfig
          ? {
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
            }
          : undefined,
        layerZero: layerZeroConfig
          ? {
              config: layerZeroConfig,
              exclude: {
                chains: [],
                tokens: {},
              },
              bridgedTokenGroups: [],
            }
          : undefined,
        meson: mesonConfig
          ? {
              config: mesonConfig,
              exclude: {
                chains: [],
                tokens: { 42161: ['SOL'] },
              },
              bridgedTokenGroups: [],
            }
          : undefined,
      };

      setTransferConfig(transferConfig);
    };

    initConfig();
  }, []);

  return transferConfig;
}

function handleDeBridgeConfig(rawConfig: IDeBridgeTransferConfig) {
  const deBridgeConfig = {
    ...rawConfig,
  };

  const extraConfigs: Record<number, any[]> = {
    1: [
      {
        action: 'replace',
        target: '0xebd9d99a3982d547c5bb4db7e3b1f9f14b67eb83',
        data: {
          address: '0x2dfF88A56767223A5529eA5960Da7A3F5f766406',
          symbol: 'ID',
          decimals: 18,
          name: 'SPACE ID',
          logoURI: '',
          eip2612: false,
          tags: ['tokens'],
        },
      },
      {
        action: 'append',
        data: {
          address: '0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898',
          symbol: 'Cake',
          decimals: 18,
          name: 'PancakeSwap Token',
          logoURI: '',
          eip2612: false,
          tags: ['tokens'],
        },
      },
    ],
  };

  Object.entries(deBridgeConfig.tokens).forEach(([key, value]) => {
    const chainId = Number(key);
    const extraConfig = extraConfigs[chainId];

    if (extraConfig) {
      extraConfig.forEach((item) => {
        const { action, target, data } = item;
        if (!value[data.address]) {
          if (action === 'replace') {
            const index = value.findIndex((item) => item.address === target);
            if (index > -1) {
              value[index] = data;
            }
          } else if (action === 'append') {
            (value as any).push(data);
          }
        }
      });
    }
  });

  return deBridgeConfig;
}
