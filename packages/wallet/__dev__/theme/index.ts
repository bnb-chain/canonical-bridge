import { Theme } from '@node-real/uikit';
import { colors } from './colors';

export const theme: Theme = {
  config: {
    useSystemColorMode: false,
    initialColorMode: 'light',
    storageKey: 'bridge-wallet-color-mode',
  },

  styles: {
    global: {
      body: {
        bg: 'bg.bottom',
        fontSize: 14,
        color: 'readable.normal',
        minH: '100vh',
        fontWeight: 500,
        '.ui-toast-manager': {
          pt: 76,
          maxW: 500,
        },
        '.ui-tooltip-content': {
          mx: 16,
        },
      },
    },
  },

  fonts: {
    heading: 'inherit',
  },

  ...colors,
};
