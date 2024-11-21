import { ConnectButton } from '@bnb-chain/canonical-bridge-widget';
import { useWalletKit } from '@node-real/walletkit';
import { SolanaWallet, useSolanaWallet } from '@node-real/walletkit/solana';
import { TronWallet, useTronWallet } from '@node-real/walletkit/tron';
import { useAccount } from 'wagmi';

import { MetaMaskIcon } from '@/core/components/icons/MetaMaskIcon';
import { TrustWalletIcon } from '@/core/components/icons/TrustWalletIcon';
import { CoinbaseWalletIcon } from '@/core/components/icons/CoinbaseWalletIcon';
import { MathWalletIcon } from '@/core/components/icons/MathWalletIcon';
import { BinanceWeb3WalletIcon } from '@/core/components/icons/BinanceWeb3WalletIcon';
import { OkxWalletIcon } from '@/core/components/icons/OkxWalletIcon';
import { TokenPocketIcon } from '@/core/components/icons/TokenPocketIcon';
import { WalletConnectIcon } from '@/core/components/icons/WalletConnectIcon';
import { PhantomIcon } from '@/core/components/icons/PhantomIcon';
import { TronLinkIcon } from '@/core/components/icons/TronLinkIcon';

const walletIcons: Record<string, React.ReactNode> = {
  binanceWeb3Wallet: <BinanceWeb3WalletIcon />,
  coinbaseWallet: <CoinbaseWalletIcon />,
  mathWallet: <MathWalletIcon />,
  metaMask: <MetaMaskIcon />,
  okxWallet: <OkxWalletIcon />,
  tokenPocket: <TokenPocketIcon />,
  trust: <TrustWalletIcon />,
  walletConnect: <WalletConnectIcon />,
  'solana:trust': <TrustWalletIcon />,
  'solana:phantom': <PhantomIcon />,
  'tron:tronLink': <TronLinkIcon />,
};

export function ConnectWalletButton() {
  const evmWalletIcon = useEvmWalletIcon();
  const tronWalletIcon = useTronWalletIcon();
  const solanaWalletIcon = useSolanaWalletIcon();

  return (
    <ConnectButton
      connectedWalletIcons={[
        {
          walletType: 'evm',
          icon: evmWalletIcon,
        },
        {
          walletType: 'tron',
          icon: tronWalletIcon,
        },
        {
          walletType: 'solana',
          icon: solanaWalletIcon,
        },
      ]}
    />
  );
}

function useEvmWalletIcon() {
  const { connector } = useAccount();
  return connector?.id ? walletIcons[connector.id] : null;
}

function useTronWalletIcon() {
  const { tronConfig } = useWalletKit();
  const { wallet } = useTronWallet();

  const target = (tronConfig?.wallets as TronWallet[])?.find(
    (item) => item.adapterName === wallet?.adapter.name,
  );

  return target?.id ? walletIcons[target.id] : null;
}

function useSolanaWalletIcon() {
  const { solanaConfig } = useWalletKit();
  const { wallet } = useSolanaWallet();

  const target = (solanaConfig?.wallets as SolanaWallet[])?.find(
    (item) => item.adapterName === wallet?.adapter.name,
  );

  return target?.id ? walletIcons[target.id] : null;
}
