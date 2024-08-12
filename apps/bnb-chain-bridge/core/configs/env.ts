import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

const BASE_PATH = publicRuntimeConfig.NEXT_PUBLIC_BASE_PATH ?? '/bnb-chain-bridge';
const FE_ENDPOINT = publicRuntimeConfig.NEXT_PUBLIC_FE_ENDPOINT ?? `/en${BASE_PATH}`;

export const env = {
  // public env
  FE_ENDPOINT,
  BASE_PATH,
  NETWORK: publicRuntimeConfig.NEXT_PUBLIC_NETWORK ?? 'mainnet',
  CBRIDGE_ENDPOINT: publicRuntimeConfig.NEXT_PUBLIC_CBRIDGE_ENDPOINT ?? '',
  DEBRIDGE_ENDPOINT: publicRuntimeConfig.NEXT_PUBLIC_DEBRIDGE_ENDPOINT ?? '',
  DEBRIDGE_STATS_ENDPOINT: publicRuntimeConfig.NEXT_PUBLIC_DEBRIDGE_STATS_ENDPOINT ?? '',
  ASSET_PREFIX: publicRuntimeConfig.NEXT_PUBLIC_STATIC_HOST ?? '',

  // server env
  DIRECTUS_API_URL: serverRuntimeConfig.DIRECTUS_API_URL ?? '',
  DIRECTUS_CDN_URL: serverRuntimeConfig.DIRECTUS_CDN_URL ?? '',
};
