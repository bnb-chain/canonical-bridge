import { Stargate } from '@bnb-chain/canonical-bridge-sdk';

import { CLIENT_TIME_OUT } from '@/core/configs/app';
import { STARGATE_QUEUE_URL } from '@/core/constants';

export const stargateInstance = new Stargate({
  bridgeType: 'stargate',
  endpoint: STARGATE_QUEUE_URL,
  timeout: CLIENT_TIME_OUT,
});
