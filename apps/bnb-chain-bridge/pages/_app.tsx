import '@node-real/walletkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NextApp, { AppProps } from 'next/app';
import { Provider as StoreProvider } from 'react-redux';
import { getMenus } from '@bnb-chain/space';
import { NextPageContext } from 'next';
import { pick } from 'accept-language-parser';

import { Layout } from '@/core/components/Layout';
import { WalletProvider } from '@/modules/wallet/WalletProvider';
import { wrapper } from '@/core/store/store';
import { IntlProvider } from '@/modules/i18n/IntlProvider';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, en } from '@/modules/i18n/locales';
import { updateI18n } from '@/modules/i18n/action';
import { SEO } from '@/core/components/SEO';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { env } from '@/core/configs/env';
import { setFooterMenus } from '@/modules/common/action';
import { BridgeConfigsProvider } from '@/modules/bridges/main';
import { getEvmConnectData } from '@/modules/bridges/main/api/getEvmConnectData';
import { setEvmConnectData } from '@/modules/bridges/main/action';

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
  const { locale, messages } = store.getState().i18n;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StoreProvider store={store}>
          <IntlProvider locale={locale} messages={messages}>
            <WalletProvider>
              <BridgeConfigsProvider>
                <SEO />
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </BridgeConfigsProvider>
            </WalletProvider>
          </IntlProvider>
        </StoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
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
      await getEvmConnectData(),
    ]);

    if (resArr[0].status === 'fulfilled') {
      const { footerMenus } = resArr[0].value;
      await store.dispatch(setFooterMenus(footerMenus));
    }

    if (resArr[1].status === 'fulfilled') {
      const evmConnectData = resArr[1].value ?? [];
      await store.dispatch(setEvmConnectData(evmConnectData));
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
