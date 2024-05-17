import { WebClient } from '@/bridges/cbridge/ts-proto/gateway/GatewayServiceClientPb';
import { CLIENT_TIME_OUT } from '@/config/app';
import { env } from '@/config/env';
import axios from 'axios';

export const cBridgePbClient = new WebClient(env.CBRIDGE_ENDPOINT, null, null);

export const cBridgeApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.CBRIDGE_ENDPOINT,
});
