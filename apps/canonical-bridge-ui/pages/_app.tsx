import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CanonicalBridgeProvider,
  CanonicalBridgeConfig,
  TransferWidget,
} from '@bnb-chain/canonical-bridge-widget';

import { en as messages } from '@/core/locales/en';
import { APP_NAME, ASSET_PREFIX, TRANSFER_CONFIG_ENDPOINT } from '@/core/constants';
import { dark } from '@/core/theme/dark';
import { ExternalBridgesPanel } from '@/core/components/ExternalBridgesPanel';
import { Layout } from '@/core/components/Layout';
import { transferConfig } from '@/data';
import { ThemeProvider } from '@/core/components/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

const config: CanonicalBridgeConfig = {
  appearance: {
    locale: 'en',
    messages,
    mode: 'dark',
    theme: {
      dark: dark,
      light: {},
    },
  },
  walletConfig: {
    walletConnectProjectId: 'e68a1816d39726c2afabf05661a32767',
  },
  refetchingInterval: 30000, // 30s
  apiTimeOut: 60 * 1000, // 30s
  deBridgeAccessToken: '',
  assetsPrefix: ASSET_PREFIX,
  transferConfigEndpoint: TRANSFER_CONFIG_ENDPOINT,
  appName: APP_NAME,
  bridgeTitle: 'BNB Chain Cross-Chain Bridge',
};

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CanonicalBridgeProvider
          config={config}
          transferConfig={transferConfig}
          routeContentBottom={<ExternalBridgesPanel />}
        >
          <Layout>
            <TransferWidget />
          </Layout>
        </CanonicalBridgeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
