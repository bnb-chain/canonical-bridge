import { Button, Flex, theme } from '@bnb-chain/space';

import { ProfileMenu } from '@/core/components/ProfileMenu';
import { useWalletModal } from '@/modules/wallet/hooks/useWalletModal';
import { useCurrentWallet } from '@/modules/wallet/hooks/useCurrentWallet';
import { HeaderNetworkStatus } from '@/core/components/HeaderNetworkStatus';
import { useWaitForReady } from '@/core/hooks/useWaitForReady';

export const HeaderInfo = () => {
  const isReady = useWaitForReady();

  const { isConnected } = useCurrentWallet();
  const { onOpen } = useWalletModal();

  if (!isReady) {
    return null;
  }

  return (
    <Flex alignItems="center" gap={theme.sizes['4']}>
      {!isConnected && (
        <Button size="lg" onClick={() => onOpen()}>
          Connect Wallet
        </Button>
      )}

      {isConnected && (
        <>
          <HeaderNetworkStatus />
          <ProfileMenu />
        </>
      )}
    </Flex>
  );
};
