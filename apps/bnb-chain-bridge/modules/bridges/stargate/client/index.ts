import axios from 'axios';

import { CLIENT_TIME_OUT } from '@/core/configs/app';
import { STARGATE_QUEUE_URL } from '@/core/constants';

export const stargateApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: STARGATE_QUEUE_URL,
});
