import '@node-real/walletkit/styles.css';
import React, { useMemo } from 'react';
import { IntlProvider } from '@bnb-chain/space';

import { Layout } from '@/core/components/Layout';
import { WalletProvider } from '@/modules/wallet/WalletProvider';
import { ThemeProvider, ThemeProviderProps } from '@/core/theme/ThemeProvider';
import { StoreProvider } from '@/modules/store/StoreProvider';
import { TransferPage } from '@/modules/transfer';
import { IBridgeConfig } from '@/modules/aggregator/types';
import { BridgeConfigProvider } from '@/modules/aggregator/components/BridgeConfigProvider';

interface CanonicalBridgeContextProps {}

const CanonicalBridgeContext = React.createContext({} as CanonicalBridgeContextProps);

export interface CanonicalBridgeConfig {
  appearance: {
    mode: 'dark';
    theme?: ThemeProviderProps['themeConfig'];
  };
  i18n: {
    locale: 'en';
    messages: Record<string, string>;
  };
  bridgeConfig: IBridgeConfig;
}

export interface CanonicalBridgeProviderProvider {
  config: CanonicalBridgeConfig;
}

export function CanonicalBridgeProvider(props: CanonicalBridgeProviderProvider) {
  const { config } = props;

  const value = useMemo(() => {
    return {};
  }, []);

  const { appearance, i18n, bridgeConfig } = config;

  return (
    <CanonicalBridgeContext.Provider value={value}>
      <StoreProvider>
        <ThemeProvider themeConfig={appearance.theme}>
          <IntlProvider locale={i18n.locale} messages={i18n.messages}>
            <BridgeConfigProvider config={bridgeConfig}>
              <WalletProvider>
                <Layout>
                  <TransferPage />
                </Layout>
              </WalletProvider>
            </BridgeConfigProvider>
          </IntlProvider>
        </ThemeProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}
