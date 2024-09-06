export const ENDPOINT_PREFIX = 'api';
export const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;
export const SERVER_TIMEOUT = parseInt(process.env.SERVER_TIMEOUT, 10) || 5000;
export const REDIS_URL = process.env.REDIS_URL;

export const CMC_API_KEY = process.env.CMC_API_KEY;
export const CMC_API_ENDPOINT = process.env.CMC_API_ENDPOINT || 'https://pro-api.coinmarketcap.com';

const redisURL = new URL(REDIS_URL);

export const REDIS_HOST = redisURL.hostname;
export const REDIS_PORT = Number(redisURL.port);

export enum Queues {
  SyncToken = 'SyncToken',
}

export enum Tasks {
  fetchToken = 'fetchToken',
  fetchPrice = 'fetchPrice',
}

export const TOKEN_REQUEST_LIMIT = 1000;
export const PRICE_REQUEST_LIMIT = 200;

export const CACHE_KEY = {
  TOKEN_CORN_INIT: 'token:corn:init',
};

export const JOB_KEY = {
  CORN_TOKEN_PREFIX: 'corn:token:',
  CORN_PRICE_PREFIX: 'corn:price:',
};
