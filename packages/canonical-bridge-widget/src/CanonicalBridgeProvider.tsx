import React, { useContext, useMemo } from 'react';
import { ColorMode, IntlProvider } from '@bnb-chain/space';

import { ChainType, IChainConfig, ITransferConfig } from '@/modules/aggregator/types';
import { StoreProvider } from '@/modules/store/StoreProvider';
import { ThemeProvider, ThemeProviderProps } from '@/core/theme/ThemeProvider';
import { AggregatorProvider } from '@/modules/aggregator/components/AggregatorProvider';
import { TokenBalancesProvider } from '@/modules/aggregator/components/TokenBalancesProvider';
import { TokenPricesProvider } from '@/modules/aggregator/components/TokenPricesProvider';
import { locales } from '@/core/locales';
import { TronAccountProvider } from '@/modules/wallet/TronAccountProvider';

export interface ICanonicalBridgeConfig {
  appName: string;
  assetPrefix?: string;

  appearance: {
    colorMode?: ColorMode;
    theme?: ThemeProviderProps['themeConfig'];
    locale?: string;
    messages?: Record<string, string>;
    bridgeTitle?: string;
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
  onClickConnectWallet: (params: {
    chainType: ChainType;
    chainId: number;
    onConnected?: (params?: { walletType?: ChainType; chainId?: number }) => void;
  }) => void;
}

const CanonicalBridgeContext = React.createContext({} as CanonicalBridgeContextProps);

export function useBridgeConfig() {
  return useContext(CanonicalBridgeContext);
}

export interface CanonicalBridgeProviderProps {
  config: ICanonicalBridgeConfig;
  transferConfig?: ITransferConfig;
  chains: IChainConfig[];
  routeContentBottom?: React.ReactNode;
  children: React.ReactNode;
  onClickConnectWallet: CanonicalBridgeContextProps['onClickConnectWallet'];
}

export function CanonicalBridgeProvider(props: CanonicalBridgeProviderProps) {
  const { config, children, chains, transferConfig, routeContentBottom, onClickConnectWallet } =
    props;

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

      http: {
        refetchingInterval: 30000,
        apiTimeOut: 60000,
        deBridgeAccessToken: '',
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
        ...config.http,
      },

      routeContentBottom,
      onClickConnectWallet,
    };
  }, [config, onClickConnectWallet, routeContentBottom]);

  return (
    <CanonicalBridgeContext.Provider value={value}>
      <StoreProvider>
        <IntlProvider locale={value.appearance.locale!} messages={value.appearance.messages}>
          <AggregatorProvider transferConfig={transferConfig} chains={chains}>
            <ThemeProvider
              themeConfig={value.appearance.theme}
              colorMode={value.appearance.colorMode}
            >
              <TronAccountProvider>
                <TokenBalancesProvider />
                <TokenPricesProvider />
                {children}
              </TronAccountProvider>
            </ThemeProvider>
          </AggregatorProvider>
        </IntlProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}
