'use client';

import { Layout } from '@/components/layout/Layout';
import { theme } from '@/theme';
import { ColorModeScript, ThemeProvider } from '@node-real/uikit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Metadata } from 'next';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export const metadata: Metadata = {
  title: 'MultiChain Bridge',
};

export default function Html({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ColorModeScript {...theme.config} />
          <ThemeProvider theme={theme}>
            <Layout>{children}</Layout>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
