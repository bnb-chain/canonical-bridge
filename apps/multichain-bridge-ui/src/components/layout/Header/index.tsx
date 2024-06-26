import { BnbChainButton } from '@/app/transfer/components/BNBChain/BnbChainButton';
import { LogoIcon } from '@/components/icons/Logo';
import { useAccount, useDisconnect, useModal } from '@bridge/wallet';
import { Flex, FlexProps } from '@node-real/uikit';

export function Header(props: FlexProps) {
  const { onOpen } = useModal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Flex
      as="header"
      h={68}
      borderBottom="1px solid readable.border"
      alignItems="center"
      justifyContent="space-between"
      px={24}
      {...props}
    >
      <LogoIcon />

      {!isConnected && (
        <BnbChainButton
          background={`layer.3.default`}
          _hover={{
            background: 'layer.3.hover',
          }}
          color={'text.primary'}
          size="md"
          onClick={() => onOpen('evm')}
        >
          connect
        </BnbChainButton>
      )}
      {address && (
        <Flex alignItems="center" gap={12}>
          {address}
          <BnbChainButton
            background={`layer.3.default`}
            _hover={{
              background: 'layer.3.hover',
            }}
            color={'text.primary'}
            size="md"
            onClick={() => disconnect()}
          >
            disconnect
          </BnbChainButton>
        </Flex>
      )}
    </Flex>
  );
}
