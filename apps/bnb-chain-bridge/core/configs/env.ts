import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

const BASE_PATH = publicRuntimeConfig.NEXT_PUBLIC_BASE_PATH ?? '/bnb-chain-bridge';
const FE_ENDPOINT = publicRuntimeConfig.NEXT_PUBLIC_FE_ENDPOINT ?? `/en${BASE_PATH}`;

export const env = {
  // public env
  FE_ENDPOINT,
  BASE_PATH,
  ASSET_PREFIX: publicRuntimeConfig.NEXT_PUBLIC_STATIC_HOST ?? '',
  TRANSFER_CONFIG_ENDPOINT: 'https://canonical-bridge-api.fe.kfkshore.org',
  DEBRIDGE_ACCESS_TOKEN: 'bnb-48deda482665',
  WALLET_CONNECT_PROJECT_ID: 'e68a1816d39726c2afabf05661a32767',

  // server env
  DIRECTUS_API_URL: serverRuntimeConfig.DIRECTUS_API_URL ?? '',
  DIRECTUS_CDN_URL: serverRuntimeConfig.DIRECTUS_CDN_URL ?? '',
};
