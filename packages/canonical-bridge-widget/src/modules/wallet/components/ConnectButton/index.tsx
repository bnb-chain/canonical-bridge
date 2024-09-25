import { useConnectModal } from '@node-real/walletkit';
import { useAccount } from 'wagmi';
import { Button, Flex } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { NetworkStatus } from '@/modules/wallet/components/NetworkStatus';
import { ProfileMenu } from '@/modules/wallet/components/ProfileMenu';

interface ConnectButtonProps {}

export function ConnectButton(props: ConnectButtonProps) {
  const { ...restProps } = props;

  const { isConnected } = useAccount();
  const { onOpen } = useConnectModal();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  return (
    <Flex alignItems="center" gap={'16px'} {...restProps}>
      {!isConnected && (
        <Button
          variant="outline"
          h={'40px'}
          px={'16px'}
          borderRadius={'8px'}
          fontSize="14px"
          lineHeight="16px"
          fontWeight={500}
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
          <NetworkStatus />
          <ProfileMenu />
        </>
      )}
    </Flex>
  );
}
