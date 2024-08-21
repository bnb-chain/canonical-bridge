import { DeBridge } from '@bnb-chain/canonical-bridge-sdk';

import { CLIENT_TIME_OUT } from '@/core/configs/app';
import { env } from '@/core/configs/env';

export const deBridgeInstance = new DeBridge({
  endpoint: env.DEBRIDGE_ENDPOINT,
  statsEndpoint: env.DEBRIDGE_STATS_ENDPOINT,
  timeout: CLIENT_TIME_OUT,
});
