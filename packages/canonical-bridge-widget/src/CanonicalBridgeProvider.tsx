import '@node-real/walletkit/styles.css';
import React, { useContext, useMemo } from 'react';
import { ColorMode, IntlProvider } from '@bnb-chain/space';

import { IChainConfig, ITransferConfig } from '@/modules/aggregator/types';
import { StoreProvider } from '@/modules/store/StoreProvider';
import { WalletProvider } from '@/modules/wallet/WalletProvider';
import { ThemeProvider, ThemeProviderProps } from '@/core/theme/ThemeProvider';
import { AggregatorProvider } from '@/modules/aggregator/components/AggregatorProvider';
import { TokenBalancesProvider } from '@/modules/aggregator/components/TokenBalancesProvider';
import { TokenPricesProvider } from '@/modules/aggregator/components/TokenPricesProvider';
import { locales } from '@/core/locales';

export interface ICanonicalBridgeConfig {
  appName: string;
  assetPrefix?: string;

  appearance: {
    mode?: ColorMode;
    theme?: ThemeProviderProps['themeConfig'];
    locale?: string;
    messages?: Record<string, string>;
    bridgeTitle?: string;
  };

  wallet: {
    walletConnectProjectId: string;
  };

  http: {
    refetchingInterval?: number;
    apiTimeOut?: number;
    deBridgeAccessToken?: string;
    serverEndpoint: string;
    mesonEndpoint?: string;
  };
}

interface CanonicalBridgeContextProps extends ICanonicalBridgeConfig {
  routeContentBottom: React.ReactNode;
}

const CanonicalBridgeContext = React.createContext({} as CanonicalBridgeContextProps);

export function useBridgeConfig() {
  return useContext(CanonicalBridgeContext);
}

export interface CanonicalBridgeProviderProvider {
  config: ICanonicalBridgeConfig;
  transferConfig?: ITransferConfig;
  chains: IChainConfig[];
  routeContentBottom?: React.ReactNode;
  children: React.ReactNode;
}

export function CanonicalBridgeProvider(props: CanonicalBridgeProviderProvider) {
  const { config, children, chains, transferConfig, routeContentBottom } = props;

  const value = useMemo<CanonicalBridgeContextProps>(() => {
    return {
      ...config,

      appearance: {
        bridgeTitle: 'BNB Chain Cross-Chain Bridge',
        mode: 'dark',
        locale: 'en',
        messages: locales.en,
        ...config.appearance,
      },

      wallet: {
        ...config.wallet,
      },

      http: {
        refetchingInterval: 30000,
        apiTimeOut: 60000,
        deBridgeAccessToken: '',
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
        ...config.http,
      },

      routeContentBottom,
    };
  }, [config, routeContentBottom]);

  return (
    <CanonicalBridgeContext.Provider value={value}>
      <StoreProvider>
        <IntlProvider locale={value.appearance.locale!} messages={value.appearance.messages}>
          <AggregatorProvider transferConfig={transferConfig} chains={chains}>
            <ThemeProvider themeConfig={value.appearance.theme} colorMode={value.appearance.mode}>
              <WalletProvider>
                <TokenBalancesProvider />
                <TokenPricesProvider />
                {children}
              </WalletProvider>
            </ThemeProvider>
          </AggregatorProvider>
        </IntlProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}
