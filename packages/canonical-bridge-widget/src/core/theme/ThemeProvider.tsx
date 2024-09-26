import { ChakraProvider, theme, createLocalStorageManager, ColorMode } from '@bnb-chain/space';
import { useMemo } from 'react';
import { merge } from 'lodash';

import { light } from '@/core/theme/colors/light';
import { dark } from '@/core/theme/colors/dark';
import { walletStyles } from '@/core/theme/walletStyles';
import { useBridgeConfig } from '@/index';

export interface ThemeProviderProps {
  colorMode?: ColorMode;
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themeConfig?: { dark?: any; light?: any };
}

export const ThemeProvider = ({
  children,
  colorMode = 'dark',
  themeConfig,
}: ThemeProviderProps) => {
  const { appName: APP_NAME } = useBridgeConfig();
  const colorModeManager = createLocalStorageManager(`${APP_NAME}-color-mode`);
  const customTheme = useMemo(() => {
    return {
      ...theme,
      breakpoints: {
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
            fontFamily: 'Space Grotesk',
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
      colorModeManager={colorModeManager}
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
