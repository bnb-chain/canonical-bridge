import '@node-real/walletkit/styles.css';
import React, { useMemo } from 'react';

import { Layout } from '@/core/components/Layout';
import { WalletProvider } from '@/modules/wallet/WalletProvider';
import { IntlProvider } from '@/modules/i18n/IntlProvider';
import { ThemeProvider, ThemeProviderProps } from '@/core/theme/ThemeProvider';
import { StoreProvider } from '@/modules/store/StoreProvider';
import { TransferPage } from '@/modules/transfer';
import { BridgeConfigsProvider, BridgeConfigsResponse, ChainConfig } from '@/modules/bridges';

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
  chainConfigs: ChainConfig[];
  bridgeConfigs: BridgeConfigsResponse;
}

export interface CanonicalBridgeProviderProvider {
  config: CanonicalBridgeConfig;
}

export function CanonicalBridgeProvider(props: CanonicalBridgeProviderProvider) {
  const { config } = props;

  const value = useMemo(() => {
    return {};
  }, []);

  const { appearance, i18n, chainConfigs, bridgeConfigs } = config;

  return (
    <CanonicalBridgeContext.Provider value={value}>
      <StoreProvider>
        <ThemeProvider themeConfig={appearance.theme}>
          <IntlProvider locale={i18n.locale} messages={i18n.messages}>
            <BridgeConfigsProvider chainConfigs={chainConfigs} bridgeConfigs={bridgeConfigs}>
              <WalletProvider>
                <Layout>
                  <TransferPage />
                </Layout>
              </WalletProvider>
            </BridgeConfigsProvider>
          </IntlProvider>
        </ThemeProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}
