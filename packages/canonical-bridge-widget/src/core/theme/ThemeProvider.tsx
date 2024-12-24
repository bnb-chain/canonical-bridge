import { ChakraProvider, theme as defaultTheme } from '@bnb-chain/space';
import { useMemo } from 'react';

import { useBridgeConfig } from '@/CanonicalBridgeProvider';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useBridgeConfig();

  const customTheme = useMemo(() => {
    return {
      ...defaultTheme,
      breakpoints: theme.breakpoints,
      config: {
        ...defaultTheme.config,
        initialColorMode: theme.colorMode,
        useSystemColorMode: false,
      },
      colors: {
        ...defaultTheme.colors,
        ...theme.colors,
      },
    };
  }, [theme.breakpoints, theme.colorMode, theme.colors]);

  return (
    <ChakraProvider
      colorModeManager={{
        type: 'localStorage',
        get() {
          return theme.colorMode;
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
