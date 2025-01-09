import {
  CanonicalBridgeProvider,
  BridgeTransfer,
  BridgeRoutes,
  ICustomizedBridgeConfig,
} from '@bnb-chain/canonical-bridge-widget';
import { useMemo } from 'react';

import { chains } from '@/token-config/mainnet/chains';
import { env } from '@/core/env';
import { useWalletModal } from '@/core/wallet/hooks/useWalletModal';
import { WalletProvider } from '@/core/wallet/WalletProvider';
import { Layout } from '@/core/components/Layout';
import { useTestnetTransferConfig } from '@/token-config/testnet/useTestnetTransferConfig';
import { light } from '@/core/theme/light';
import { dark } from '@/core/theme/dark';

export default function MainnetPage() {
  return (
    <WalletProvider chainConfigs={chains}>
      <BridgeWidget />
    </WalletProvider>
  );
}

function BridgeWidget() {
  const transferConfig = useTestnetTransferConfig();
  const { onOpen } = useWalletModal();

  const config: ICustomizedBridgeConfig = useMemo(
    () => ({
      theme: {
        colorMode: 'dark',
        colors: {
          light,
          dark,
        },
      },
      http: {
        serverEndpoint: env.SERVER_ENDPOINT,
        mesonEndpoint: 'https://testnet-relayer.meson.fi/api/v1',
      },
      transfer: transferConfig,
      onClickConnectWalletButton: onOpen,
    }),
    [onOpen, transferConfig],
  );

  return (
    <CanonicalBridgeProvider config={config}>
      <Layout>
        <BridgeTransfer />
        <BridgeRoutes />
      </Layout>
    </CanonicalBridgeProvider>
  );
}
