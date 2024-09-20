import '@node-real/walletkit/styles.css';
import React, { useContext, useMemo } from 'react';
import { IntlProvider } from '@bnb-chain/space';

import { Layout } from '@/core/components/Layout';
import { WalletProvider } from '@/modules/wallet/WalletProvider';
import { ThemeProvider, ThemeProviderProps } from '@/core/theme/ThemeProvider';
import { StoreProvider } from '@/modules/store/StoreProvider';
import { TransferPage } from '@/modules/transfer';
import { AggregatorProvider } from '@/modules/aggregator/components/AggregatorProvider';
import { ITransferConfig } from '@/modules/aggregator/types';

interface CanonicalBridgeContextProps {
  appearance: {
    mode: 'dark';
    theme?: ThemeProviderProps['themeConfig'];
  };
  i18n: {
    locale: 'en';
    messages: Record<string, string>;
  };
}

const CanonicalBridgeContext = React.createContext({} as CanonicalBridgeContextProps);

export function useBridgeConfig() {
  return useContext(CanonicalBridgeContext);
}

export interface CanonicalBridgeConfig extends CanonicalBridgeContextProps {}

export interface CanonicalBridgeProviderProvider {
  config: CanonicalBridgeConfig;
  routeContentBottom?: React.ReactNode;
  transferConfig: ITransferConfig;
}

export function CanonicalBridgeProvider(props: CanonicalBridgeProviderProvider) {
  const { config, routeContentBottom, transferConfig } = props;

  const value = useMemo(() => {
    return {
      ...config,
    };
  }, [config]);

  return (
    <CanonicalBridgeContext.Provider value={value}>
      <StoreProvider>
        <ThemeProvider themeConfig={value.appearance.theme}>
          <IntlProvider locale={value.i18n.locale} messages={value.i18n.messages}>
            <AggregatorProvider config={transferConfig}>
              <WalletProvider>
                <Layout>
                  <TransferPage routeContentBottom={routeContentBottom} />
                </Layout>
              </WalletProvider>
            </AggregatorProvider>
          </IntlProvider>
        </ThemeProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}
