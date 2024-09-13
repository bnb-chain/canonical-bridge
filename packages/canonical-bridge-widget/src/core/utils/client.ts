import axios from 'axios';

import { CLIENT_TIME_OUT } from '@/core/configs/app';

// only use in server
export const ssrApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
  baseURL: 'http://localhost:3000',
});
