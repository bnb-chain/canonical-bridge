import '@node-real/walletkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';
import { AppProps } from 'next/app';

import { ThemeProvider } from '@/core/components/ThemeProvider';
import { SvgDefs } from '@/core/components/icons/SvgDefs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export default function App({ Component, ...restProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <SvgDefs />
          <Component {...restProps.pageProps} />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
