import { ICanonicalBridgeConfig } from '@bnb-chain/canonical-bridge-widget';

import { en as messages } from '@/core/locales/en';
import { env } from '@/core/env';
import { dark } from '@/core/theme/dark';
import { light } from '@/core/theme/light';

export const bridgeConfig: ICanonicalBridgeConfig = {
  appName: env.APP_NAME,
  assetPrefix: env.ASSET_PREFIX,

  appearance: {
    bridgeTitle: 'BNB Chain Cross-Chain Bridge',
    mode: 'dark',
    theme: {
      dark: dark,
      light: light,
    },
    locale: 'en',
    messages,
  },
  wallet: {
    walletConnectProjectId: env.WALLET_CONNECT_PROJECT_ID,
  },
  http: {
    refetchingInterval: 30 * 1000, // 30s
    apiTimeOut: 60 * 1000, // 60s
    deBridgeAccessToken: '',
    serverEndpoint: env.SERVER_ENDPOINT,
  },
};
