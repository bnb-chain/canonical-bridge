import { BnbChainButton } from '@/app/transfer/components/BNBChain/BnbChainButton';
import { formatAddress } from '@/bridges/main/utils';
import { AvatarIcon } from '@/components/icons/Avatar';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useAccount, useDisconnect, useModal } from '@bridge/wallet';
import { Button, Flex, Skeleton } from '@node-real/uikit';

export const WalletConnectButton = () => {
  const { onOpen } = useModal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return (
      <Skeleton>
        <Button>Connect Wallet</Button>
      </Skeleton>
    );
  }

  return (
    <Flex>
      {!isConnected && (
        <BnbChainButton
          border={'1px solid border.3'}
          gap={8}
          p={8}
          h={40}
          onClick={() => onOpen('evm')}
        >
          Connect Wallet
        </BnbChainButton>
      )}
      {address && (
        <Flex alignItems="center" gap={8} flexDir={'row'}>
          <BnbChainButton
            borderRadius={100}
            background={'layer.3.default'}
            border={'1px solid border.3'}
            color={'text.primary'}
            gap={8}
            p={8}
            h={40}
            fontSize={14}
            fontWeight={500}
            _hover={{
              background: 'layer.3.hover',
            }}
            onClick={() => disconnect()}
            leftIcon={<AvatarIcon borderRadius={'50%'} />}
          >
            {formatAddress({ value: address })}
          </BnbChainButton>
        </Flex>
      )}
    </Flex>
  );
};
