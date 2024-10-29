import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
  TransferWidget,
} from '@bnb-chain/canonical-bridge-widget';

import { en as messages } from '@/core/locales/en';
import { useTestnetTransferConfig } from '@/token-config/testnet';
import { testnetChains } from '@/token-config/testnet/testnetChains';
import { Layout } from '@/core/components/Layout';
import { dark } from '@/core/theme/dark';
import { light } from '@/core/theme/light';
import { env } from '@/core/env';

export const bridgeConfig: ICanonicalBridgeConfig = {
  appName: env.APP_NAME,
  assetPrefix: env.ASSET_PREFIX,

  appearance: {
    bridgeTitle: 'BNB Chain Cross-Chain Bridge Testnet',
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
    mesonEndpoint: 'https://testnet-relayer.meson.fi/api/v1',
  },
};

export default function TestnetPage() {
  const testnetTransferConfig = useTestnetTransferConfig();

  return (
    <CanonicalBridgeProvider
      config={bridgeConfig}
      transferConfig={testnetTransferConfig}
      chains={testnetChains}
    >
      <Layout>
        <TransferWidget />
      </Layout>
    </CanonicalBridgeProvider>
  );
}
