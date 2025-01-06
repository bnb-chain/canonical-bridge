import {
  CanonicalBridgeProvider,
  BridgeTransfer,
  BridgeRoutes,
  ICustomizedBridgeConfig,
} from '@bnb-chain/canonical-bridge-widget';
import { useEffect, useMemo, useState } from 'react';

import { useTransferConfig } from '@/token-config/mainnet/useTransferConfig';
import { chains } from '@/token-config/mainnet/chains';
import { env } from '@/core/env';
import { useWalletModal } from '@/core/wallet/hooks/useWalletModal';
import { WalletProvider } from '@/core/wallet/WalletProvider';
import { Layout } from '@/core/components/Layout';
import { light } from '@/core/theme/light';
import { dark } from '@/core/theme/dark';

export default function MainnetPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <WalletProvider chainConfigs={chains}>
      <BridgeWidget />
    </WalletProvider>
  );
}

function BridgeWidget() {
  const transferConfig = useTransferConfig();
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
