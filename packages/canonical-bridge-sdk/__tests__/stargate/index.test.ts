import { createPublicClient, defineChain, http } from 'viem';
import { Stargate } from '../../src/stargate';

describe('Meson SDK validation', () => {
  let bridge: Stargate;

  beforeEach(() => {
    bridge = new Stargate({
      endpoint: 'http://localhost:3000',
      timeout: 5000,
      bridgeType: 'stargate',
    });
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

  const arbitrum = {
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
        address: '0xca11bde05977b3631167028862be2a173976ca11' as `0x${string}`,
        blockCreated: 7654707,
      },
    },
  };
  const fromViemClient = createPublicClient({
    chain: bsc,
    transport: http(),
  });
  const toViemClient = createPublicClient({
    chain: arbitrum,
    transport: http(),
  });

  it('Test 1: Stargate validation with wrong from chain id', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 111,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 2: Stargate validation with wrong from token address', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B31979xx',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 3: Stargate validation with from token decimals', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 10,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 4: Stargate validation with wrong from bridge address', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBcQd',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 5: Stargate validation with wrong to chain id', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 155,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 6: Stargate validation with wrong to token address', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcb11',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 7: Stargate validation with wrong to bridge address', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7cc',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 8: Stargate validation with wrong to token symbol', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'ATP',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 9: Stargate validation with wrong to decimal', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 12,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 10: Stargate validation with invalid amount', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: -500,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 11: Stargate validation with wrong destination endpoint id', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30111,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(false);
  });

  it('Test 12: Stargate validation with correct information', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint: 'https://mainnet.stargate-api.com/v1/wrongendpoint',
      })
    ).toBe(false);
  });

  it('Test 13: Stargate validation with correct information', async () => {
    expect(
      await bridge.validateStargateToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
        toChainId: 42161,
        toTokenAddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        toBridgeAddress: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
        toTokenSymbol: 'USDT',
        toTokenDecimals: 6,
        amount: 15,
        toPublicClient: toViemClient,
        fromPublicClient: fromViemClient,
        dstEndpointId: 30110,
        stargateEndpoint:
          'https://mainnet.stargate-api.com/v1/metadata?version=v2',
      })
    ).toBe(true);
  });
});
