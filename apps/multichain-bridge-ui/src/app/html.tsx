'use client';

import { Layout } from '@/components/layout/Layout';
import { theme } from '@/theme';
import { ColorModeScript, ThemeProvider } from '@node-real/uikit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@bridge/wallet';
import { StoreProvider } from '@/store/StoreProvider';
import { TransferConfigsProvider } from '@/bridges/index';

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
          <StoreProvider>
            <ThemeProvider theme={theme}>
              <WalletProvider>
                <TransferConfigsProvider>
                  <Layout>{children}</Layout>
                </TransferConfigsProvider>
              </WalletProvider>
            </ThemeProvider>
          </StoreProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}