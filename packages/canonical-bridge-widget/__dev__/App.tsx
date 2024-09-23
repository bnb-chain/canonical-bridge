import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CanonicalBridgeConfig, CanonicalBridgeProvider } from '@/index';
import { transferConfig } from '@/dev/data';
import { en as messages } from '@/dev/locales/en';
import { dark } from '@/dev/theme/dark';
import { ExternalBridgesPanel } from '@/dev/components/ExternalBridgesPanel';

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
    mode: 'dark',
    theme: {
      dark: dark,
      light: {},
    },
  },
  i18n: {
    locale: 'en',
    messages,
  },
  refetchingInterval: 30000, // 30s
  apiTimeOut: 60 * 1000, // 30s
  deBridgeAccessToken: '',
  appName: 'bnb-chain-bridge',
  enableGTM: true,
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CanonicalBridgeProvider
        config={config}
        transferConfig={transferConfig}
        routeContentBottom={<ExternalBridgesPanel />}
      />
    </QueryClientProvider>
  );
}
