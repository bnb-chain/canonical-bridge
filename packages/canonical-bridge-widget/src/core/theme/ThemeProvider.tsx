import { ChakraProvider, theme, createLocalStorageManager, ColorMode } from '@bnb-chain/space';
import { useMemo } from 'react';
import { merge } from 'lodash';

import { light } from '@/core/theme/colors/light';
import { dark } from '@/core/theme/colors/dark';
import { walletStyles } from '@/core/theme/walletStyles';
import { APP_NAME } from '@/core/constants';

export interface ThemeProviderProps {
  children: React.ReactNode;
  themeConfig?: { dark?: any; light?: any };
}

const colorModeManager = createLocalStorageManager(`${APP_NAME}-color-mode`);

export const ThemeProvider = ({ children, themeConfig }: ThemeProviderProps) => {
  const customTheme = useMemo(() => {
    return {
      ...theme,
      config: {
        ...theme.config,
        initialColorMode: 'dark',
        useSystemColorMode: false,
      },
      styles: {
        global: ({ colorMode }: { colorMode: ColorMode }) => ({
          body: {
            bg: theme.colors[colorMode].background[3],
            minWidth: '768px',
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
  }, [themeConfig]);

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
