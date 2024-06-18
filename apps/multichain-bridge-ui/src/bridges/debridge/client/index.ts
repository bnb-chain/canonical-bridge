import { CLIENT_TIME_OUT } from '@/configs/app';
import { env } from '@/configs/env';
import axios from 'axios';

export const deBridgeApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.DEBRIDGE_ENDPOINT,
});

export const deBridgeStatsApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.DEBRIDGE_STATS_ENDPOINT,
});
