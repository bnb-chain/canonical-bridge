import { PropsWithChildren } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
import { useCurrentWallet } from '@/modules/wallet/hooks/useCurrentWallet';

export function WalletButtonWrapper(props: PropsWithChildren) {
  const { children } = props;

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { isConnected, chain, isEvmConnected } = useCurrentWallet();

  if (isConnected) {
    if (isEvmConnected) {
      if (fromChain && chain?.id !== fromChain.id) {
        return <SwitchNetworkButton />;
      }
    }

    return <>{children}</>;
  } else {
    return <WalletConnectButton />;
  }
}
