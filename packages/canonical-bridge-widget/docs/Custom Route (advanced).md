This widget provides several bridges or routes; deBridge, cBridge, Stargate, LayerZero and Meson. To
enable routes you need to add route settings into transferConfig, which is prop
of<CanonicalBridgeProvider> component. The config structure for individual route is like

```javascript
// ROUTE_NAME should be one of following name
// cBridge | deBridge | meson | stargate | layerZero
ROUTE_NAME: {
  config: ROUTE_CONFIG,
  exclude: {
    chains: [],
    tokens: {}
  },
  bridgedTokenGroups: []
}
```

ROUTE_CONFIG contains the list of token address and bridge address. The token list structure of
different bridge may vary, and you can check demo for more details. To enable deBridge or cBridge
routes, there are a few ways to configure token settings.

1. Deploying Your Own API Server: Fetch the cBridge and deBridge token lists by following the
   deployment instructions
   (https://github.com/bnb-chain/canonical-bridge/tree/main/apps/canonical-bridge-server). This is
   our recommended approach for flexibility and control over updates.
2. Using cBridge or deBridge APIs Directly: Obtain token and chain configurations directly from the
   cBridge API or deBridge API and inject them into transferConfig.
3. Downloading JSON-formatted Settings: Download token settings in JSON format from the cBridge API
   or deBridge API and save them within your application. Be aware that you may need to update these
   files regularly to avoid missing newly supported tokens.

The first option is ideal, but due to the cost of deploying your own API server, the second or third
options may be more feasible.

## API server

The instructions of API server deployment can be found
(https://github.com/bnb-chain/canonical-bridge/tree/main/apps/canonical-bridge-server). The server
provides endpoints /api/bridge/cbridge and /api/bridge/deBridge to retrieve token config, and it
also supported token prices. Deploy API your own API server is highly recommended to access full
widget functionality.

After setting up the token configurations, you may wonder where this token list originates and how
to add more tokens. For this, please check the documentation of each bridge provider. Links to these
documentation are listed below.

[deBridge](https://deswap.debridge.finance/v1.0/#/utils/AppControllerV10_getSupportedChainInfoResponse)

[cBridge](https://cbridge-docs.celer.network/developer/api-reference/gateway-gettransferconfigsforall)

[Stargate](https://stargateprotocol.gitbook.io/stargate/v2-developer-docs/technical-reference/mainnet-contracts)

[Meson](https://meson.dev/api/endpoints/list-chains)

[LayerZero V1 endpoints](https://docs.layerzero.network/v1/developers/evm/technical-reference/mainnet/mainnet-addresses)

## Token Config format

By adding tokens to each route please follow the below token list and network list format.

Stargate:

```javascript
{
"tokens": {
  // chain id. 1 represents Ethereum
  "1": [
    {
      "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // token address
      "bridgeAddress": "0xc026395860Db2d07ee33e05fE50ed7bD583189C7", // bridge contract address
      "decimals": 6,
      "symbol": "USDC",
      "endpointID": 30101, // can be found in stargate link under api server section.
      "name": "USD Coin"
    },
   ]
},
"chains": [
  {
    "chainId": 1,
    "chainName": "Ethereum"
  }
]
}
```

LayerZero:

```javascript
{
"tokens": {
  // chain id of networks.
  "1": [ // 1 => Ethereum
    {
      "address": "0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898", // token address
      "bridgeAddress": "0x152649eA73beAb28c5b49B26eb48f7EAD6d4c898", // bridge contract address
      "decimals": 18,
      "symbol": "CAKE",
      "name": "Cake",
      "endpointID": 101, // This id can be found in layerzero V1 endpoint link above
      "version": 1 // layerzero version
    }
  ],
  "56": [ // 56 => BNB smart chain
    {
      "address": "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
      "bridgeAddress": "0xb274202daBA6AE180c665B4fbE59857b7c3a8091",
      "decimals": 18,
      "symbol": "CAKE",
      "name": "Cake",
      "endpointID": 102,
      "version": 1
    }
  ],
},
"chains": [
  {
    "chainId": 1,
    "chainName": "Ethereum"
  },
  {
    "chainId": 56,
    "chainName": "BSC"
  }
]
}
```

cBridge and deBridge config format is as same as
[cBridge](https://cbridge-docs.celer.network/developer/api-reference/gateway-gettransferconfigsforall)
and
[deBridge](https://deswap.debridge.finance/v1.0/#/utils/AppControllerV10_getSupportedChainInfoResponse)
respectively.
