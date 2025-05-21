import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  cBridge,
  deBridge,
  ICBridgeTransferConfig,
  ICustomizedBridgeConfig,
  IDeBridgeTransferConfig,
  IMayanTransferConfig,
  IMesonTransferConfig,
  IStargateTransferConfig,
  layerZero,
  mayan,
  meson,
  stargate,
} from '@bnb-chain/canonical-bridge-widget';

import { env } from '@/core/env';
import layerZeroConfig from '@/token-config/mainnet/layerZero/config.json';
import { chains } from '@/token-config/mainnet/chains';

export function useTransferConfig() {
  const [transferConfig, setTransferConfig] = useState<ICustomizedBridgeConfig['transfer']>();

  useEffect(() => {
    const initConfig = async () => {
      const [cBridgeRes, deBridgeRes, stargateRes, mesonRes, mayanRes] = await Promise.all([
        axios.get<{ data: ICBridgeTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/v2/cbridge`),
        axios.get<{ data: IDeBridgeTransferConfig }>(
          `${env.SERVER_ENDPOINT}/api/bridge/v2/debridge`,
        ),
        axios.get<{ data: IStargateTransferConfig }>(
          `${env.SERVER_ENDPOINT}/api/bridge/v2/stargate`,
        ),
        axios.get<{ data: IMesonTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/v2/meson`),
        axios.get<{ data: IMayanTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/v2/mayan`),
      ]);

      const cBridgeConfig = cBridgeRes.data.data;
      const deBridgeConfig = deBridgeRes.data.data;
      const mesonConfig = mesonRes.data.data;
      const stargateConfig = stargateRes.data.data;
      const mayanConfig = mayanRes.data.data;

      const transferConfig: ICustomizedBridgeConfig['transfer'] = {
        defaultFromChainId: 1,
        defaultToChainId: 56,
        defaultTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        defaultAmount: '',
        chainOrders: [56, 204, 1, 42161, 8453, 728126428, 7565164, 137, 43114, 81457, 59144, 10],
        tokenOrders: [
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
        chainConfigs: chains,
        providers: [
          // cBridge({
          //   config: cBridgeConfig,
          //   excludedChains: [],
          //   excludedTokens: {
          //     56: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
          //     42161: [
          //       '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
          //       '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
          //     ], // ['USDT', 'USDC.e']
          //   },
          // }),
          // deBridge({
          //   config: deBridgeConfig,
          //   excludedChains: [],
          //   excludedTokens: {
          //     1: ['cUSDCv3', '0x5e21d1ee5cf0077b314c381720273ae82378d613'],
          //     56: [
          //       '0x67d66e8ec1fd25d98b3ccd3b19b7dc4b4b7fc493',
          //       '0x0000000000000000000000000000000000000000',
          //       '0x9c7beba8f6ef6643abd725e45a4e8387ef260649',
          //     ],
          //     137: ['cUSDCv3'],
          //     42161: ['cUSDCv3'],
          //     43114: ['BNB'],
          //     7565164: [
          //       'So11111111111111111111111111111111111111112',
          //       'FmqVMWXBESyu4g6FT1uz1GABKdJ4j6wbuuLFwPJtqpmu',
          //       '2kaRSuDcz1V1kqq1sDmP23Wy98jutHQQgr5fGDWRpump',
          //       '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
          //     ],
          //   },
          // }),
          // stargate({
          //   config: stargateConfig,
          //   excludedChains: [],
          //   excludedTokens: {},
          // }),
          // layerZero({
          //   config: layerZeroConfig,
          //   excludedChains: [],
          //   excludedTokens: {},
          // }),
          // meson({
          //   config: mesonConfig,
          //   excludedChains: [],
          //   excludedTokens: {
          //     42161: ['SOL'],
          //   },
          // }),
          mayan({
            config: mayanConfig,
            excludedChains: [],
            excludedTokens: {},
          }),
        ],
      };

      setTransferConfig(transferConfig);
    };

    initConfig();
  }, []);

  return transferConfig;
}
