# Bridge configuration (basic)

Bridge configuration allows user to config title, theme color, multi-language and server API.

```javascript
const bridgeConfig: ICanonicalBridgeConfig = {
  appName: 'Your-App-Name',
  assetPrefix: '',
  appearance: {
    bridgeTitle: 'Bridge Title',
    mode: 'dark',
    theme: {
      dark: {
        input: {
          background: '#1E2026',
          title: '#8C8F9B',
        },
      },
      light: {},
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
    deBridgeAccessToken: '',
    serverEndpoint: env.WIDGET_SERVER_ENDPOINT,
  },
};
```

## appName

This is the prefix of images url. The default token and chain images can be found in
canonical-bridge-ui. Please copy these images to your /images folder.

## appearance

1. theme: Light and dark color configuration. For full list of available color settings

2. mode: Dark/light mode. Default mode is dark

3. locale: Language of your website. For example: 'fr' or 'zh-CN'.

4. message: Multilingual message. You need to create individual language files, for example fr.ts .
   Message format should look like this. Replace the message value with the language you want. <b>Do
   not change the value within curly bracket!</b>.

## wallet

walletConnectProjectId: WalletConnect Cloud project identifier. You can find your projectId on your
WalletConnect dashboard.

## http

1. refetchingInterval: Optional. Time interval for fetching bridge fees. Default value is 30
   seconds. Please do not set this value to more than 30 seconds to avoid sending outdated orders,
   which may result in transaction failure.

2. apiTimeOut: Optional. Bridge API request timeout. Default value is 1 min.

3. serverEndpoint: Server endpoint to fetch token price and token list. You need to deploy your
   server API. Please check the docs.
