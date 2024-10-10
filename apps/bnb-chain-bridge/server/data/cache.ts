import {
  ICBridgeTransferConfig,
  IDeBridgeTransferConfig,
} from '@bnb-chain/canonical-bridge-widget';
import axios from 'axios';

import defaultCBridgeConfig from './cBridge/config.json';
import defaultDeBridgeConfig from './deBridge';

export const cacheInfo = {
  interval: 1000 * 60 * 5,
  data: {
    cBridgeConfig: defaultCBridgeConfig as ICBridgeTransferConfig,
    deBridgeConfig: defaultDeBridgeConfig as IDeBridgeTransferConfig,
  },
};

async function fetchConfig() {
  let cBridgeConfig: ICBridgeTransferConfig;
  let deBridgeConfig: IDeBridgeTransferConfig;

  try {
    const [cBridgeRes, deBridgeRes] = await Promise.all([
      axios.get<{ data: ICBridgeTransferConfig }>(
        `${process.env.NEXT_PUBLIC_WIDGET_SERVER_ENDPOINT}/api/bridge/cbridge`,
      ),
      axios.get<{ data: IDeBridgeTransferConfig }>(
        `${process.env.NEXT_PUBLIC_WIDGET_SERVER_ENDPOINT}/api/bridge/debridge`,
      ),
    ]);

    cBridgeConfig = cBridgeRes.data.data;
    deBridgeConfig = handleDeBridgeConfig(deBridgeRes.data.data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    cBridgeConfig = defaultCBridgeConfig;
    deBridgeConfig = handleDeBridgeConfig(defaultDeBridgeConfig);
  }

  cacheInfo.data = {
    cBridgeConfig,
    deBridgeConfig,
  };
}

export async function startConfigTask() {
  let timer: any;

  const runTask = () => {
    clearTimeout(timer);

    timer = setTimeout(async () => {
      await fetchConfig();
      runTask();
    }, cacheInfo.interval);
  };

  fetchConfig();
  runTask();
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
