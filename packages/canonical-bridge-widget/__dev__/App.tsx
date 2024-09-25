import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CanonicalBridgeConfig, CanonicalBridgeProvider, TransferWidget } from '@/index';
import { transferConfig } from '@/dev/data';
import { en as messages } from '@/dev/core/locales/en';
import { dark } from '@/dev/core/theme/dark';
import { ASSET_PREFIX, TRANSFER_CONFIG_ENDPOINT } from '@/dev/core/constants';
import { ExternalBridgesPanel } from '@/dev/core/components/ExternalBridgesPanel';
import { Layout } from '@/dev/core/components/Layout';

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
  appName: 'bnb-chain-bridge',
  bridgeTitle: 'BNB Chain Cross-Chain Bridge',
};

export default function App() {
  return (
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
  );
}
