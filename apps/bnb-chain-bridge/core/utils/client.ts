import axios from 'axios';

import { env } from '@/core/configs/env';
import { CLIENT_TIME_OUT } from '@/core/constants';

export const feApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.FE_ENDPOINT,
});

// only use in server
export const ssrApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: 'http://localhost:3000',
});

// only use in server
export const cmsClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: env.DIRECTUS_API_URL,
});