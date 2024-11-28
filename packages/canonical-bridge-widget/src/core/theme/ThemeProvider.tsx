import { ChakraProvider, ColorMode, theme } from '@bnb-chain/space';
import { useMemo } from 'react';
import { merge } from 'lodash';

import { light } from '@/core/theme/colors/light';
import { dark } from '@/core/theme/colors/dark';
import { walletStyles } from '@/core/theme/walletStyles';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { appearance } = useBridgeConfig();
  const { theme: themeConfig, colorMode } = appearance;

  const customTheme = useMemo(() => {
    return {
      ...theme,
      breakpoints: themeConfig?.breakpoints ?? {
        ...theme.breakpoints,
        lg: '1080px',
      },
      config: {
        ...theme.config,
        initialColorMode: colorMode,
        useSystemColorMode: false,
      },
      styles: {
        global: ({ colorMode }: { colorMode: ColorMode }) => ({
          body: {
            bg: themeConfig?.[colorMode]?.background?.body ?? theme.colors[colorMode].background[3],
            fontFamily: themeConfig?.fontFamily ?? "'Space Grotesk', -apple-system, sans-serif",
          },
          ...walletStyles(colorMode),
        }),
      },
      colors: {
        ...theme.colors,
        dark: merge(dark, themeConfig?.dark),
        light: merge(light, themeConfig?.light),
      },
    };
  }, [colorMode, themeConfig]);

  return (
    <ChakraProvider
      colorModeManager={{
        type: 'localStorage',
        get() {
          return colorMode;
        },
        set() {},
      }}
      theme={customTheme}
      toastOptions={{
        defaultOptions: {
          position: 'top',
        },
      }}
    >
      {children}
    </ChakraProvider>
  );
};
