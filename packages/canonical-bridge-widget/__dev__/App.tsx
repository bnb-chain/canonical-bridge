import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ICanonicalBridgeConfig, CanonicalBridgeProvider, TransferWidget } from '@/index';
import { transferConfig } from '@/dev/data';
import { en as messages } from '@/dev/core/locales/en';
import { dark } from '@/dev/core/theme/dark';
import { ASSET_PREFIX, TRANSFER_CONFIG_ENDPOINT } from '@/dev/core/constants';
import { ExternalBridgesPanel } from '@/dev/core/components/ExternalBridgesPanel';
import { Layout } from '@/dev/core/components/Layout';
import { chains } from '@/dev/data/chains';

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
  appName: 'bnb-chain-bridge',

  appearance: {
    bridgeTitle: 'BNB Chain Cross-Chain Bridge',
    mode: 'dark',
    theme: {
      dark: dark,
      light: {},
    },
    locale: 'en',
    messages,
  },
  wallet: {
    walletConnectProjectId: 'e68a1816d39726c2afabf05661a32767',
  },
  http: {
    refetchingInterval: 30000, // 30s
    apiTimeOut: 60 * 1000, // 30s
    deBridgeAccessToken: '',

    assetPrefix: ASSET_PREFIX,
    serverEndpoint: TRANSFER_CONFIG_ENDPOINT,
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CanonicalBridgeProvider
        config={config}
        transferConfig={transferConfig}
        chains={chains}
        routeContentBottom={<ExternalBridgesPanel />}
      >
        <Layout>
          <TransferWidget />
        </Layout>
      </CanonicalBridgeProvider>
    </QueryClientProvider>
  );
}
