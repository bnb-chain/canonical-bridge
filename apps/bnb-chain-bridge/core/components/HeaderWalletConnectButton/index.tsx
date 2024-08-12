import { Button, Flex, useHasMounted } from '@bnb-chain/space';
import { useModal } from '@node-real/walletkit';
import { useAccount } from 'wagmi';

import { ProfileMenu } from '@/core/components/ProfileMenu';

export const HeaderWalletConnectButton = () => {
  const hasMounted = useHasMounted();

  const { isConnected } = useAccount();
  const { onOpen } = useModal();

  return (
    <Flex alignItems="center" gap={12}>
      {!isConnected && hasMounted && (
        <Button size="lg" onClick={() => onOpen()}>
          <span>Connect Wallet</span>
        </Button>
      )}
      {hasMounted && isConnected && <ProfileMenu />}
    </Flex>
  );
};
