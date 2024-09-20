import { Button, Flex } from '@bnb-chain/space';
import { useConnectModal } from '@node-real/walletkit';
import { useAccount } from 'wagmi';

import { ProfileMenu } from '@/core/components/ProfileMenu';
import { HeaderNetworkStatus } from '@/core/components/HeaderNetworkStatus';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const HeaderInfo = () => {
  const { isConnected } = useAccount();
  const { onOpen } = useConnectModal();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  return (
    <Flex alignItems="center" gap={'16px'}>
      {!isConnected && (
        <Button
          size="lg"
          onClick={() =>
            onOpen({
              initialChainId: fromChain?.id,
            })
          }
        >
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
