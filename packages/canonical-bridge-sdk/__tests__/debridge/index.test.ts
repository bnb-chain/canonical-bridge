// import { CBridge } from '../../src/cbridge';
import { DeBridge } from '../../src/debridge';

describe('deBridge test cases', () => {
  let bridge: DeBridge;

  beforeEach(() => {
    bridge = new DeBridge({
      endpoint: 'http://localhost:3000',
      statsEndpoint: 'http://localhost:3000',
      timeout: 5 * 1000,
    });
  });

  it('Test 1: deBridge validation with wrong from chain id', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 10,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 2: deBridge validation with wrong chain type', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'solana',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 3: deBridge validation with wrong from token symbol', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'PEPE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 4: deBridge validation with wrong from token address', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81cexx',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 5: deBridge validation with wrong from token decimals', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 10,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 6: deBridge validation with non-evm from bridge address', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: 'TTb3A6ASFejJuGcM1UVcRCJA23WGiJKSiY',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 7: deBridge validation with wrong to chain id', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 11111,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 8: deBridge validation with wrong to chain type', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'salana',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 9: deBridge validation with wrong to token symbol', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'MEW',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 10: deBridge validation with wrong token address', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1baQQ',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 11: deBridge validation with wrong to token decimals', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 11,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 12: deBridge validation with invalid amount', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: -100,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(false);
  });

  it('Test 13: deBridge validation with invalid API endpoint', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/wrongEndpoint',
      })
    ).toBe(false);
  });

  it('Test 14: deBridge validation with correct information', async () => {
    expect(
      await bridge.validateDeBridgeToken({
        fromChainId: 56,
        fromChainType: 'evm',
        fromTokenSymbol: 'CAKE',
        fromTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        fromTokenDecimals: 18,
        fromBridgeAddress: '0x663DC15D3C1aC63ff12E45Ab68FeA3F0a883C251',
        toChainId: 42161,
        toChainType: 'evm',
        toTokenSymbol: 'CAKE',
        toTokenAddress: '0x1b896893dfc86bb67cf57767298b9073d2c1ba2c',
        toTokenDecimals: 18,
        amount: 1,
        deBridgeEndpoint: 'https://deswap.debridge.finance/v1.0',
      })
    ).toBe(true);
  });
});
