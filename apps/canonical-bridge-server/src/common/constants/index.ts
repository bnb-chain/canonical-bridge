export const ENDPOINT_PREFIX = 'api';
export const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;
export const SERVER_TIMEOUT = parseInt(process.env.SERVER_TIMEOUT, 10) || 5000;
export const REDIS_URL = process.env.REDIS_URL;

export const CMC_API_KEY = process.env.CMC_API_KEY;
export const CMC_API_ENDPOINT = process.env.CMC_API_ENDPOINT || 'https://pro-api.coinmarketcap.com';
export const CBRIDGE_ENDPOINT = process.env.CBRIDGE_ENDPOINT || 'https://cbridge-prod2.celer.app';
export const DEBRIDGE_ENDPOINT =
  process.env.DEBRIDGE_ENDPOINT || 'https://deswap.debridge.finance/v1.0';
export const LLAMA_COINS_ENDPOINT = process.env.LLMA_COINS__ENDPOINT || 'https://coins.llama.fi';
export const COINGECKO_ENDPOINT = process.env.COINGECKO_ENDPOINT || 'https://api.coingecko.com/api';

const redisURL = new URL(REDIS_URL);

export const REDIS_HOST = redisURL.hostname;
export const REDIS_PORT = Number(redisURL.port);

export enum Queues {
  SyncToken = 'SyncToken',
  SyncBridge = 'SyncBridge',
}

export enum Tasks {
  fetchToken = 'fetchToken',
  fetchCoingeckoToken = 'fetchCoingeckoToken',
  fetchPrice = 'fetchPrice',
  fetchLlamaPrice = 'fetchLlamaPrice',
  fetchCbridge = 'fetchCbridge',
  fetchDebridge = 'fetchDebridge',
  cacheCmcConfig = 'cacheCmcConfig',
  cacheLlamaConfig = 'cacheLlamaConfig',
}

export const TOKEN_REQUEST_LIMIT = 1000;
export const PRICE_REQUEST_LIMIT = 200;

export const CACHE_KEY = {
  TOKEN_STARTED: 'token:started',
  BRIDGE_STARTED: 'bridge:started',
  CMC_TOKENS: 'cmc:tokens',
  CMC_CRYPTO_CURRENCY: 'cmc:currency',
  CMC_CRYPTO_TOKEN: 'cmc:token',
  CBRIDGE_CONFIG: 'bridge:cbridge',
  DEBRIDGE_CONFIG: 'bridge:debridge',
  CMC_CONFIG: 'cmc:config',
  LLAMA_CONFIG: 'llama:config',
  PLATFORM_MAPPING: 'llama:platform',
};

export const JOB_KEY = {
  CORN_TOKEN_PREFIX: 'corn:token:',
  CORN_PRICE_PREFIX: 'corn:price:',
};
