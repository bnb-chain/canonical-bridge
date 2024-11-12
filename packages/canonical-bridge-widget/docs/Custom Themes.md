# Widget custom themes

## Usage

```javascript
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
          '.bccb-widget-transfer-widget-title': {
            borderRadius: '4px', // overwrite border radius
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
```

## This document lists all the available styling class name in the widget. Please overwrite stylings based on these class name.

1. Widget Main

- bccb-widget-transfer-widget
- bccb-widget-transfer-widget-wrapper
- bccb-widget-transfer-widget-title
- bccb-widget-exchange-chain-icon
- bccb-widget-copy-address
- bccb-widget-info-tooltip
- bccb-widget-switch-wallet-button

2. Network selection section

- bccb-widget-network
- bccb-widget-network-title
- bccb-widget-network-row
- bccb-widget-network-from
- bccb-widget-network-button
- bccb-widget-network-to
- bccb-widget-network-name

3. Bridge Route Section

- bccb-widget-route
- bccb-widget-route-bottom
- bccb-widget-route-wrapper
- bccb-widget-route-container
- bccb-widget-route-container-inner
- bccb-widget-route-name
- bccb-widget-route-name-text
- bccb-widget-route-name-tag-bestTime
- bccb-widget-route-name-tag-bestReturn
- bccb-widget-route-token
- bccb-widget-route-token-amount
- bccb-widget-route-token-tooltip
- bccb-widget-route-token-icon
- bccb-widget-route-estimated-time
- bccb-widget-route-info-text
- bccb-widget-route-info-label
- bccb-widget-route-info-tooltip-fee
- bccb-widget-allowed-send-amount
- bccb-widget-route-error
- bccb-widget-route-skeleton
- bccb-widget-route-header
- bccb-widget-route-body
- bccb-widget-route-list
- bccb-widget-refreshing-button
  - mobile
- bccb-widget-modal-route-overlay
- bccb-widget-modal-route-content
- bccb-widget-modal-route-header
- bccb-widget-modal-route-wrapper

4. Header

- bccb-widget-header-wallet-connect-button
- bccb-widget-header-menu-button
- bccb-widget-header-menu-item
- bccb-widget-header-profile-balance
- bccb-widget-header-profile-list
- bccb-widget-header-profile-disconnect-link
- bccb-widget-header-profile-button
- bccb-widget-header-switching-tips-modal
- bccb-widget-header-preventing-modal
- bccb-widget-header-network-status
- bccb-widget-header-network-status-title
- bccb-widget-header-network-status-network

5. Token Selection Modal

- bccb-widget-token-modal
- bccb-widget-token-modal-content
- bccb-widget-token-virtual-list
- bccb-widget-token-list-address
- bccb-widget-token-list-symbol
- bccb-widget-token-address-link
- bccb-widget-token-list-item
- bccb-widget-token-list-item-disabled
- bccb-widget-token-list-token-balance

6. From Network Selection

- bccb-widget-from-network-list-item
- bccb-widget-from-network-virtual-list
- bccb-widget-from-network-modal
- bccb-widget-from-network-modal-content
- bccb-widget-to-network-modal-content

7. To Network Selection

- bccb-widget-to-network-virtual-list
- bccb-widget-to-network-list-item
- bccb-widget-to-network-modal
- bccb-widget-to-network-modal-content

8. Base Modal

- bccb-widget-modal-search
- bccb-widget-modal-search-right-element
- bccb-widget-modal-no-result-found
- bccb-widget-modal-no-result-found-title
- bccb-widget-modal-no-result-found-text
- bccb-widget-select-list-item-tag

9. Send Amount Input

- bccb-widget-transfer-input-container
- bccb-widget-transfer-input-wrapper
- bccb-widget-transfer-input
- bccb-widget-transfer-max
- bccb-widget-transfer-input-error
- bccb-widget-token-select-button

10. To Account Input

- bccb-widget-to-account-container
- bccb-widget-to-account-title
- bccb-widget-to-account-input-error
- bccb-widget-to-account-input
- bccb-widget-to-account-confirm
- bccb-widget-to-account-checkbox

11. Received Amount Information

- bccb-widget-received-info-container
- bccb-widget-received-info-route-open
- bccb-widget-received-info-route-content
- bccb-widget-received-info-route-loading
- bccb-widget-no-route-found-container
- bccb-widget-no-route-found-icon
- bccb-widget-no-route-found-title
- bccb-widget-no-route-found-desc
- bccb-widget-no-route-found-link

12. Transfer Button

- bccb-widget-transfer-button-container
- bccb-widget-wallet-connect-button
- bccb-widget-switch-network-button
- bccb-widget-transfer-button

13. Transfer Modal

- bccb-widget-modal-close-button
- bccb-widget-modal-main-button
- bccb-widget-modal-second-button
- bccb-widget-modal-body
- bccb-widget-modal-body-icon
- bccb-widget-modal-body-title
- bccb-widget-modal-body-description
- bccb-widget-modal-footer
- bccb-widget-transaction-submitted-modal
- bccb-widget-transaction-failed-modal
- bccb-widget-transaction-confirming-modal
- bccb-widget-transaction-approve-modal
- bccb-widget-route-bottom
