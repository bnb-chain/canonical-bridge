import '@node-real/walletkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import { PropsWithChildren, useEffect } from 'react';

import { Layout } from '@/core/components/Layout';
import { WalletProvider } from '@/modules/wallet/WalletProvider';
import { IntlProvider } from '@/modules/i18n/IntlProvider';
import { en } from '@/modules/i18n/locales';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { BridgeConfigsProvider } from '@/modules/bridges';
import { StoreProvider, useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { getChainConfigs } from '@/modules/bridges/main/api/getChainConfigs';
import { setChainConfigs } from '@/modules/bridges/action';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ThemeProvider>
          <IntlProvider locale={'en'} messages={{ ...en }}>
            <DataProvider>
              <BridgeConfigsProvider>
                <WalletProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </WalletProvider>
              </BridgeConfigsProvider>
            </DataProvider>
          </IntlProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

// TODO: test
function DataProvider(props: PropsWithChildren) {
  const { children } = props;

  const chainConfigs = useAppSelector((state) => state.bridges.chainConfigs);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getChainData = async () => {
      const res = await getChainConfigs();
      dispatch(setChainConfigs(res));
    };
    getChainData();
  }, [dispatch]);

  if (!chainConfigs.length) {
    return null;
  }

  return <>{children}</>;
}
