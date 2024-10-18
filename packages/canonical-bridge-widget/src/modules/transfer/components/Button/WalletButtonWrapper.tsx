import { PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';

export function WalletButtonWrapper(props: PropsWithChildren) {
  const { children } = props;

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { isConnected, chain } = useAccount();

  if (isConnected) {
    if (fromChain && chain?.id !== fromChain.id) {
      return <SwitchNetworkButton />;
    }
    return <>{children}</>;
  } else {
    return <WalletConnectButton />;
  }
}
