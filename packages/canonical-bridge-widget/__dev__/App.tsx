import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CanonicalBridgeConfig, CanonicalBridgeProvider } from '@/index';
import { bridgeConfigs } from '@/dev/data';
import { chains } from '@/dev/data/chains';
import { en as messages } from '@/dev/locales/en';
import { dark } from '@/dev/theme/dark';

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
  chainConfigs: chains,
  bridgeConfigs,
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CanonicalBridgeProvider config={config} />
    </QueryClientProvider>
  );
}
