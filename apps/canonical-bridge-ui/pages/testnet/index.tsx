import { CanonicalBridgeProvider, TransferWidget } from '@bnb-chain/canonical-bridge-widget';

import { bridgeConfig } from '@/core/config';
import { useTestnetTransferConfig } from '@/data-testnet';
import { testnetChains } from '@/data-testnet/testnetChains';
import { Layout } from '@/core/components/Layout';

export default function MainnetPage() {
  const testnetTransferConfig = useTestnetTransferConfig();

  return (
    <CanonicalBridgeProvider
      config={bridgeConfig}
      transferConfig={testnetTransferConfig}
      chains={testnetChains}
    >
      <Layout>
        <TransferWidget />
      </Layout>
    </CanonicalBridgeProvider>
  );
}
