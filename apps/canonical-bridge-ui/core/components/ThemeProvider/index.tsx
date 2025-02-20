import { ChakraProvider, ColorMode, createLocalStorageManager, theme } from '@bnb-chain/space';

import { env } from '@/core/env';
import { walletStyles } from '@/core/theme/walletStyles';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const colorModeManager = createLocalStorageManager(`${env.APP_NAME}-color-mode`);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const customTheme = {
    ...theme,
    breakpoints: {
      ...theme.breakpoints,
      lg: '1080px',
    },
    config: {
      ...theme.config,
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
    styles: {
      global: ({ colorMode }: { colorMode: ColorMode }) => ({
        body: {
          bg: theme.colors[colorMode].background[3],
          '.bccb-widget-transaction-summary-modal-overlap': {
            opacity: '0.88 !important',
          },
        },
        ...walletStyles(colorMode),
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
