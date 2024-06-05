import { CLIENT_TIME_OUT } from '@/configs/app';
import { env } from '@/configs/env';
import axios from 'axios';

export const cBridgeApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.CBRIDGE_ENDPOINT,
});
