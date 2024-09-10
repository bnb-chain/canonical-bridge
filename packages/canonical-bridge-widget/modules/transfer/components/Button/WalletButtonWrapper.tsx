import { PropsWithChildren } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { useCurrentWallet } from '@/modules/wallet/hooks/useCurrentWallet';
import { SwitchWalletButton } from '@/modules/transfer/components/Button/SwitchWalletButton';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
import { useWalletSupportChain } from '@/modules/wallet/hooks/useWalletSupportChain';

export function WalletButtonWrapper(props: PropsWithChildren) {
  const { children } = props;

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { isConnected, chain, walletId } = useCurrentWallet();

  const isSupported = useWalletSupportChain(fromChain, walletId);

  if (isConnected) {
    if (chain && fromChain) {
      if (!isSupported) {
        return <SwitchWalletButton />;
      } else if (chain.id !== fromChain.id) {
        return <SwitchNetworkButton />;
      }
    }
    return <>{children}</>;
  } else {
    return <WalletConnectButton />;
  }
}
