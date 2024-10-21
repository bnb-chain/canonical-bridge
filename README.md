# BNB Chain Canonical Bridge

## Overview

A React.js widget and SDK that facilitates seamless token transfers across different blockchain networks
through various bridge protocols.

Key features include:

1. Multi-Bridge Protocol Support: Choose between cBridge, deBridge, Stargate, and LayerZero to facilitate token transfers.
2. Cross-Chain Transfers: Transfer tokens securely across supported blockchain networks.
3. Fee Information Retrieval: Obtain real-time fee details for cross-chain transactions, helping users make informed decisions.

## Projects

| Project                 | Doc Link                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| canonical bridge sdk    | [Link](https://github.com/bnb-chain/canonical-bridge/tree/main/packages/canonical-bridge-sdk)    |
| canonical bridge widget | [Link](https://github.com/bnb-chain/canonical-bridge/tree/main/packages/canonical-bridge-widget) |

## How to build your own bridge

1. Deploy [canonical-bridge-server](https://github.com/bnb-chain/canonical-bridge/tree/main/apps/canonical-bridge-server) as data service.
2. Introduce widget to your project, please refer to our [example](https://github.com/bnb-chain/canonical-bridge/tree/main/apps/canonical-bridge-ui).

## Contributing

A complete development workflow is as follows:

1. Create a new branch out of `main` branch
2. Make some changes, fix bugs or add new features
3. Run `rush changeset` to create a new changeset
4. Commit the code, code review is required, after code review, we can merge the code to `main`
   branch
5. Then [github action](https://github.com//bnb-chain/canonical-bridge/actions) will automatically execute
   and create a new [release PR](https://github.com//bnb-chain/canonical-bridge/pulls), merge this PR, a new
   version will be released

## License

The contents of this repo are made available under the
[MIT License](https://github.com/bnb-chain/canonical-bridge/tree/main/LICENSE).
