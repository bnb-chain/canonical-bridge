import axios from 'axios';

import { CLIENT_TIME_OUT } from '@/src/core';
import * as env from '../env';

export const cBridgeApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.CBRIDGE_ENDPOINT,
});
