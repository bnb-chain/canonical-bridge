# BNB Chain Canonical Bridge Widget

A React.js widget that facilitates seamless token transfers across different blockchain networks
using various bridge protocols.

## Overview

A React.js widget enables users to transfer assets across multiple blockchains directly. It supports
a variety of blockchains, leveraging modern bridge protocols (e.g., LayerZero, cBridge, deBridge...)
to perform cross-chain transactions in a secure and efficient manner.

## Features

- **Multiple blockchains support**: Transfer tokens between multiple networks.
- **Bridge Integration**: Built on LayerZero or similar bridging protocols.
- **Customizable theme**: Configure colors to match your application's look and feel.
- **Configurable tokens and networks**: Easily configure support network and tokens.
- **Multi-language support**: Easily configure multiple languages to match the user's local
  language.

## Quick Start

```bash
npm install @bnb-chain/canonical-bridge-widget viem@^2
```

## Usage

Import the widget providers into your React application and start using it by providing the
necessary configs.

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
  TransferWidget,
} from '@bnb-chain/canonical-bridge-widget';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

const config: ICanonicalBridgeConfig = {
  assetPrefix: env.ASSET_PREFIX,
  appearance: {
    bridgeTitle: 'Widget Title',
    mode: 'dark',
    theme: {
      dark: dark,
      light: light,
    },
    locale: 'en',
    messages,
  },
  wallet: {
    walletConnectProjectId: env.WALLET_CONNECT_PROJECT_ID,
  },
  http: {
    refetchingInterval: 30 * 1000, // 30s
    apiTimeOut: 60 * 1000, // 60s
    deBridgeAccessToken: '', // optional deBridge referral code https://app.debridge.finance/refer
    serverEndpoint: env.SERVER_ENDPOINT,
  },
};

export default function App() {
  const transferConfig = useTransferConfig();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CanonicalBridgeProvider config={config} transferConfig={transferConfig} chains={chains}>
          <Layout>
            <TransferWidget />
          </Layout>
        </CanonicalBridgeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

For more details, please see the example here.
[here](https://github.com/bnb-chain/canonical-bridge/blob/main/apps/canonical-bridge-ui/pages/_app.tsx)

## License

The contents of this repo are made available under the
[MIT License](https://github.com/bnb-chain/canonical-bridge/tree/main/LICENSE).
