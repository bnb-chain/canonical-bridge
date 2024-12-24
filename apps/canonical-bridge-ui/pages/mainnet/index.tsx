import {
  CanonicalBridgeProvider,
  ICanonicalBridgeConfig,
  BridgeTransfer,
  BridgeRoutes,
} from '@bnb-chain/canonical-bridge-widget';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { useTransferConfig } from '@/token-config/mainnet/useTransferConfig';
import { chains } from '@/token-config/mainnet/chains';
import { env } from '@/core/env';
import { dark } from '@/core/theme/dark';
import { light } from '@/core/theme/light';
import { useWalletModal } from '@/core/wallet/hooks/useWalletModal';
import { WalletProvider } from '@/core/wallet/WalletProvider';
import { Layout } from '@/core/components/Layout';

const unsupportedChainsInWallets = [
  {
    wallets: ['BinanceW3WSDK', 'binanceWeb3Wallet'],
    chains: [1101],
  },
];

export const bridgeConfig: ICanonicalBridgeConfig = {
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

  const { connector } = useAccount();
  const supportedChains = useMemo(() => {
    return chains.filter((e) => {
      if (connector) {
        const unsupportedChains = unsupportedChainsInWallets.find((e) =>
          e.wallets.includes(connector.id),
        )?.chains;
        return !unsupportedChains?.includes(e.id);
      }
      return true;
    });
  }, [connector]);

  return (
    <CanonicalBridgeProvider
      config={bridgeConfig}
      transferConfig={transferConfig}
      chains={supportedChains}
      onClickConnectWalletButton={onOpen}
    >
      <Layout>
        <BridgeTransfer />
        <BridgeRoutes />
      </Layout>
    </CanonicalBridgeProvider>
  );
}
