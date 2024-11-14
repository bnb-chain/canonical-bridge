import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
  TransferWidget,
} from '@bnb-chain/canonical-bridge-widget';

import { en as messages } from '@/core/locales/en';
import { useTransferConfig } from '@/token-config/mainnet/useTransferConfig';
import { chains } from '@/token-config/mainnet/chains';
import { Layout } from '@/core/components/Layout';
import { env } from '@/core/env';
import { dark } from '@/core/theme/dark';
import { light } from '@/core/theme/light';

export const bridgeConfig: ICanonicalBridgeConfig = {
  appName: env.APP_NAME,
  assetPrefix: env.ASSET_PREFIX,

  appearance: {
    bridgeTitle: 'BNB Chain Cross-Chain Bridge',
    locale: 'en',
    messages,
    mode: 'dark',
    theme: {
      dark: dark,
      light: light,
    },
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

export default function MainnetPage() {
  const transferConfig = useTransferConfig();

  return (
    <CanonicalBridgeProvider config={bridgeConfig} transferConfig={transferConfig} chains={chains}>
      <Layout>
        <TransferWidget />
      </Layout>
    </CanonicalBridgeProvider>
  );
}
