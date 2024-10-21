import {
  ICanonicalBridgeConfig,
  CanonicalBridgeProvider,
  TransferWidget,
} from '@bnb-chain/canonical-bridge-widget';

import { Layout } from '@/core/components/Layout';
import { dark } from '@/core/theme/dark';
import { light } from '@/core/theme/light';
import { useTransferConfig } from '@/data';
import { chains } from '@/data/chains';
import { env } from '@/core/env';
import { en as messages } from '@/core/locales/en';

const config: ICanonicalBridgeConfig = {
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

export default function Index() {
  const transferConfig = useTransferConfig();

  return (
    <CanonicalBridgeProvider config={config} transferConfig={transferConfig} chains={chains}>
      <Layout>
        <TransferWidget />
      </Layout>
    </CanonicalBridgeProvider>
  );
}
