export const ENDPOINT_PREFIX = 'api';
export const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;
export const SERVER_TIMEOUT = parseInt(process.env.SERVER_TIMEOUT, 10) || 5000;
export const REDIS_URL = process.env.REDIS_URL;

export const CMC_API_KEY = process.env.CMC_API_KEY;
export const CMC_API_ENDPOINT = process.env.CMC_API_ENDPOINT || 'https://pro-api.coinmarketcap.com';
export const CBRIDGE_ENDPOINT = process.env.CBRIDGE_ENDPOINT || 'https://cbridge-prod2.celer.app';
export const DEBRIDGE_ENDPOINT =
  process.env.DEBRIDGE_ENDPOINT || 'https://deswap.debridge.finance/v1.0';
export const STARGATE_ENDPOINT =
  process.env.STARGATE_ENDPOINT || 'https://mainnet.stargate-api.com/v1/metadata?version=v2';
export const MESON_ENDPOINT = process.env.MESON_ENDPOINT || 'https://relayer.meson.fi/api/v1';
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
  fetchStargate = 'fetchStargate',
  fetchMeson = 'fetchMeson',
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
  STARGATE_CONFIG: 'bridge:stargate',
  MESON_CONFIG: 'bridge:meson',
  CMC_CONFIG: 'cmc:config',
  LLAMA_CONFIG: 'llama:config',
  PLATFORM_MAPPING: 'llama:platform',
};

export const JOB_KEY = {
  CORN_TOKEN_PREFIX: 'corn:token:',
  CORN_PRICE_PREFIX: 'corn:price:',
};

export const STARGATE_CHAIN_INFO = [
  {
    chainId: 1,
    chainName: 'Ethereum',
    endpointID: 30101,
  },
  {
    chainId: 10,
    chainName: 'Optimism',
    endpointID: 30110,
  },
  {
    chainId: 14,
    chainName: 'Flare',
    endpointID: 30295,
  },
  {
    chainId: 56,
    chainName: 'BSC',
    endpointID: 30102,
  },
  {
    chainId: 97,
    chainName: 'BSC Testnet',
    network: 'testnet',
    endpointID: 40102,
  },
  {
    chainId: 137,
    chainName: 'Polygon',
    endpointID: 30109,
  },
  {
    chainId: 1088,
    chainName: 'Metis',
    endpointID: 30151,
  },
  {
    chainId: 1116,
    chainName: 'coredao',
    endpointID: 30153,
  },
  {
    chainId: 1329,
    chainName: 'Sei',
    endpointID: 30280,
  },
  {
    chainId: 1625,
    chainName: 'Gravity',
    endpointID: 30294,
  },
  {
    chainId: 2222,
    chainName: 'Kava',
    endpointID: 30177,
  },
  {
    chainId: 5000,
    chainName: 'Mantle',
    endpointID: 30181,
  },
  {
    chainId: 8217,
    chainName: 'Klaytn',
    endpointID: 30150,
  },
  {
    chainId: 8453,
    chainName: 'Base',
    endpointID: 30184,
  },
  {
    chainId: 8822,
    chainName: 'IOTA',
    endpointID: 30284,
  },
  {
    chainId: 42161,
    chainName: 'Arbitrum',
    endpointID: 30110,
  },
  {
    chainId: 43114,
    chainName: 'Avalanche',
    endpointID: 30106,
  },
  {
    chainId: 59144,
    chainName: 'Linea',
    endpointID: 30183,
  },
  {
    chainId: 167000,
    chainName: 'Taiko',
    endpointID: 30290,
  },
  {
    chainId: 421614,
    chainName: 'Arbitrum Sepolia',
    network: 'testnet',
    endpointID: 40231,
  },
  {
    chainId: 11155420,
    chainName: 'OP Sepolia Testnet',
    network: 'testnet',
    endpointID: 40232,
  },
  {
    chainId: 534352,
    chainName: 'Scroll',
    endpointID: 30214,
  },
  {
    chainId: 11155111,
    chainName: 'Sepolia',
    network: 'testnet',
    endpointID: 40161,
  },
  {
    chainId: 1313161554,
    chainName: 'Aurora',
    endpointID: 30211,
  },
  {
    chainId: 1380012617,
    chainName: 'rarible',
    endpointID: 30235,
  },
];
