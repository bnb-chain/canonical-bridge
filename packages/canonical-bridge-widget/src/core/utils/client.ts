import axios from 'axios';

import { env } from '@/core/configs/env';
import { CLIENT_TIME_OUT } from '@/core/configs/app';

export const feApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.FE_ENDPOINT,
});

// only use in server
export const ssrApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: 'http://localhost:3000',
});
