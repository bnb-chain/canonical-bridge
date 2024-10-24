import { PropsWithChildren } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';
import { SwitchWalletButton } from '@/modules/transfer/components/Button/SwitchWalletButton';

export function WalletButtonWrapper(props: PropsWithChildren) {
  const { children } = props;

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { isConnected, chainId, walletType } = useCurrentWallet();

  if (isConnected) {
    if (walletType !== fromChain?.chainType) {
      return <SwitchWalletButton />;
    } else {
      if (chainId !== fromChain.id) {
        return <SwitchNetworkButton />;
      }
      return <>{children}</>;
    }
  }

  return <WalletConnectButton />;
}
