import '@node-real/walletkit/styles.css';
import React, { useContext, useMemo } from 'react';
import { ColorMode, IntlProvider } from '@bnb-chain/space';

import { IChainConfig, ITransferConfig } from '@/modules/aggregator/types';
import { StoreProvider } from '@/modules/store/StoreProvider';
import { WalletProvider } from '@/modules/wallet/WalletProvider';
import { ThemeProvider, ThemeProviderProps } from '@/core/theme/ThemeProvider';
import { AggregatorProvider } from '@/modules/aggregator/components/AggregatorProvider';

export interface ICanonicalBridgeConfig {
  appName: string;
  assetPrefix?: string;

  appearance: {
    mode?: ColorMode;
    theme?: ThemeProviderProps['themeConfig'];
    locale: string;
    messages: Record<string, string>;
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
        ...config.appearance,
      },

      wallet: {
        ...config.wallet,
      },

      http: {
        refetchingInterval: 30000,
        apiTimeOut: 60000,
        deBridgeAccessToken: '',
        ...config.http,
      },

      routeContentBottom,
    };
  }, [config, routeContentBottom]);

  return (
    <CanonicalBridgeContext.Provider value={value}>
      <StoreProvider>
        <ThemeProvider themeConfig={value.appearance.theme} colorMode={value.appearance.mode}>
          <IntlProvider locale={value.appearance.locale} messages={value.appearance.messages}>
            <WalletProvider chainConfigs={chains}>
              <AggregatorProvider transferConfig={transferConfig} chainConfigs={chains}>
                {children}
              </AggregatorProvider>
            </WalletProvider>
          </IntlProvider>
        </ThemeProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}
