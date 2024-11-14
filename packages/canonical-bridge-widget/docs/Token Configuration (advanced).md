Token configuration is the advanced setting to show tokens, network and routes. You can enable
particular routes, tokens and network in the following settings.

## defaultSelectedInfo

default selected token symbol, source and destination network and default send token amount.

```javascript
defaultSelectedInfo: {
   fromChainId: 1,
   toChainId: 56,
   tokenSymbol: 'USDT',
   amount: '20', // 20 USDT
 },
```

1. fromChainId: Default source chain id. 1 represents Ethereum:

2. toChainId:Default selected destination chain Id. 56 represents BNB Smart Chain

3. tokenSymbol: Default selected token symbol

4. amount: default transfer amount. 20 for 20 USDT.

## Order

token and network ordering

```javascript
order: {
   chains: [56, 204, 1], // network sorting list
   tokens: ['USDC','USDT','FDUSD','USDC.e','ETH'], // token sorting list
}
```

## displayTokenSymbols

Set token symbol for particular address on selected chain. The below example sets symbol of
0x2170Ed0880ac9A755fd29B2688956BD959F933F8 as ETH on BNB Smart Chain

```javascript
displayTokenSymbols: { 56: { // Network id '0x2170Ed0880ac9A755fd29B2688956BD959F933F8': 'ETH',
} }
```

## Route configuration

The route configuration is the place to setup supported tokens on route. It is able to hide
particular tokens and chains. For some cases, token may have different symbols in different network,
bridgedTokenGroups allows tokens with different symbols to be transferred. The following example is
for deBridge route.

```javascript
// deBridge example
deBridge: {
  config: deBridgeConfig, // config from API
  exclude: {
    chains: [204], // hide opBNB
    tokens: {
      1: ['cUSDCv3'], // hide cUSDCv3 on Ethereum
      56: [
        '0x67d66e8ec1fd25d98b3ccd3b19b7dc4b4b7fc493',
        '0x0000000000000000000000000000000000000000',
      ],
      137: ['cUSDCv3'],
    },
  },
  bridgedTokenGroups: [
    ['USDT', 'USDT.e'],
    ['USDC', 'USDC.e'],
    ['WETH', 'WETH.e'],
  ],
},
```

1. config :This is the place to setup supported token for particular route. Please check demo and
   Custom Route (advanced) for more information.

2. exclude : Hide networks or tokens on particular network. Token value could be token symbol or
   token address.

3. bridgedTokenGroups :By default, only tokens with the same symbol could be transferred across
   different networks. Token groups setting allows tokens with different symbols to be transferred.
