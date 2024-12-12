import { createPublicClient, defineChain, http } from 'viem';
import { LayerZero } from '../../src/layerZero';

describe('LayerZero test cases', () => {
  let bridge: LayerZero;

  beforeEach(() => {
    bridge = new LayerZero();
  });

  const bsc = defineChain({
    id: 56,
    name: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://bsc-dataseed.bnbchain.org'],
      },
      public: {
        http: ['https://bsc-dataseed.bnbchain.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'bscscan',
        url: 'https://bscscan.com',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 15921452,
      },
    },
  });

  const arbitrum = defineChain({
    id: 42161,
    name: 'Arbitrum One',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://arb1.arbitrum.io/rpc'],
      },
      public: {
        http: ['https://arb1.arbitrum.io/rpc'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Arbiscan',
        url: 'https://arbiscan.io',
      },
    },
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 7654707,
      },
    },
  });

  const fromViemClient = createPublicClient({
    chain: bsc,
    transport: http(),
  });
  const toViemClient = createPublicClient({
    chain: arbitrum,
    transport: http(),
  });

  it('Test 1: LayerZero validation with invalid from token address', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81cexx',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 18,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 18,
        dstEndpoint: 110,
        amount: 1,
      })
    ).toBe(false);
  });

  it('Test 2: LayerZero validation with wrong bridge address', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a80x4',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 18,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 18,
        dstEndpoint: 110,
        amount: 1,
      })
    ).toBe(false);
  });

  it('Test 3: LayerZero validation with wrong from token symbol', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'LOL',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 18,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 18,
        dstEndpoint: 110,
        amount: 1,
      })
    ).toBe(false);
  });

  it('Test 4: LayerZero sendToken with invalid to token address', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bAxx',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 18,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 18,
        dstEndpoint: 110,
        amount: 1,
      })
    ).toBe(false);
  });

  it('Test 5: LayerZero sendToken with wrong to bridge address', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bAxx',
        fromTokenDecimals: 18,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 18,
        dstEndpoint: 110,
        amount: 1,
      })
    ).toBe(false);
  });

  it('Test 6: LayerZero sendToken with invalid destination endpoint', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 18,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 18,
        dstEndpoint: 202,
        amount: 1,
      })
    ).toBe(false);
  });

  it('Test 7: LayerZero sendToken with invalid amount', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 18,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 18,
        dstEndpoint: 110,
        amount: -100,
      })
    ).toBe(false);
  });

  it('Test 8: LayerZero sendToken with correct information', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 18,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 18,
        dstEndpoint: 110,
        amount: 1,
      })
    ).toBe(true);
  });

  it('Test 9: LayerZero sendToken with wrong from token decimals', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 10,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 18,
        dstEndpoint: 110,
        amount: 1,
      })
    ).toBe(false);
  });

  it('Test 10: LayerZero sendToken with wrong to token symbol', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 18,
        toTokenSymbol: 'ADA',
        toTokenDecimals: 18,
        dstEndpoint: 110,
        amount: 1,
      })
    ).toBe(false);
  });

  it('Test 11: LayerZero sendToken with wrong to token decimals', async () => {
    expect(
      await bridge.validateLayerZeroToken({
        fromPublicClient: fromViemClient,
        toPublicClient: toViemClient,
        bridgeAddress: '0xb274202daBA6AE180c665B4fbE59857b7c3a8091',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        toBridgeAddress: '0x1b896893dfc86bb67Cf57767298b9073D2c1bA2c',
        fromTokenDecimals: 18,
        toTokenSymbol: 'CAKE',
        toTokenDecimals: 10,
        dstEndpoint: 110,
        amount: 1,
      })
    ).toBe(false);
  });
});
