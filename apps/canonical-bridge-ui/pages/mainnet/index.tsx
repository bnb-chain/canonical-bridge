import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
  TransferWidget,
} from '@bnb-chain/canonical-bridge-widget';

import { useTransferConfig } from '@/token-config/mainnet/useTransferConfig';
import { chains } from '@/token-config/mainnet/chains';
import { env } from '@/core/env';
import { dark } from '@/core/theme/dark';
import { light } from '@/core/theme/light';
import { useWalletModal } from '@/core/wallet/hooks/useWalletModal';
import { WalletProvider } from '@/core/wallet/WalletProvider';
import { Layout } from '@/core/components/Layout';

export const bridgeConfig: ICanonicalBridgeConfig = {
  appName: env.APP_NAME,
  assetPrefix: env.ASSET_PREFIX,
  appearance: {
    bridgeTitle: 'BNB Chain Cross-Chain Bridge',
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
  },
};

export default function MainnetPage() {
  return (
    <WalletProvider chainConfigs={chains}>
      <BridgeWidget />
    </WalletProvider>
  );
}

function BridgeWidget() {
  const transferConfig = useTransferConfig();
  const { onOpen } = useWalletModal();

  return (
    <CanonicalBridgeProvider
      config={bridgeConfig}
      transferConfig={transferConfig}
      chains={chains}
      onClickConnectWalletButton={onOpen}
    >
      <Layout>
        <TransferWidget />
      </Layout>
    </CanonicalBridgeProvider>
  );
}
