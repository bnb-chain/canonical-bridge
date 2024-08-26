# BNB chain canonical-bridge sdk

This SDK integrates API and methods from multiple cross-chain bridges, such as cBridge(Celer bridge), deBridge and Stargate. Users can easily access information of protocol fees, estimated waiting times and received amount on destination chain, as well as perform cross-chain transfer through this SDK.

## Third Party Bridge Documentation

| Bridge        | Doc Link                                                                 |
| ------------- | ------------------------------------------------------------------------ |
| Celer cBridge | [Link](https://cbridge-docs.celer.network/developer/cbridge-sdk)         |
| deBridge      | [Link](https://docs.debridge.finance/)                                   |
| Stargate V2   | [Link](https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs) |

## Installation

```bash
npm install @bnb-chain/canonical-bridge-sdk viem@^2
```

## Usage

```js
import { CanonicalBridgeSDK } from '@bnb-chain/canonical-bridge-sdk';

/**
 * Initialize SDK Instance
 * @returns SDK Instance
 */
const bridgeSDK = new CanonicalBridgeSDK({
  bridgeConfigs: [
    {
      bridgeType: 'cBridge',
      endpoint: env.CBRIDGE_ENDPOINT,
      timeout: 5000,
    },
    {
      bridgeType: 'deBridge',
      endpoint: env.DEBRIDGE_ENDPOINT,
      statsEndpoint: env.DEBRIDGE_STATS_ENDPOINT,
      timeout: 5000,
    },
  ],
});

const order = await bridgeSDK.deBridge.getOrder({
  id: '0x4cb96c88916d5f08a979750c54f3001ffb4069762326705d431a83f946b3ba64',
});
```

## Demo

[Demo](https://github.com/bnb-chain/canonical-bridge/tree/main/apps/bnb-chain-bridge)

## License

The contents of this repo are made available under the [MIT License](./LICENSE).
