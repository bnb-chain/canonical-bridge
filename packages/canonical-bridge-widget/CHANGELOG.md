# @bnb-chain/canonical-bridge-widget

## 0.8.0

### Minor Changes

- c98e5d6: Add mayan route

### Patch Changes

- Updated dependencies [c98e5d6]
  - @bnb-chain/canonical-bridge-sdk@0.6.0

## 0.8.0-alpha.0

### Minor Changes

- Add mayan route

### Patch Changes

- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.6.0-alpha.0

## 0.7.1

### Patch Changes

- 14c8f90: Hide ratio when some error occurs

## 0.7.1-alpha.0

### Patch Changes

- Hide ratio when some error occurs

## 0.7.0

### Minor Changes

- dc0fdaf: Add price change ratio tag
- 6206f2d: Fix price tag color
- a95ccaf: Fix negative ratio

## 0.7.0-alpha.2

### Minor Changes

- Fix negative ratio

## 0.7.0-alpha.1

### Minor Changes

- Fix price tag color

## 0.7.0-alpha.0

### Minor Changes

- Add price change ratio tag

## 0.6.1

### Patch Changes

- 39da38d: Fix meson amount limit & send button disable state

## 0.6.1-alpha.0

### Patch Changes

- b17ceba: Fix meson amount limit & send button disable state

## 0.6.0

### Patch Changes

- 8d94386: Clear input if timeout
- d5065a6: chore: Update confirmation popup amount styling
- de7cfe2: Fix the issue of to token cannot be selected after exchange chain
- 5abc2a3: Fix verification error on cBridge
- d7cc821: Use `chainId` + `tokenAddress` to get token price
- 9ca93e6: Modify polygon nativeCurrency
- d70611c: Fix issues
- 7c3a46e: use token price on ethereum if can not get the token price on specified chain
- e27a9ba: Use deBridge's own token symbol to prevent validation failures
- 3d74756: Fix could not jump to the app & toToken requiring two clicks on mobile
- 1543971: Filter the tokens whose price is 0
- 433337e: Fix distorted price info in token list
- 3a3a67f: Remove unused code
- 39051ef: Add timeout to meson api
- Updated dependencies [de7cfe2]
- Updated dependencies [5abc2a3]
- Updated dependencies [d7cc821]
- Updated dependencies [9ca93e6]
- Updated dependencies [7c3a46e]
- Updated dependencies [e27a9ba]
- Updated dependencies [3d74756]
- Updated dependencies [1543971]
- Updated dependencies [3a3a67f]
- Updated dependencies [39051ef]
  - @bnb-chain/canonical-bridge-sdk@0.5.0

## 0.6.0-alpha.25

### Patch Changes

- Use deBridge's own token symbol to prevent validation failures
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.17

## 0.6.0-alpha.24

### Patch Changes

- Modify polygon nativeCurrency
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.16

## 0.6.0-alpha.23

### Patch Changes

- Fix verification error on cBridge
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.15

## 0.6.0-alpha.22

### Patch Changes

- Fix could not jump to the app & toToken requiring two clicks on mobile
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.14

## 0.6.0-alpha.21

### Patch Changes

- Add timeout to meson api
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.13

## 0.6.0-alpha.20

### Patch Changes

- Clear input if timeout

## 0.6.0-alpha.19

### Patch Changes

- d70611c: Fix issues

## 0.6.0-alpha.18

### Patch Changes

- Filter the tokens whose price is 0
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.12

## 0.6.0-alpha.17

### Patch Changes

- use token price on ethereum if can not get the token price on specified chain
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.11

## 0.6.0-alpha.16

### Patch Changes

- Fix distorted price info in token list

## 0.6.0-alpha.15

### Patch Changes

- Fix the issue of to token cannot be selected after exchange chain
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.10

## 0.6.0-alpha.14

### Patch Changes

- Use `chainId` + `tokenAddress` to get token price
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.9

## 0.6.0-alpha.13

### Patch Changes

- d5065a6: chore: Update confirmation popup amount styling
- Remove unused code
- Updated dependencies
  - @bnb-chain/canonical-bridge-sdk@0.5.0-alpha.8

## 0.5.19-alpha.0

### Patch Changes

- chore: Update confirmation popup amount styling

## 0.5.19

### Patch Changes

- e57b843: fix: Fix to token display issue

## 0.5.18

### Patch Changes

- eb0917b: feat: Confirmation popup

## 0.5.17

### Patch Changes

- 2179e93: feat: Send confirm popup
- 7c2e201: Confirmation popup

## 0.5.17-alpha.0

### Patch Changes

- feat: Send confirm popup

## 0.5.16

### Patch Changes

- Use stargate & meson api to fetch chain & token config
- 2538636: Remove duplicated tokens for stargate
- 5d08223: Fix stargate fee display and handle api error
- c4f3ee7: Update token element's info
- 7caf17e: Fix meson token display symbol issue
- e19a76c: Fix tron does not display due to its id
- b930ad4: Add more token info to token element

## 0.5.16-alpha.5

### Patch Changes

- Fix tron does not display due to its id

## 0.5.16-alpha.4

### Patch Changes

- Fix meson token display symbol issue

## 0.5.16-alpha.3

### Patch Changes

- Remove duplicated tokens for stargate

## 0.5.16-alpha.2

### Patch Changes

- Update token element's info

## 0.5.16-alpha.1

### Patch Changes

- Use stargate & meson api to fetch chain & token config

## 0.5.16-alpha.0

### Patch Changes

- b930ad4: Add more token info to token element

## 0.5.15

### Patch Changes

- 0c42d50: Fix layerzero min amount decimal issue

## 0.5.14

### Patch Changes

- c245228: Add attribute `data-address` to all routes
- 0a61381: Use rpc in chainsConfig to get balance
- 2849332: Add more customizable configs
- 513791e: Keep the previous selected route after routes refreshing
- f9c82ec: Fixed an issue caused by sdk not building
- 0cf34de: Support custom toast for errors
- 513791e: Split `TransferWidget` into `BridgeTransfer` and `BridgeRoutes`
- 513791e: AlertIcon supports customize color
- 3f69a66: Add blocked rules to celer bridge
- fc7cd1c: Add to token address to route
- 0cf34de: Support custom toast for errors
- 0cf34de: Support custom toast for errors
- 513791e: Remove bridge bottom element if `routeContentBottom` not setted
- 99b14df: Support specific wallets to exclude unsupported chains

## 0.5.14-alpha.5

### Patch Changes

- Use rpc in chainsConfig to get balance

## 0.5.14-alpha.4

### Patch Changes

- Add blocked rules to celer bridge

## 0.5.14-alpha.3

### Patch Changes

- Add attribute `data-address` to all routes

## 0.5.14-alpha.2

### Patch Changes

- Fixed an issue caused by sdk not building

## 0.5.14-alpha.1

### Patch Changes

- Support specific wallets to exclude unsupported chains

## 0.5.14-alpha.0

### Patch Changes

- Add to token address to route

## 0.5.12-alpha.3

### Patch Changes

- Support custom toast for errors

## 0.5.12-alpha.2

### Patch Changes

- Support custom toast for errors

## 0.5.12-alpha.1

### Patch Changes

- Support custom toast for errors

## 0.5.12-alpha.0

### Patch Changes

- Keep the previous selected route after routes refreshing

## 0.5.10-alpha.4

### Patch Changes

- Remove bridge bottom element if `routeContentBottom` not setted

## 0.5.10-alpha.3

### Patch Changes

- Split `TransferWidget` into `BridgeTransfer` and `BridgeRoutes`

## 0.5.10-alpha.2

### Patch Changes

- 2849332: Add more customizable configs
- AlertIcon supports customize color

## 0.5.10-alpha.0

### Patch Changes

- Add more customizable configs

## 0.5.12

### Patch Changes

- 4992f44: Fixed the bridgedTokenGroup case issue

## 0.5.11

### Patch Changes

- c1aefab: Update meson validation

## 0.5.10

### Patch Changes

- 63c1a6a: Token transfer parameters validation

## 0.5.9

### Patch Changes

- 6e1cd4e: Use own token address for deBridge
- 1b33d4f: Fix from & to chain search

## 0.5.9-alpha.1

### Patch Changes

- Use own token address for deBridge

## 0.5.9-alpha.0

### Patch Changes

- Fix from & to chain search

## 0.5.8

### Patch Changes

- 49e31fc: Update token list sort rules
- f86dcd0: Show token address on `You Receive`
- f86dcd0: Support searching token by address
- f86dcd0: Show token address on `You Receive`

## 0.5.8-alpha.5

### Patch Changes

- Update token list sort rules

## 0.5.8-alpha.4

### Patch Changes

- Show token address on `You Receive`

## 0.5.8-alpha.3

### Patch Changes

- Show token address on `You Receive`

## 0.5.8-alpha.2

### Patch Changes

- Support searching token by address

## 0.5.8-alpha.1

### Patch Changes

- Show token address on `You Receive`
- Show token address on `You Receive`

## 0.5.8-alpha.0

### Patch Changes

- Show token address on `You Recivce`

## 0.5.7

### Patch Changes

- 034cc4f: Fix token balance issue
- 034cc4f: Add token address to token element

## 0.5.7-alpha.1

### Patch Changes

- Add token address to token element

## 0.5.7-alpha.0

### Patch Changes

- Fix token balance issue

## 0.5.6

### Patch Changes

- 601fb21: Show input error message when wallet is connected

## 0.5.5

### Patch Changes

- 792cae1: Check Layerzero destination gas limit

## 0.5.4

### Patch Changes

- 8d3b6d1: Support custom breakpoints
- b95b3ab: Fix wallet issues
- fb73ca4: Fix wallet issues
- da03355: Remove delayTime for wallet
- bcf65ef: Fix colorMode does not follow the parameter
- 6d78c07: Fix wallet issues
- 3146b01: Support custom connect wallet button
- dc0fcac: Show all tokens in token list with different token address
- cdf450d: Separate wallet component
- 0f6c74c: Add log for solana

## 0.5.4-alpha.4

### Patch Changes

- Fix colorMode does not follow the parameter

## 0.5.4-alpha.3

### Patch Changes

- Show all tokens in token list with different token address

## 0.5.4-alpha.2

### Patch Changes

- Support custom breakpoints

## 0.5.4-alpha.1

### Patch Changes

- Add log for solana

## 0.5.4-alpha.0

### Patch Changes

- Support custom connect wallet button

## 0.5.2

### Patch Changes

- Remove delayTime for wallet

## 0.5.2-alpha.3

### Patch Changes

- Fix wallet issues

## 0.5.2-alpha.2

### Patch Changes

- Fix wallet issues

## 0.5.2-alpha.1

### Patch Changes

- Fix wallet issues

## 0.5.2-alpha.0

### Patch Changes

- cdf450d: Separate wallet component

## 0.5.1

### Patch Changes

- 6a2623b: Solana requires wallet have at least 0.05SOL to enabled a tx.

## 0.5.0-alpha.4

### Patch Changes

- Solana requires wallet have at least 0.05SOL to enabled a tx.

## 0.5.0-alpha.3

### Patch Changes

- Fix phantom wallet deelink issue on mobile

## 0.5.0

### Minor Changes

- a6db440: Support solana

### Patch Changes

- e31ab8f: UI adjustment

## 0.5.0-alpha.2

### Patch Changes

- UI adjustment

## 0.5.0-alpha.1

### Patch Changes

- UI adjustment

## 0.5.0-alpha.0

### Minor Changes

- Support solana

## 0.4.0

### Minor Changes

- a33ae70: Support more Meson chains and tokens

## 0.3.3

### Patch Changes

- 96adcfc: Update cicd
- a7b6b66: Update spacing
- 44089a0: Update spacing & Icon id ssr

## 0.3.3-alpha.1

### Patch Changes

- Update spacing

## 0.3.3-alpha.0

### Patch Changes

- Update spacing & Icon id ssr

## 0.3.2

### Patch Changes

- 743e39d: Fix Cbridge send minmax multi call
- c80c95e: Update widget ui
- c80c95e: Update widget ui
- c80c95e: Update widget ui
- c80c95e: Update widget ui
- c80c95e: Update widget ui
- c39d53e: Test cicd
- cf6063a: Fix switch to ethereum token
- c80c95e: Update widget ui
- 8dc4f60: Fix input and checkbox style
- c80c95e: Update widget
- c80c95e: Update widget ui
- 8b2bcfe: Fix svg icon mask duplicate id
- 66ec1c0: Update unknown network title
- d2c4330: Some ui updates & Header chain switch update
- c80c95e: Update widget ui
- ee4e63e: Resolve multi loadingFee requst
- 0473c82: Update widget ui
- c80c95e: Update widget ui
- 3f1f337: Update icon element id
- Update ui
- c80c95e: Update widget ui
- c80c95e: Update widge ui
- aed642a: Update widget ui
- c80c95e: Update widget ui
- c80c95e: Update widget ui
- c80c95e: Update widget ui
- c80c95e: Update widget ui
- c80c95e: Update widget ui

## 0.3.2-alpha.25

### Patch Changes

- Update icon element id

## 0.3.2-alpha.24

### Patch Changes

- Fix svg icon mask duplicate id

## 0.3.2-alpha.23

### Patch Changes

- Update widget ui

## 0.3.2-alpha.22

### Patch Changes

- Fix Cbridge send minmax multi call

## 0.3.2-alpha.21

### Patch Changes

- Resolve multi loadingFee requst

## 0.3.2-alpha.20

### Patch Changes

- Fix switch to ethereum token

## 0.3.2-alpha.19

### Patch Changes

- Update widget ui

## 0.3.2-alpha.18

### Patch Changes

- Update widget

## 0.3.2-alpha.17

### Patch Changes

- Update widget ui

## 0.3.2-alpha.16

### Patch Changes

- Update widge ui

## 0.3.2-alpha.15

### Patch Changes

- Update widget ui

## 0.3.2-alpha.14

### Patch Changes

- Update widget ui

## 0.3.2-alpha.13

### Patch Changes

- Update widget ui

## 0.3.2-alpha.12

### Patch Changes

- Update widget ui

## 0.3.2-alpha.11

### Patch Changes

- Update widget ui

## 0.3.2-alpha.10

### Patch Changes

- Update widget ui

## 0.3.2-alpha.9

### Patch Changes

- Update widget ui

## 0.3.2-alpha.8

### Patch Changes

- Update widget ui

## 0.3.2-alpha.7

### Patch Changes

- Update widget ui

## 0.3.2-alpha.6

### Patch Changes

- Update widget ui

## 0.3.2-alpha.5

### Patch Changes

- Update widget ui

## 0.3.2-alpha.4

### Patch Changes

- Update widget ui

## 0.3.2-alpha.3

### Patch Changes

- Update widget ui

## 0.3.2-alpha.2

### Patch Changes

- Update widget ui

## 0.3.2-alpha.1

### Patch Changes

- Fix input and checkbox style

## 0.3.2-alpha.0

### Patch Changes

- Update ui

## 0.3.1

### Patch Changes

- bdf228d: Test cicd

## 0.3.0

### Minor Changes

- f0ce0fd: Support tron

### Patch Changes

- 8908e36: Fix input styling

## 0.2.1-alpha.0

### Patch Changes

- Fix input styling

## 0.2.0

### Minor Changes

- 29d5a31: Support tron

## 0.2.0-alpha.4

### Patch Changes

- Only show supported networks in status popup

## 0.2.0-alpha.3

### Patch Changes

- Only show supported networks in status popup

## 0.2.0-alpha.2

### Patch Changes

- 8218b07: Add tips for switching network in tronLink

## 0.2.0-alpha.1

### Patch Changes

- Support switch network for tron & fix issues

## 0.2.0-alpha.0

### Minor Changes

- Support tron

## 0.1.2

### Patch Changes

- 982fc93: Clean up the code and add the README

## 0.1.1

### Patch Changes

- 75d930b: Clean up the code and add the README
