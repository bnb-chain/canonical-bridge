import { CanonicalBridgeSDK } from '@bnb-chain/canonical-bridge-sdk';
import { useMemo } from 'react';

import {
  CBRIDGE_ENDPOINT,
  DEBRIDGE_ENDPOINT,
  DEBRIDGE_STATS_ENDPOINT,
  STARGATE_QUEUE_URL,
} from '@/core/constants';
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
          endpoint: CBRIDGE_ENDPOINT,
          timeout,
        },
        {
          bridgeType: 'deBridge',
          endpoint: DEBRIDGE_ENDPOINT,
          statsEndpoint: DEBRIDGE_STATS_ENDPOINT,
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
        {
          bridgeType: 'meson',
          endpoint: bridgeConfig.http.mesonEndpoint!,
          timeout,
        },
      ],
    });
  }, [bridgeConfig.http.apiTimeOut, bridgeConfig.http.mesonEndpoint]);

  return bridgeSDK;
};
