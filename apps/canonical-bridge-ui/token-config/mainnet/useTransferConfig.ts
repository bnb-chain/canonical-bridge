import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  cBridge,
  deBridge,
  ICBridgeTransferConfig,
  ICustomizedBridgeConfig,
  IDeBridgeTransferConfig,
  IMesonTransferConfig,
  IStargateTransferConfig,
  layerZero,
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
      const [cBridgeRes, deBridgeRes, stargateRes, mesonRes] = await Promise.all([
        axios.get<{ data: ICBridgeTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/cbridge`),
        axios.get<{ data: IDeBridgeTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/debridge`),
        axios.get<{ data: IStargateTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/stargate`),
        axios.get<{ data: IMesonTransferConfig }>(`${env.SERVER_ENDPOINT}/api/bridge/meson`),
      ]);

      const cBridgeConfig = cBridgeRes.data.data;
      const deBridgeConfig = deBridgeRes.data.data;
      const mesonConfig = mesonRes.data.data;
      const stargateConfig = stargateRes.data.data;

      const transferConfig: ICustomizedBridgeConfig['transfer'] = {
        defaultFromChainId: 1,
        defaultToChainId: 56,
        defaultTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        defaultAmount: '',
        chainConfigs: chains,
        providers: [
          cBridge({
            config: cBridgeConfig,
            excludedChains: [],
            excludedTokens: {
              56: ['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'],
              42161: [
                '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
                '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
              ], // ['USDT', 'USDC.e']
            },
          }),
          deBridge({
            config: handleDeBridgeConfig(deBridgeConfig),
            excludedChains: [],
            excludedTokens: {
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
          }),
          stargate({
            config: stargateConfig,
            excludedChains: [],
            excludedTokens: {},
          }),
          layerZero({
            config: layerZeroConfig,
            excludedChains: [],
            excludedTokens: {},
          }),
          meson({
            config: mesonConfig,
            excludedChains: [],
            excludedTokens: {
              42161: ['SOL'],
            },
          }),
        ],
      };

      setTransferConfig(transferConfig);
    };

    initConfig();
  }, []);

  return transferConfig;
}

function handleDeBridgeConfig(rawConfig?: IDeBridgeTransferConfig) {
  if (!rawConfig) return;

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
