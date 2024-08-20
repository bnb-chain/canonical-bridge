import axios from 'axios';

import { CLIENT_TIME_OUT } from '@/core/configs/app';
import { env } from '@/core/configs/env';

export const cBridgeApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.CBRIDGE_ENDPOINT,
});
