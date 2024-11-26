import { PropsWithChildren } from 'react';

import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
// import { useDelay } from '@/core/hooks/useDelay';
import { useNeedSwitchChain } from '@/modules/wallet/hooks/useNeedSwitchChain';
import { useIsWalletCompatible } from '@/modules/wallet/hooks/useIsWalletCompatible';
import { useBridgeConfig } from '@/index';

export function WalletButtonWrapper(props: PropsWithChildren) {
  const { children } = props;
  const { needSwitchChain } = useNeedSwitchChain();
  const isWalletCompatible = useIsWalletCompatible();

  const { connectWalletButton } = useBridgeConfig();

  // const isReady = useDelay();
  // if (!isReady) {
  //   return <WalletConnectButton />;
  // }

  if (needSwitchChain) {
    return <SwitchNetworkButton />;
  }

  if (isWalletCompatible) {
    return <>{children}</>;
  }

  return connectWalletButton;
}
