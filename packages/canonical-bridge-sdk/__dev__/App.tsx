import '@node-real/walletkit/styles.css';

import {
  WalletKitProvider,
  ConnectModal,
  WalletKitConfig,
  useConnectModal,
} from '@node-real/walletkit';
import { trustWallet, metaMask, walletConnect } from '@node-real/walletkit/evm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccount, useDisconnect } from 'wagmi';
import { chains } from './chains';

import {
  CanonicalBridgeSDK,
  cBridgeConfig,
  deBridgeConfig,
  stargateConfig,
  NativeCurrency,
} from '@/index';
import { ChainConfig } from './types';

function getEvmChains(chainConfigs: ChainConfig[]) {
  return chainConfigs
    ?.filter((item) => item.chainType === 'evm')
    .map((item) => ({
      id: item.id,
      name: item.name,
      nativeCurrency: item.nativeCurrency,
      rpcUrls: {
        default: {
          http: [item.rpcUrl],
        },
        public: {
          http: [item.rpcUrl],
        },
      },
      blockExplorers: {
        default: {
          name: item.explorer.name,
          url: item.explorer.url,
        },
      },
    }));
}

const config: WalletKitConfig = {
  walletConfig: {
    autoConnect: true,
    metadata: {
      name: 'canonical bridge sdk',
    },
    evmConfig: {
      wallets: [metaMask(), trustWallet(), walletConnect()],
      chains: getEvmChains(chains),
    },
  },
  appearance: {
    mode: 'light',
    useGridLayoutOnMobile: false,
    gridLayoutThreshold: 10,
  },
};

const queryClient = new QueryClient();

export default function App() {
  return (
    <WalletKitProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectButton />
        <ConnectModal />
        <Example />
      </QueryClientProvider>
    </WalletKitProvider>
  );
}

function ConnectButton() {
  const { onOpen } = useConnectModal();
  const { address, chainId } = useAccount();
  const { disconnect } = useDisconnect();

  if (address) {
    return (
      <>
        <div>address: {address}</div>
        <div>chainId: {chainId}</div>
        <button onClick={() => disconnect()}>disconnect</button>
      </>
    );
  }

  return <button onClick={() => onOpen()}>connect wallet</button>;
}

function Example() {
  const bridgeSDK = new CanonicalBridgeSDK({
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

  return null;
}
