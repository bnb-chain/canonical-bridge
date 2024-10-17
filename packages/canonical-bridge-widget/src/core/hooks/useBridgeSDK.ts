import { CanonicalBridgeSDK } from '@bnb-chain/canonical-bridge-sdk';
import { useMemo } from 'react';

import { env } from '@/core/configs/env';
import { STARGATE_QUEUE_URL } from '@/core/constants';
import { useBridgeConfig } from '@/index';

/**
 * Initialize SDK Instance
 * @returns SDK Instance
 */
export const useBridgeSDK = () => {
  const bridgeConfig = useBridgeConfig();

  const bridgeSDK = useMemo(() => {
    const timeout = bridgeConfig.http.apiTimeOut;

    return new CanonicalBridgeSDK({
      bridgeConfigs: [
        {
          bridgeType: 'cBridge',
          endpoint: env.CBRIDGE_ENDPOINT,
          timeout,
        },
        {
          bridgeType: 'deBridge',
          endpoint: env.DEBRIDGE_ENDPOINT,
          statsEndpoint: env.DEBRIDGE_STATS_ENDPOINT,
          timeout,
        },
        {
          bridgeType: 'stargate',
          endpoint: STARGATE_QUEUE_URL,
          timeout,
        },
        {
          bridgeType: 'layerZero',
          endpoint: '',
        },
        { bridgeType: 'meson', endpoint: bridgeConfig.http.mesonEndpoint! },
      ],
    });
  }, [bridgeConfig.http.apiTimeOut, bridgeConfig.http.mesonEndpoint]);

  return bridgeSDK;
};
