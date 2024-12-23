import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
  BridgeTransfer,
  BridgeRoutes,
} from '@bnb-chain/canonical-bridge-widget';

import { useTestnetTransferConfig } from '@/token-config/testnet/useTestnetTransferConfig';
import { testnetChains } from '@/token-config/testnet/testnetChains';
import { dark } from '@/core/theme/dark';
import { light } from '@/core/theme/light';
import { env } from '@/core/env';
import { WalletProvider } from '@/core/wallet/WalletProvider';
import { useWalletModal } from '@/core/wallet/hooks/useWalletModal';
import { Layout } from '@/core/components/Layout';

export const bridgeConfig: ICanonicalBridgeConfig = {
  appName: env.APP_NAME,
  assetPrefix: env.ASSET_PREFIX,
  appearance: {
    bridgeTitle: 'BNB Chain Cross-Chain Bridge Testnet',
    theme: {
      dark: dark,
      light: light,
    },
  },
  http: {
    refetchingInterval: 30 * 1000, // 30s
    apiTimeOut: 60 * 1000, // 60s
    deBridgeAccessToken: '',
    serverEndpoint: env.SERVER_ENDPOINT,
    mesonEndpoint: 'https://testnet-relayer.meson.fi/api/v1',
  },
};

export default function TestnetPage() {
  return (
    <WalletProvider chainConfigs={testnetChains}>
      <BridgeWidget />
    </WalletProvider>
  );
}

function BridgeWidget() {
  const testnetTransferConfig = useTestnetTransferConfig();
  const { onOpen } = useWalletModal();

  return (
    <CanonicalBridgeProvider
      config={bridgeConfig}
      transferConfig={testnetTransferConfig}
      chains={testnetChains}
      onClickConnectWalletButton={onOpen}
    >
      <Layout>
        <BridgeTransfer />
        <BridgeRoutes />
      </Layout>
    </CanonicalBridgeProvider>
  );
}
