import { CBridge } from '@bnb-chain/canonical-bridge-sdk';

import { CLIENT_TIME_OUT } from '@/core/configs/app';
import { env } from '@/core/configs/env';

export const deBridgeInstance = new CBridge({
  bridgeType: 'cBridge',
  endpoint: env.CBRIDGE_ENDPOINT,
  timeout: CLIENT_TIME_OUT,
});
