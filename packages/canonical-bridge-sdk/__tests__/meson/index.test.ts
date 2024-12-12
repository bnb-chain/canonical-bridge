import { Meson } from '../../src/meson';

describe('Meson SDK validation', () => {
  let bridge: Meson;

  beforeEach(() => {
    bridge = new Meson({
      endpoint: 'http://localhost:3000',
      timeout: 5000,
      bridgeType: 'meson',
    });
  });

  it('Test 1: Meson validation with wrong from chain id', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 10,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 2: Meson validation with wrong from token address', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197950',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 3: Meson validation with invalid from token symbol', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'ppz',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 4: Meson validation with wrong from token decimal', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 10,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 5: Meson validation with wrong from chain type', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'tron',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 6: Meson validation with wrong to chain id', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 40,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 7: Meson validation with to token address', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbxQ',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 8: Meson validation with wrong to token decimal', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 10,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 9: Meson validation with wrong to chain type', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'solana',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 10: Meson validation with invalid to token symbol', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'rpg',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 11: Meson validation with invalid amount', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: -500,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(false);
  });

  it('Test 12: Meson validation with invalid API endpoint', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/wrongEndpoint',
      })
    ).toBe(false);
  });

  it('Test 13: Meson validation with correct information', async () => {
    expect(
      await bridge.validateMesonToken({
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainId: 42161,
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        mesonEndpoint: 'https://relayer.meson.fi/api/v1',
      })
    ).toBe(true);
  });
});
