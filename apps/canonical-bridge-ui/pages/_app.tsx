import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
  TransferWidget,
} from '@bnb-chain/canonical-bridge-widget';

import { en as messages } from '@/core/locales/en';
import { ASSET_PREFIX, TRANSFER_CONFIG_ENDPOINT } from '@/core/constants';
import { dark } from '@/core/theme/dark';
import { ExternalBridgesPanel } from '@/core/components/ExternalBridgesPanel';
import { Layout } from '@/core/components/Layout';
import { transferConfig } from '@/data';
import { ThemeProvider } from '@/core/components/ThemeProvider';
import { chains } from '@/data/chains';

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
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
