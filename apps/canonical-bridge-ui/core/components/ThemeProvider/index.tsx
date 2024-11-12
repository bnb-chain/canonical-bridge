import { ChakraProvider, ColorMode, createLocalStorageManager, theme } from '@bnb-chain/space';

import { env } from '@/core/env';

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
          '.bccb-widget-transfer-widget-wrapper': {
            bg: '#123456',
            borderRadius: '10px',
            padding: '100px 20px',
          },
          '.bccb-widget-route-wrapper': {
            background: '#8C8F9B',
            padding: '20px',
            borderWidth: '5px',
            borderRadius: '20px',
            color: '#fff',
          },
          '.bccb-widget-transfer-widget-title': {
            fontSize: '20px',
            fontWeight: 700,
            color: 'red',
          },
          '.bccb-widget-route-container-inner': {
            borderColor: 'orange',
          },
          '.bccb-widget-route-estimated-time, .bccb-widget-route-fee-info, .bccb-widget-allowed-send-amount':
            {
              color: 'orange',
              fontWeight: 700,
              fontSize: '20px',
            },
          '.bccb-widget-route-info-tooltip-fee, .bccb-widget-route-token-tooltip-content, .bccb-widget-route-token-tooltip-content .tooltip-arrow, .bccb-widget-route-token-tooltip-body':
            {
              background: 'pink',
              fontWeight: 700,
              fontSize: '20px',
              borderRadius: '20px',
            },
          '.bccb-widget-route-token-tooltip-body > div, .bccb-widget-route-info-tooltip-fee > div, .bccb-widget-route-token-tooltip > div':
            {
              fontWeight: 700,
              fontSize: '20px',
            },
          '.bccb-widget-info-tooltip': {
            background: 'orange',
            borderRadius: '20px',
            shadowBox: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
          },
          '.bccb-widget-info-tooltip .chakra-tooltip__arrow': { background: 'orange !important' },
          '.bccb-widget-route-name-tag-bestTime, .bccb-widget-route-name-tag-bestReturn': {
            color: 'grey',
            fontSize: '20px',
          },
          '.bccb-widget-route-token-amount': {
            color: '#123456',
          },
          '.bccb-widget-received-info-container p': {
            color: 'yellow',
            fontSize: '20px',
          },
          '.bccb-widget-token-list-item': {
            bg: 'brown',
            border: '3px solid red',
            padding: '30px',
            borderRadius: '20px',
            '&:hover': {
              bg: 'green',
            },
            '> img, .default-icon': {
              width: '50px',
              height: '50px',
              transform: 'rotate(125deg)',
            },
          },
          '.bccb-widget-token-list-item-disabled': {
            bg: '#fff1af',
            opacify: 0.1,
            border: '3px solid purple',
            padding: '30px',
            borderRadius: '20px',
            '&:hover': {
              bg: 'green',
            },
          },
          '.bccb-widget-token-list-address > p': {
            color: 'purple',
            fontSize: '20px',
            fontWeight: 700,
          },
          '.bccb-widget-token-list-token-balance': {
            fontSize: '20px',
            color: '#83a6ac',
          },
          '.bccb-widget-token-list-symbol': {
            fontSize: '20px',
            color: '#83a6ac',
          },
          '.bccb-widget-select-list-item-tag': {
            fontSize: '20px',
            fontWeight: 700,
            color: '#83a6ac',
          },
          '.bccb-widget-from-network-modal-content': {
            background: 'pink',
            borderRadius: '20px',
            padding: '20px',
            width: '700px',
          },
          '.bccb-widget-token-modal-search > input, .bccb-widget-token-modal-header-search > input, .bccb-widget-from-network-modal-search > input':
            {
              fontSize: '35px',
              color: 'red',
              borderColor: '#83a6ac',
            },
          '.bccb-widget-token-address-link .token-name': {
            color: 'black',
            bg: 'white',
          },
          '.bccb-widget-select-list-wrapper': {
            paddingBottom: '30px',
          },
          '.bccb-widget-transfer-max .max-text': {
            fontSize: '20px',
            color: 'red',
          },
          '.bccb-widget-modal-no-result-found, .bccb-widget-modal-no-result-found-text': {
            fontSize: '25px',
            fontWeight: 700,
            color: 'green',
            '& svg': {
              width: '70px',
              height: '70px',
            },
          },
          '.bccb-widget-token-modal-search svg': {
            height: '50px',
            width: '50px',
          },
          '.bccb-widget-token-modal-header': {
            fontSize: '20px',
            fontWeight: 700,
            color: '#83a6ac',
          },
          '.bccb-widget-transfer-input-container': {
            '& > div': {
              marginBottom: '20px',
            },
            '& .input-header-label': {
              color: '#83a6ac',
              fontSize: '20px',
              fontWeight: 700,
            },
            '.bccb-widget-transfer-input-wrapper': {
              '&:hover': {
                borderColor: 'yellow',
                borderWidth: '5px',
                borderRadius: '4px',
              },
            },
            '& input': {
              fontSize: '15px',
              fontWeight: 400,
              color: 'pink',
              borderColor: '#83a6ac',

              '&:hover': {
                borderColor: 'red',
              },
            },
          },
          '.bccb-widget-token-select-button': {
            borderRadius: '2px',
            height: '50px',
            bg: 'pink',
            color: '#83a6ac',
            fontSize: '20px',
            fontWeight: 700,
          },
          '.bccb-widget-route-error': {
            '& .error-text': {
              color: 'green',
              fontSize: '20px',
              fontWeight: 700,
            },
            '& svg': {
              width: '20px',
              height: '20px',
            },
          },
          '.bccb-widget-route-name-text': {
            color: 'white',
            fontSize: '24px',
            fontWeight: 700,
          },
          '.bccb-widget-network-button': {
            bg: '#83a6ac',
            color: 'white',
            borderRadius: '20px',
            padding: '10px 20px',
            borderWidth: '5px',
            '& .bccb-widget-network-name > p': {
              fontSize: '18px',
              fontWeight: 700,
            },
          },
          '.bccb-widget-transfer-input-error': {
            color: 'pink',
            fontSize: '20px',
            fontWeight: 700,
          },
          '.bccb-widget-from-network-list-item, .bccb-widget-to-network-list-item ': {
            p: '30px',
            bg: 'red',
            borderRadius: '20px',
            fontWeight: 700,
            color: 'black',
            fontSize: '20px',
            '&:hover': {
              bg: 'orange',
            },
          },
          '.bccb-widget-from-network-list-item-active, .bccb-widget-to-network-list-item-active': {
            borderColor: 'green',
            borderWidth: '5px',
            bg: '#83a6ac',
          },
          '.bccb-widget-transfer-button button': {
            fontSize: '20px',
            fontWeight: 700,
            borderRadius: '30px',
            borderWidth: '1px',
            borderColor: 'red',
          },
          '.bccb-widget-network-title > p': {
            color: 'pink',
          },
          '.bccb-widget-wallet-connect-button, .bccb-widget-switch-network-button, .bccb-widget-transfer-button':
            {
              fontWeight: 700,
              fontSize: '27px',
              borderRadius: '2px',
              padding: '10px 20px',
            },
          '.bccb-widget-transaction-confirming-modal, .bccb-widget-transaction-submitted-modal, .bccb-widget-transaction-failed-modal, .bccb-widget-transaction-confirming-modal, .bccb-widget-transaction-approve-modal':
            {
              maxWidth: '700px',
              borderRadius: '2px',
              '& .bccb-widget-modal-body ': {
                bg: 'pink',
                '& svg': {
                  height: '20px',
                  width: '20px',
                },
              },
              '.bccb-widget-modal-main-button': {
                padding: '30px',
                fontWeight: 700,
                fontSize: '25px',
              },
            },
          '.bccb-widget-route-header': {
            fontWeight: 700,
            fontSize: '20px',
          },
          '.bccb-widget-refreshing-button svg': {
            width: '20px',
            height: '20px',
          },
          '.bccb-widget-header-menu-list': {
            padding: '20px',
            '& .bccb-widget-header-menu-item': {
              fontSize: '20px',
              fontWeight: 700,
              color: 'pink',
              '&:hover': {
                bg: 'orange',
              },
            },
            '& .bccb-widget-header-menu-item-selected': {
              bg: 'orange',
            },
          },
          '.bccb-widget-header-menu-button, .bccb-widget-header-network-status-network, .bccb-widget-header-dropdown-button, .bccb-widget-header-dropdown-button-not-connect, .bccb-widget-header-profile-button':
            {
              color: 'pink',
              borderRadius: '2px',
              outlineColor: 'red',
              '& button, & .profile-address': {
                fontWeight: 700,
                fontSize: '30px',
              },
              '& p': {
                color: 'red',
              },
            },
          '.bccb-widget-header-network-status': {
            '& .bccb-widget-switch-network-button': {
              fontSize: '10px',
              borderRadius: '5px',
              bg: 'white',
            },
          },
          '.bccb-widget-header-network-status-title': {
            fontSize: '20px',
            fontWeight: 700,
          },
          '.bccb-widget-header-dropdown-button': {
            fontWeight: 700,
            fontSize: '30px',
            color: 'green',
            ' & .chain-name p': {
              fontSize: '20px',
            },
          },
          '.bccb-widget-header-profile-list': {
            color: 'red',
          },
          '.bccb-widget-header-profile-balance': {
            color: '#d7877d',
          },
          '.bccb-widget-header-profile-disconnect-link > div': {
            bg: 'orange',
            fontSize: '20px',
            fontWeight: 700,
          },
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
