import { Mayan } from '../../src/adapters/mayan';

describe('mayan SDK validation', () => {
  let bridge: Mayan;

  beforeEach(() => {
    bridge = new Mayan({
      endpoint: 'https://price-api.mayan.finance/v3',
      timeout: 5000,
      bridgeType: 'mayan',
    });
  });

  it('Test 1: mayan validation with wrong from chain id', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'optimism',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 2: mayan validation with wrong from token address', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197950',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 3: mayan validation with invalid from token symbol', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'ppz',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 4: mayan validation with wrong from token decimal', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 10,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 5: mayan validation with wrong from chain type', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'tron',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 6: mayan validation with wrong to chain id', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
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
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 7: mayan validation with to token address', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbxQ',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 8: mayan validation with wrong to token decimal', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 10,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 9: mayan validation with wrong to chain type', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'solana',
        toTokenSymbol: 'usdt',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 10: mayan validation with invalid to token symbol', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'rpg',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 11: mayan validation with invalid amount', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'usdt',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'usdt',
        amount: -500,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(false);
  });

  it('Test 12: mayan validation with correct information', async () => {
    expect(
      await bridge.validateMayanToken({
        fromChainNameId: 'bsc',
        fromTokenAddress: '0x55d398326f99059ff775485246999027b3197955',
        fromTokenSymbol: 'USDT',
        fromTokenDecimals: 18,
        fromChainType: 'evm',
        toChainNameId: 'arbitrum',
        toTokenAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        toTokenDecimals: 6,
        toChainType: 'evm',
        toTokenSymbol: 'USDT',
        amount: 5,
        fromBridgeAddress: '0x337685fdaB40D39bd02028545a4FfA7D287cC3E2',
      })
    ).toBe(true);
  });

});
