import { ConnectButton } from '@bnb-chain/canonical-bridge-widget';
import { useColorMode } from '@bnb-chain/space';
import { useWalletKit } from '@node-real/walletkit';
import { SolanaWallet, useSolanaWallet } from '@node-real/walletkit/solana';
import { TronWallet, useTronWallet } from '@node-real/walletkit/tron';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { WalletIcon } from '@/core/components/icons/WalletIcon';

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
  return useWalletIcon(connector?.id);
}

function useTronWalletIcon() {
  const { tronConfig } = useWalletKit();
  const { wallet } = useTronWallet();

  const target = (tronConfig?.wallets as TronWallet[])?.find(
    (item) => item.adapterName === wallet?.adapter.name,
  );

  return useWalletIcon(target?.id);
}

function useSolanaWalletIcon() {
  const { solanaConfig } = useWalletKit();
  const { wallet } = useSolanaWallet();

  const target = (solanaConfig?.wallets as SolanaWallet[])?.find(
    (item) => item.adapterName === wallet?.adapter.name,
  );

  return useWalletIcon(target?.id);
}

function useWalletIcon(walletId?: string) {
  const { colorMode } = useColorMode();
  const { wallets } = useWalletKit();

  const icon = useMemo(() => {
    const selectedWallet = wallets.find((item) => item.id === walletId);

    if (selectedWallet) {
      const { default: defaultLogos } = selectedWallet.logos ?? {};
      const defaultLogo = (defaultLogos as any)?.[colorMode] ?? defaultLogos;
      return defaultLogo || <WalletIcon />;
    }

    return null;
  }, [colorMode, walletId, wallets]);

  return icon;
}
