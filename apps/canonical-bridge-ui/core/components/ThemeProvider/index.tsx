import { ChakraProvider, ColorMode, createLocalStorageManager, theme } from '@bnb-chain/space';

import { env } from '@/core/env';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const colorModeManager = createLocalStorageManager(`${env.APP_NAME}-color-mode`);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const customTheme = {
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
          minWidth: '998px',
        },
      }),
    },
  };

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
