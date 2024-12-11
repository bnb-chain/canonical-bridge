import { CBridge } from '../../src/cbridge';

describe('cBridge', () => {
  let bridge: CBridge;

  beforeEach(() => {
    bridge = new CBridge({
      endpoint: 'http://localhost:3000',
      timeout: 30 * 1000,
      bridgeType: 'cBridge',
    });
  });
  // === pegged transfer test ===
  it('Test 1: cBridge validation with wrong bridge address', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x89b8AA89FDd0507a99d334CBe3C808fAFC7d850E', // wrong address
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 2: cBridge validation with wrong from token decimals', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        fromTokenDecimals: 12,
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 3: cBridge validation with wrong from token symbol', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AIX',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 4: cBridge validation with wrong from token address', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C1ddd',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 5: cBridge validation with wrong from chain id', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 121,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 6: cBridge validation with wrong to token address', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd980d',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 7: cBridge validation with wrong to token symbol', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AIY',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 8: cBridge validation with wrong to token decimal', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 10,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 9: cBridge validation with wrong to chain id', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 125,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 10: cBridge validation with wrong API endpoint', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint: 'https://cbridge-prod2.celer.app/v2/wrongEndpoint',
      })
    ).toBe(false);
  });

  it('Test 11: cBridge validation with wrong amount', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: -2,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 12: cBridge validation with wrong pegged setting', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  // Correct bridge and contract information
  it('Test 13: cBridge validation with correct information', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: true,
        fromChainId: 56,
        fromTokenAddress: '0xA9b038285F43cD6fE9E16B4C80B4B9bCcd3C161b',
        fromTokenSymbol: 'AI',
        bridgeAddress: '0x11a0c9270D88C99e221360BCA50c2f6Fda44A980',
        toChainId: 42161,
        toTokenAddress: '0x8d7c2588c365b9e98Ea464b63DBCCDf13ECd9809',
        toTokenSymbol: 'AI',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 18,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(true);
  });

  // === pool base transfer test ===
  it('Test 14: cBridge pool based validation with correct information', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
        toChainId: 137,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        toTokenSymbol: 'USDT',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 6,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(true);
  });

  it('Test 15: cBridge pool based validation with from chain id', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 10,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
        toChainId: 137,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        toTokenSymbol: 'USDT',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 6,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 16: cBridge pool based validation with form token address', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B31979xx',
        fromTokenSymbol: 'USDT',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
        toChainId: 137,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        toTokenSymbol: 'USDT',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 6,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 17: cBridge pool based validation with wrong from token symbol', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDC',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
        toChainId: 137,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        toTokenSymbol: 'USDT',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 6,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 18: cBridge pool based validation with wrong bridge address', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1xx',
        toChainId: 137,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        toTokenSymbol: 'USDT',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 6,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 19: cBridge pool based validation with wrong to chain id', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
        toChainId: 10,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        toTokenSymbol: 'USDT',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 6,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 20: cBridge pool based validation with wrong to token address', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
        toChainId: 137,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58exx',
        toTokenSymbol: 'USDT',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 6,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 21: cBridge pool based validation with to token symbol', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
        toChainId: 137,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        toTokenSymbol: 'USDC',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 6,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 22: cBridge pool based validation with wrong from token decimal', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
        toChainId: 137,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        toTokenSymbol: 'USDT',
        amount: 20.1,
        fromTokenDecimals: 10,
        toTokenDecimals: 6,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });

  it('Test 23: cBridge pool based validation with to token decimal', async () => {
    expect(
      await bridge.validateCBridgeToken({
        isPegged: false,
        fromChainId: 56,
        fromTokenAddress: '0x55d398326f99059fF775485246999027B3197955',
        fromTokenSymbol: 'USDT',
        bridgeAddress: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
        toChainId: 137,
        toTokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        toTokenSymbol: 'USDT',
        amount: 20.1,
        fromTokenDecimals: 18,
        toTokenDecimals: 10,
        cBridgeEndpoint:
          'https://cbridge-prod2.celer.app/v2/getTransferConfigsForAll',
      })
    ).toBe(false);
  });
});
