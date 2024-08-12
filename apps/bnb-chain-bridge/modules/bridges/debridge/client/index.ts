import axios from 'axios';

import { CLIENT_TIME_OUT } from '@/core/configs/app';
import { env } from '@/core/configs/env';

export const deBridgeApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.DEBRIDGE_ENDPOINT,
});

export const deBridgeStatsApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.DEBRIDGE_STATS_ENDPOINT,
});
