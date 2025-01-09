## Installation

```bash
npm install @bnb-chain/canonical-bridge-widget viem@^2
```

## Usage

Before diving into the code, let's take a us quick look at the project structure of the
canonical-bridge-ui(https://github.com/bnb-chain/canonical-bridge/tree/main/apps/canonical-bridge-ui).
This overview will help you understand the project better and easily locate the relevant reference
files.

- core: This folder contains localization files ( e.g. en.ts) for multi-language support and theme
  files (dark.ts and light.ts) are located.
- pages: You can find usage example of widget provider within mainnet or testnet folders.
- public: The folder holds image assets for token and network .
- token-config: token-config contains token and network configuration for each route. Configuration
  files like config.json for LayerZero, Stargate and Meson are located in this folder, along with
  the setting file useTransferConfig.ts.

The code below provides a simple example of setting up Stargate route. All token and chain settings
are passed as props to <CanonicalBridgeProvider> component.

```javascript
// index.tsx
import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
  TransferWidget,
} from '@bnb-chain/canonical-bridge-widget';
import { useTransferConfig } from '@/token-config/mainnet/useTransferConfig';
import { en as messages } from '@/core/locales/en';

export const bridgeConfig: ICanonicalBridgeConfig = {
  assetPrefix: '',
  appearance: {
    bridgeTitle: 'Widget Title',
    locale: 'en',
    messages,
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
  },
  wallet: {
    walletConnectProjectId: 'WALLET-CONNECT-PROJECT-ID',
  },
  http: {
    serverEndpoint: 'YOUR-SERVER-ENDPOINT',
  },
};

const chains = [
  {
    id: 1,
    name: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://ethereum-rpc.publicnode.com/',
    explorer: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  {
    id: 56,
    name: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrl: 'https://bsc-dataseed.bnbchain.org',
    explorer: {
      name: 'bscscan',
      url: 'https://bscscan.com',
    },
  },
  {
    id: 137,
    name: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrl: 'https://polygon-rpc.com',
    explorer: {
      name: 'polygonscan',
      url: 'https://polygonscan.com',
    },
  },
  // other networks
];

export default function MainnetPage() {
  const transferConfig = useTransferConfig();

  return (
    <CanonicalBridgeProvider config={bridgeConfig} transferConfig={transferConfig} chains={chains}>
      <TransferWidget />
    </CanonicalBridgeProvider>
  );
}
```

```javascript
// useTransferConfig.ts
import { useEffect, useState } from 'react';
import { ITransferConfig } from '@bnb-chain/canonical-bridge-widget';
import stargateConfig from '@/token-config/mainnet/stargate/config.json';

export function useTransferConfig() {
  const [transferConfig, setTransferConfig] = useState<ITransferConfig>();

  useEffect(() => {
    const initConfig = async () => {

      const transferConfig: ITransferConfig = {
        defaultSelectedInfo: {
          fromChainId: 1,
          toChainId: 56,
          tokenSymbol: 'USDT', // USDT
          amount: '20', // 20 USDT
        },
        order: {
          chains: [56, 1], // BNB smart chain then Ethereum
          tokens: ['USDC', 'USDT', 'FDUSD'],
        },
        displayTokenSymbols: {
          56: {
            '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': 'ETH',
          },
        },
        stargate: {
          config: stargateConfig,
          exclude: {
            chains: [137], // Polygon
            tokens: {
              1: ['cUSDCv3'],
              56: [
                '0x67d66e8ec1fd25d98b3ccd3b19b7dc4b4b7fc493',
                '0x0000000000000000000000000000000000000000',
              ],
            },
          },
          bridgedTokenGroups: [
            ['USDT', 'USDT.e'],
            ['USDC', 'USDC.e'],
          ],
        },
        // other route settings go here...
      };

      setTransferConfig(transferConfig);
    };

    initConfig();
  }, []);

  return transferConfig;
}
```

```json
// This is an token list example for Stargate route only.
// for other routes, please refer to
// https://github.com/bnb-chain/canonical-bridge/tree/main/apps/canonical-bridge-ui
{
  "tokens": {
    "1": [
      {
        "address": "0x0000000000000000000000000000000000000000",
        "bridgeAddress": "0x77b2043768d28E9C9aB44E1aBfC95944bcE57931",
        "decimals": 18,
        "symbol": "ETH",
        "endpointID": 30101,
        "name": "Ether"
      },
      {
        "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "bridgeAddress": "0xc026395860Db2d07ee33e05fE50ed7bD583189C7",
        "decimals": 6,
        "symbol": "USDC",
        "endpointID": 30101,
        "name": "USD Coin"
      },
      {
        "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "bridgeAddress": "0x933597a323Eb81cAe705C5bC29985172fd5A3973",
        "decimals": 6,
        "symbol": "USDT",
        "endpointID": 30101,
        "name": "Tether USD"
      },
      {
        "address": "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e",
        "bridgeAddress": "0xcDafB1b2dB43f366E48e6F614b8DCCBFeeFEEcD3",
        "decimals": 18,
        "symbol": "METIS",
        "endpointID": 30101,
        "name": "Metis"
      },
      {
        "address": "0xd5f7838f5c461feff7fe49ea5ebaf7728bb0adfa",
        "bridgeAddress": "0x268Ca24DAefF1FaC2ed883c598200CcbB79E931D",
        "decimals": 18,
        "symbol": "mETH",
        "endpointID": 30101,
        "name": "Mantle Staked Ether"
      }
    ],
    "56": [
      {
        "address": "0x55d398326f99059fF775485246999027B3197955",
        "bridgeAddress": "0x138EB30f73BC423c6455C53df6D89CB01d9eBc63",
        "decimals": 18,
        "symbol": "USDT",
        "endpointID": 30102,
        "name": "Tether USD"
      },
      {
        "address": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        "bridgeAddress": "0x962Bd449E630b0d928f308Ce63f1A21F02576057",
        "decimals": 18,
        "symbol": "USDC",
        "endpointID": 30102,
        "name": "USD Coin"
      }
    ],
    "97": [
      {
        "address": "0xe37bdc6f09dab6ce6e4ebc4d2e72792994ef3765",
        "bridgeAddress": "0x0a0C1221f451Ac54Ef9F21940569E252161a2495",
        "decimals": 6,
        "symbol": "USDT",
        "endpointID": 40102,
        "network": "testnet",
        "name": "Tether USD"
      }
    ],
    "137": [
      {
        "address": "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
        "bridgeAddress": "0x9Aa02D4Fae7F58b8E8f34c66E756cC734DAc7fe4",
        "decimals": 6,
        "symbol": "USDC",
        "endpointID": 30109,
        "name": "USD Coin"
      },
      {
        "address": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        "bridgeAddress": "0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7",
        "decimals": 6,
        "symbol": "USDT",
        "endpointID": 30109,
        "name": "Tether USD"
      }
    ]
  },
  "chains": [
    {
      "chainId": 1,
      "chainName": "Ethereum"
    },
    {
      "chainId": 56,
      "chainName": "BSC"
    },
    {
      "chainId": 97,
      "chainName": "BSC Testnet",
      "network": "testnet"
    },
    {
      "chainId": 137,
      "chainName": "Polygon"
    }
  ]
}
```

```javascript
export const en = {
  'select-modal.tag.incompatible': 'Incompatible',
  'select-modal.search.no-result.title': 'No result found',
  'select-modal.search.no-result.warning':
    'Try adjusting your search request to find what you’re looking for',
};
```

## Initiation steps

1. Create token and chains config file for route (config.json) which will be used in
   useTransferConfig.ts to config tokens and transfer settings.
2. Config chains settings in index.ts. This setting is essential for wallet connections. rpcUrl and
   id are available on ChainList.
3. Prepare token and network icon images. The default token and chain images can be found in public
   folder. Please copy these images to public images folder of your application. If you skip this
   step images and network icons will be blank.
4. Create a localization file en.ts , for multi-language support.
5. Import CanonicalBridgeProvider, ICanonicalBridgeConfig and TransferWidget components from
   @bnb-chain/canonical-bridge-widget and Config bridgeConfig, transferConfig and chains props
   within <CanonicalBridgeProvider> component accordingly.
6. Once setup is completed, you should be able to open widget UI and initiate token transfer. Ensure
   you have sufficient tokens to activate the send button.

The above demo is specific to Stargate route. Our widget also supports other routes, including
cBridge, deBridge, LayerZero and Meson. To enable additional routes, config route in transferConfig
is required. You can find more information in Custom Route (advanced).

For available tokens and networks supported by each route, please refer to Network Configuration and
Token Configuration. Note that token and networks settings vary across different routes. For details
of configuration please refer to Bridge configuration (basic), Token configuration (advanced) and
Network Configuration

P.S. to enable deBridge or cBridge routes, please check Custom Route (advanced) for further details.
