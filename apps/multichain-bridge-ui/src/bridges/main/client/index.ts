import { CLIENT_TIME_OUT } from '@/configs/app';
import axios from 'axios';

export const feApiClient = axios.create({
  timeout: CLIENT_TIME_OUT,
});
