import { useConnectModal } from '@node-real/walletkit';
import { useAccount } from 'wagmi';
import { Button, Flex } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { HeaderNetworkStatus } from '@/modules/wallet/components/NetworkStatus';
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
}
