import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const env = {
  APP_NAME: publicRuntimeConfig.NEXT_PUBLIC_APP_NAME,
  ASSET_PREFIX: publicRuntimeConfig.NEXT_PUBLIC_ASSET_PREFIX,
  SERVER_ENDPOINT: publicRuntimeConfig.NEXT_PUBLIC_SERVER_ENDPOINT,
  WALLET_CONNECT_PROJECT_ID: publicRuntimeConfig.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
};
