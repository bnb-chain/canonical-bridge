import '@node-real/walletkit/styles.css';
import React, { useContext, useMemo } from 'react';
import { ColorMode, IntlProvider } from '@bnb-chain/space';

import { ITransferConfig } from '@/modules/aggregator/types';
import { StoreProvider } from '@/modules/store/StoreProvider';
import { WalletProvider } from '@/modules/wallet/WalletProvider';
import { ThemeProvider, ThemeProviderProps } from '@/core/theme/ThemeProvider';
import { AggregatorProvider } from '@/modules/aggregator/components/AggregatorProvider';
import { TokenBalancesProvider } from '@/modules/aggregator/components/TokenBalancesProvider';
import { TokenPricesProvider } from '@/modules/aggregator/components/TokenPricesProvider';

export interface CanonicalBridgeConfig {
  appearance: {
    mode?: ColorMode;
    theme?: ThemeProviderProps['themeConfig'];
    locale: 'en';
    messages: Record<string, string>;
  };
  walletConfig: {
    walletConnectProjectId: string;
  };
  appName?: string;
  refetchingInterval?: number;
  apiTimeOut?: number;
  deBridgeAccessToken?: string;
  assetsPrefix?: string;
  transferConfigEndpoint: string;
  bridgeTitle?: string;
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
        <ThemeProvider themeConfig={value.appearance.theme} colorMode={value.appearance.mode}>
          <IntlProvider locale={value.appearance.locale} messages={value.appearance.messages}>
            <AggregatorProvider config={transferConfig}>
              <WalletProvider>
                <TokenBalancesProvider />
                <TokenPricesProvider />
                {children}
              </WalletProvider>
            </AggregatorProvider>
          </IntlProvider>
        </ThemeProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}
