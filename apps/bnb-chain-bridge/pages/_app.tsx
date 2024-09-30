import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NextApp, { AppProps } from 'next/app';
import { getMenus } from '@bnb-chain/space';
import { NextPageContext } from 'next';
import { pick } from 'accept-language-parser';
import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
} from '@bnb-chain/canonical-bridge-widget';
import { useMemo } from 'react';
import { Provider as StoreProvider } from 'react-redux';

import { Layout } from '@/core/components/Layout';
import { wrapper } from '@/core/store/store';
import { DEFAULT_LOCALE, en, SUPPORTED_LOCALES } from '@/modules/i18n/locales';
import { updateI18n } from '@/modules/i18n/action';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { env } from '@/core/configs/env';
import { setFooterMenus } from '@/modules/common/action';
import { setupCmsData } from '@/modules/common/cms';
import { ExternalBridgesPanel } from '@/core/components/ExternalBridgesPanel';
import { dark } from '@/core/theme/dark';
import { useFetchTransferConfig } from '@/modules/transfer/api/useFetchTransferConfig';
import { IntlProvider } from '@/modules/i18n/IntlProvider';
import { useAppSelector } from '@/core/store/hooks';
import { chains } from '@/core/configs/chains';
import { APP_NAME } from '@/core/constants';

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
  const { store } = wrapper.useWrappedStore(props);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StoreProvider store={store}>
          <IntlProvider>
            <BridgeWidget>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </BridgeWidget>
          </IntlProvider>
        </StoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function BridgeWidget({ children }: React.PropsWithChildren) {
  const locale = useAppSelector((state) => state.i18n.locale);
  const messages = useAppSelector((state) => state.i18n.messages);

  const config = useMemo<ICanonicalBridgeConfig>(
    () => ({
      appName: APP_NAME,

      appearance: {
        bridgeTitle: 'BNB Chain Cross-Chain Bridge',
        mode: 'dark',
        theme: {
          dark: dark,
          light: {},
        },
        locale,
        messages,
      },
      wallet: {
        walletConnectProjectId: env.WALLET_CONNECT_PROJECT_ID,
      },
      http: {
        refetchingInterval: 30000, // 30s
        apiTimeOut: 60 * 1000, // 30s
        deBridgeAccessToken: env.DEBRIDGE_ACCESS_TOKEN,

        assetPrefix: env.ASSET_PREFIX,
        serverEndpoint: env.WIDGET_SERVER_ENDPOINT,
      },
    }),
    [locale, messages],
  );

  const { data: transferConfig } = useFetchTransferConfig();

  return (
    <CanonicalBridgeProvider
      config={config}
      transferConfig={transferConfig}
      chains={chains}
      routeContentBottom={<ExternalBridgesPanel />}
    >
      {children}
    </CanonicalBridgeProvider>
  );
}

App.getInitialProps = wrapper.getInitialAppProps((store) => async (appContext) => {
  try {
    const locale = getLocale(appContext.ctx);
    const messages = { ...en };

    await store.dispatch(
      updateI18n({
        locale,
        messages,
      }),
    );

    const resArr = await Promise.allSettled([
      await getMenus(env.DIRECTUS_API_URL, locale, env.DIRECTUS_CDN_URL),
      await store.dispatch(setupCmsData()),
    ]);

    if (resArr[0].status === 'fulfilled') {
      const { footerMenus } = resArr[0].value;
      await store.dispatch(setFooterMenus(footerMenus));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  const appProps = await NextApp.getInitialProps(appContext);
  return { ...appProps };
});

function getLocale(ctx: NextPageContext) {
  const queryLocale = pick(SUPPORTED_LOCALES, ctx.asPath ?? '');
  const headerLocale = pick(SUPPORTED_LOCALES, ctx.req?.headers['accept-language'] ?? '');

  const locale = queryLocale || headerLocale || DEFAULT_LOCALE;
  const targetUrl = `/${locale}${env.BASE_PATH}`;

  if (!ctx.asPath?.startsWith(targetUrl)) {
    ctx.res?.writeHead(302, { Location: targetUrl }).end();
  }

  return locale;
}
