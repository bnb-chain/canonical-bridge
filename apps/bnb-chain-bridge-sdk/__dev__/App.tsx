import {
  BridgeSDK,
  cBridgeConfig,
  deBridgeConfig,
  stargateConfig,
} from '@/index';

// Test
export default function App() {
  const bridgeSDK = new BridgeSDK({
    bridgeConfigs: [
      cBridgeConfig({
        endpoint: 'https://cbridge-prod2.celer.app',
      }),
      deBridgeConfig({
        endpoint: 'https://deswap.debridge.finance/v1.0',
        statsEndpoint: 'https://stats-api.dln.trade/api',
      }),
      stargateConfig({
        endpoint:
          'https://mainnet.stargate-api.com/v1/buses/bus-drive-settings',
      }),
    ],
  });

  console.log(bridgeSDK);

  return null;
}
