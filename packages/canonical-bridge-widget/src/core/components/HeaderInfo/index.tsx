import { Button, Flex } from '@bnb-chain/space';
import { useConnectModal } from '@node-real/walletkit';
import { useAccount } from 'wagmi';

import { ProfileMenu } from '@/core/components/ProfileMenu';
import { HeaderNetworkStatus } from '@/core/components/HeaderNetworkStatus';

export const HeaderInfo = () => {
  const { isConnected } = useAccount();
  const { onOpen } = useConnectModal();

  return (
    <Flex alignItems="center" gap={'16px'}>
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
