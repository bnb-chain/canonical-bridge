import { CLIENT_TIME_OUT } from '@/config/app';
import { env } from '@/config/env';
import axios from 'axios';

export const deBridgeApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.DEBRIDGE_ENDPOINT,
});

export const deBridgeStatsApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.DEBRIDGE_STATS_ENDPOINT,
});
