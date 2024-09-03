import { CanonicalBridgeSDK } from '@bnb-chain/canonical-bridge-sdk';

import { CLIENT_TIME_OUT } from '@/core/configs/app';
import { env } from '@/core/configs/env';
import { STARGATE_QUEUE_URL } from '@/core/constants';

/**
 * Initialize SDK Instance
 * @returns SDK Instance
 */
export const bridgeSDK = new CanonicalBridgeSDK({
  bridgeConfigs: [
    {
      bridgeType: 'cBridge',
      endpoint: env.CBRIDGE_ENDPOINT,
      timeout: CLIENT_TIME_OUT,
    },
    {
      bridgeType: 'deBridge',
      endpoint: env.DEBRIDGE_ENDPOINT,
      statsEndpoint: env.DEBRIDGE_STATS_ENDPOINT,
      timeout: CLIENT_TIME_OUT,
    },
    {
      bridgeType: 'stargate',
      endpoint: STARGATE_QUEUE_URL,
      timeout: CLIENT_TIME_OUT,
    },
    {
      bridgeType: 'layerZero',
      endpoint: '',
    },
  ],
});
