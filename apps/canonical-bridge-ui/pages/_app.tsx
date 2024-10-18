import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';
import { AppProps } from 'next/app';

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

export default function App({ Component, ...restProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...restProps.pageProps} />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

App.getInitialProps = async () => {
  return {};
};
