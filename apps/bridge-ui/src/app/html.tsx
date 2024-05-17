'use client';

import { Layout } from '@/components/layout/Layout';
import { BridgeConfigProvider } from '@/providers/BridgeConfigProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { theme } from '@/theme';
import { ColorModeScript, ThemeProvider } from '@node-real/uikit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export default function Html({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <ColorModeScript {...theme.config} />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <BridgeConfigProvider>
              <StoreProvider>
                <Layout>{children}</Layout>
              </StoreProvider>
            </BridgeConfigProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
