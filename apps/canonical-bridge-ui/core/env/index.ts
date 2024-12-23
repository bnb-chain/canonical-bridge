export const env = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'canonical-bridge-ui',
  BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '',
  SERVER_ENDPOINT: process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? '',
  WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '',
};
