import '@node-real/walletkit/styles.css';
import React, { useContext, useMemo } from 'react';
import { IntlProvider } from '@bnb-chain/space';

import { AggregatorProvider } from '@/modules/aggregator/components/AggregatorProvider';
import { ITransferConfig } from '@/modules/aggregator/types';
import { StoreProvider } from '@/modules/store/StoreProvider';
import { WalletProvider } from '@/modules/wallet/WalletProvider';
import { ThemeProvider, ThemeProviderProps } from '@/core/theme/ThemeProvider';

export interface CanonicalBridgeConfig {
  appearance: {
    mode: 'dark';
    theme?: ThemeProviderProps['themeConfig'];
    locale: 'en';
    messages: Record<string, string>;
  };
  walletConfig: {
    walletConnectProjectId: string;
  };
  appName?: string;
  enableGTM?: boolean;
  refetchingInterval?: number;
  apiTimeOut?: number;
  deBridgeAccessToken?: string;
  assetsPrefix?: string;
  transferConfigEndpoint: string;
}

interface CanonicalBridgeContextProps extends CanonicalBridgeConfig {
  routeContentBottom: React.ReactNode;
}

const CanonicalBridgeContext = React.createContext({} as CanonicalBridgeContextProps);

export function useBridgeConfig() {
  return useContext(CanonicalBridgeContext);
}

export interface CanonicalBridgeProviderProvider {
  config: CanonicalBridgeConfig;
  routeContentBottom?: React.ReactNode;
  transferConfig: ITransferConfig;
  children: React.ReactNode;
}

export function CanonicalBridgeProvider(props: CanonicalBridgeProviderProvider) {
  const { config, transferConfig, children, routeContentBottom } = props;

  const value = useMemo(() => {
    return {
      enableGTM: false,
      appName: 'canonical-bridge-widget',
      refetchingInterval: 30000,
      apiTimeOut: 60000,
      deBridgeAccessToken: '',
      routeContentBottom,
      ...config,
    };
  }, [config, routeContentBottom]);

  return (
    <CanonicalBridgeContext.Provider value={value}>
      <StoreProvider>
        <ThemeProvider themeConfig={value.appearance.theme}>
          <IntlProvider locale={value.appearance.locale} messages={value.appearance.messages}>
            <AggregatorProvider config={transferConfig}>
              <WalletProvider>{children}</WalletProvider>
            </AggregatorProvider>
          </IntlProvider>
        </ThemeProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}