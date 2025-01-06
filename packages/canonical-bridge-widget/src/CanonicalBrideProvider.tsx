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
    deBridgeAccessToken: string;
    serverEndpoint?: string;
    mesonEndpoint: string;
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

    providers: IBridgeProvider[];
    chainConfigs: IChainConfig[];
    displayTokenSymbols: Record<number, Record<string, string>>;
    brandChains: number[];
    externalChains: IExternalChain[];
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
        deBridgeAccessToken: '',
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
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

        displayTokenSymbols: {
          10: {
            '0x7F5c764cBc14f9669B88837ca1490cCa17c31607': 'USDC.e',
          },
          56: {
            '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': 'ETH',
          },
          137: {
            '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': 'USDC.e',
          },
          324: {
            '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4': 'USDC',
            '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4': 'USDC.e',
          },
          1101: {
            '0x37eAA0eF3549a5Bb7D431be78a3D99BD360d19e5': 'USDC.e',
          },
          42161: {
            '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8': 'USDC.e',
          },
          43114: {
            '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664': 'USDC.e',
            '0xc7198437980c041c805A1EDcbA50c1Ce5db95118': 'USDT.e',
            '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB': 'WETH.e',
          },
        },
        brandChains: [],
        externalChains: [],
        chainSorter: () => 0,
        tokenSorter: () => 0,
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
