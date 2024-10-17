import { CanonicalBridgeProvider, TransferWidget } from '@bnb-chain/canonical-bridge-widget';

import { useTransferConfig } from '@/data';
import { chains } from '@/data/chains';
import { bridgeConfig } from '@/core/config';
import { Layout } from '@/core/components/Layout';

export default function MainnetPage() {
  const transferConfig = useTransferConfig();

  return (
    <CanonicalBridgeProvider config={bridgeConfig} transferConfig={transferConfig} chains={chains}>
      <Layout>
        <TransferWidget />
      </Layout>
    </CanonicalBridgeProvider>
  );
}
