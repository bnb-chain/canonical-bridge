import React, { useContext, useMemo } from 'react';
import { DeepPartial, IntlProvider, theme } from '@bnb-chain/space';
import { merge } from 'lodash';
import { theme as spaceTheme } from '@bnb-chain/space';
import {
  ChainType,
  IBridgeChain,
  IBridgeProvider,
  IBridgeToken,
  IChainConfig,
  IExternalChain,
} from '@bnb-chain/canonical-bridge-sdk';
import { breakpoints } from '@bnb-chain/space/dist/modules/theme/foundations/breakpoints';

import { StoreProvider } from '@/modules/store/StoreProvider';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { AggregatorProvider } from '@/modules/aggregator/providers/AggregatorProvider';
import { TokenBalancesProvider } from '@/modules/aggregator/providers/TokenBalancesProvider';
import { TokenPricesProvider } from '@/modules/aggregator/providers/TokenPricesProvider';
import { TronAccountProvider } from '@/modules/wallet/providers/TronAccountProvider';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { ExportsProvider } from '@/ExportsProvider';
import { en } from '@/core/locales/en';
import { light } from '@/core/theme/colors/light';
import { ColorType, dark } from '@/core/theme/colors/dark';

export interface IBridgeConfig {
  bridgeTitle: React.ReactNode;
  assetPrefix: string;

  locale: {
    language: string;
    messages: Record<string, string>;
  };

  theme: {
    colorMode: 'light' | 'dark';
    breakpoints: Partial<typeof theme.breakpoints>;
    colors: {
      dark: DeepPartial<ColorType>;
      light: DeepPartial<ColorType>;
    };
  };

  http: {
    refetchingInterval: number;
    apiTimeOut: number;
    feeReloadMaxTime?: number;
    deBridgeAccessToken?: string;
    deBridgeReferralCode?: string;
    serverEndpoint?: string;
    mesonEndpoint: string;
    mayanSlippageBps?: number;
    mayanGasDrop?: number;
    mayanReferrer?: string;
    mayanReferrerBps?: number;
  };

  components: {
    connectWalletButton: React.ReactNode;
    routeContentBottom?: React.ReactNode;
    refreshingIcon?: React.ReactNode;
  };

  transfer: {
    defaultFromChainId: number;
    defaultToChainId: number;
    defaultTokenAddress: string;
    defaultAmount: string;

    dollarUpperLimit: number;
    providers: IBridgeProvider[];
    chainConfigs: IChainConfig[];
    displayTokenSymbols: Record<number, Record<string, string>>;
    brandChains: number[];
    externalChains: IExternalChain[];
    chainOrders: number[];
    tokenOrders: string[];

    chainSorter: (a?: IBridgeChain, b?: IBridgeChain) => number;
    tokenSorter: (a?: IBridgeToken, b?: IBridgeToken) => number;
  };

  onError?: (params: { type: string; message?: string; error?: Error }) => void;
  onClickConnectWalletButton?: (params: {
    chainType: ChainType;
    chainId: number;
    onConnected?: (params?: { walletType?: ChainType; chainId?: number }) => void;
  }) => void;
}

export type ICustomizedBridgeConfig = DeepPartial<IBridgeConfig>;

export interface CanonicalBridgeProviderProps {
  config?: ICustomizedBridgeConfig;
  children: React.ReactNode;
}

export function CanonicalBridgeProvider(props: CanonicalBridgeProviderProps) {
  const { config, children } = props;

  const {
    bridgeTitle,
    assetPrefix,

    locale,
    theme,
    http,
    components,
    transfer,

    onClickConnectWalletButton,
    onError,
  } = config ?? {};

  const value = useMemo(() => {
    const context: IBridgeConfig = {
      bridgeTitle: bridgeTitle ?? 'BNB Chain Cross-Chain Bridge',
      assetPrefix: assetPrefix ?? 'https://static.bnbchain.org/bnb-chain-bridge/static',

      locale: {
        language: locale?.language ?? en.language,
        messages: {
          ...en.messages,
          ...locale?.messages,
        },
      },

      theme: {
        colorMode: theme?.colorMode ?? 'dark',
        breakpoints: breakpoints ?? {
          ...spaceTheme.breakpoints,
          lg: '1080px',
        },
        colors: {
          dark: merge(dark, theme?.colors?.dark),
          light: merge(light, theme?.colors?.light),
        },
      },

      http: {
        refetchingInterval: 30000,
        apiTimeOut: 60000,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
        mayanSlippageBps: 300,
        mayanGasDrop: 0,
        mayanReferrer: '',
        mayanReferrerBps: 5,
        ...http,
      },

      components: {
        connectWalletButton: <WalletConnectButton />,
        ...components,
      },

      transfer: {
        defaultFromChainId: 1,
        defaultToChainId: 56,
        defaultTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        defaultAmount: '',

        displayTokenSymbols: {},
        brandChains: [],
        externalChains: [],

        dollarUpperLimit: 200000,

        chainOrders: [],
        tokenOrders: [],
        chainSorter(a: IBridgeChain, b: IBridgeChain) {
          if (a.isCompatible && !b.isCompatible) {
            return -1;
          }
          if (!a.isCompatible && b.isCompatible) {
            return 1;
          }

          const indexA = transfer?.chainOrders?.indexOf(a.id) ?? -1;
          const indexB = transfer?.chainOrders?.indexOf(b.id) ?? -1;

          if (indexA > -1 && indexB === -1) {
            return -1;
          }
          if (indexA === -1 && indexB > -1) {
            return 1;
          }
          if (indexA > -1 && indexB > -1) {
            return indexA - indexB;
          }

          return a.name < b.name ? -1 : 1;
        },
        tokenSorter(a: IBridgeToken, b: IBridgeToken) {
          if (a.isCompatible && !b.isCompatible) {
            return -1;
          }
          if (!a.isCompatible && b.isCompatible) {
            return 1;
          }

          const orders = transfer?.tokenOrders?.map((e) => e?.toUpperCase()) ?? [];
          const indexA = orders?.indexOf(a.displaySymbol.toUpperCase()) ?? -1;
          const indexB = orders?.indexOf(b.displaySymbol.toUpperCase()) ?? -1;

          if (indexA > -1 && indexB === -1) {
            return -1;
          }
          if (indexA === -1 && indexB > -1) {
            return 1;
          }
          if (indexA > -1 && indexB > -1) {
            return indexA - indexB;
          }

          return a.name < b.name ? -1 : 1;
        },
        chainConfigs: [],
        providers: [],
        ...transfer,
      } as IBridgeConfig['transfer'],

      onClickConnectWalletButton,
      onError,
    };
    return context;
  }, [
    assetPrefix,
    bridgeTitle,
    components,
    http,
    locale?.language,
    locale?.messages,
    onClickConnectWalletButton,
    onError,
    theme?.colorMode,
    theme?.colors?.dark,
    theme?.colors?.light,
    transfer,
  ]);

  return (
    <CanonicalBridgeContext.Provider value={value}>
      <StoreProvider>
        <IntlProvider locale={value.locale.language} messages={value.locale.messages}>
          <ThemeProvider>
            <AggregatorProvider>
              <TronAccountProvider>
                <TokenBalancesProvider />
                <TokenPricesProvider />
                <ExportsProvider>{children}</ExportsProvider>
              </TronAccountProvider>
            </AggregatorProvider>
          </ThemeProvider>
        </IntlProvider>
      </StoreProvider>
    </CanonicalBridgeContext.Provider>
  );
}

interface CanonicalBridgeContextProps extends IBridgeConfig {}

const CanonicalBridgeContext = React.createContext({} as CanonicalBridgeContextProps);

export function useBridgeConfig() {
  return useContext(CanonicalBridgeContext);
}
