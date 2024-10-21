import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
  TransferWidget,
} from '@bnb-chain/canonical-bridge-widget';

import { en as messages } from '@/core/locales/en';
import { env } from '@/core/env';
import { dark } from '@/core/theme/dark';
import { Layout } from '@/core/components/Layout';
import { useTransferConfig } from '@/data';
import { ThemeProvider } from '@/core/components/ThemeProvider';
import { chains } from '@/data/chains';
import { light } from '@/core/theme/light';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

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

export default function App() {
  const transferConfig = useTransferConfig();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CanonicalBridgeProvider config={config} transferConfig={transferConfig} chains={chains}>
          <Layout>
            <TransferWidget />
          </Layout>
        </CanonicalBridgeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
