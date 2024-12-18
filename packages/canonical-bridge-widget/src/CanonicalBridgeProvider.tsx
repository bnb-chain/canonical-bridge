import React, { useContext, useMemo } from 'react';
import { ColorMode, IntlProvider, theme } from '@bnb-chain/space';

import { ChainType, IChainConfig, ITransferConfig } from '@/modules/aggregator/types';
import { StoreProvider } from '@/modules/store/StoreProvider';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { AggregatorProvider } from '@/modules/aggregator/components/AggregatorProvider';
import { TokenBalancesProvider } from '@/modules/aggregator/components/TokenBalancesProvider';
import { TokenPricesProvider } from '@/modules/aggregator/components/TokenPricesProvider';
import { locales } from '@/core/locales';
import { TronAccountProvider } from '@/modules/wallet/TronAccountProvider';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { ExportsProvider } from '@/ExportsProvider';

export interface ICanonicalBridgeConfig {
  appName: string;
  assetPrefix?: string;

  appearance: {
    colorMode?: ColorMode;
    theme?: {
      dark?: any;
      light?: any;
      fontFamily?: string;
      breakpoints?: Partial<typeof theme.breakpoints>;
    };
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
  connectWalletButton: React.ReactNode;
  refreshingIcon?: React.ReactNode;
  onClickConnectWalletButton?: (params: {
    chainType: ChainType;
    chainId: number;
    onConnected?: (params?: { walletType?: ChainType; chainId?: number }) => void;
  }) => void;
  onError?: (params: { type: string; message?: string; error?: Error }) => void;
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
  connectWalletButton?: React.ReactNode;
  children: React.ReactNode;
  onClickConnectWalletButton?: CanonicalBridgeContextProps['onClickConnectWalletButton'];
  onError?: CanonicalBridgeContextProps['onError'];
  refreshingIcon?: React.ReactNode;
}

export function CanonicalBridgeProvider(props: CanonicalBridgeProviderProps) {
  const {
    config,
    children,
    chains,
    transferConfig,
    routeContentBottom,
    connectWalletButton,
    refreshingIcon,
    onClickConnectWalletButton,
    onError,
  } = props;

  const value = useMemo<CanonicalBridgeContextProps>(() => {
    return {
      ...config,

      appearance: {
        bridgeTitle: 'BNB Chain Cross-Chain Bridge',
        colorMode: 'dark',
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
      connectWalletButton: connectWalletButton ?? <WalletConnectButton />,
      onClickConnectWalletButton,
      onError,
      refreshingIcon,
    };
  }, [
    config,
    connectWalletButton,
    onClickConnectWalletButton,
    onError,
    refreshingIcon,
    routeContentBottom,
  ]);

  return (
    <CanonicalBridgeContext.Provider value={value}>
      <StoreProvider>
        <IntlProvider locale={value.appearance.locale!} messages={value.appearance.messages}>
          <AggregatorProvider transferConfig={transferConfig} chains={chains}>
            <ThemeProvider>
              <TronAccountProvider>
                <TokenBalancesProvider />
                <TokenPricesProvider />
                <ExportsProvider>{children}</ExportsProvider>
              </TronAccountProvider>
            </ThemeProvider>
          </AggregatorProvider>
        </IntlProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}
