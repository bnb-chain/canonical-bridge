import { ChakraProvider, theme, createLocalStorageManager, ColorMode } from '@bnb-chain/space';

import { APP_NAME } from '@/core/configs/app';
import { walletStyles } from '@/core/theme/walletStyles';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const colorModeManager = createLocalStorageManager(`${APP_NAME}-color-mode`);

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
          minWidth: '768px',
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
