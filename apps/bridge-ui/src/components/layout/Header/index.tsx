import { LogoIcon } from '@/components/icons/Logo';
import { useAccount, useDisconnect, useModal } from '@bridge/wallet';
import { Button, Flex, FlexProps, Text } from '@node-real/uikit';

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
        <Button size="md" onClick={() => onOpen('evm')}>
          connect
        </Button>
      )}
      {address && (
        <Flex alignItems="center" gap={12}>
          {address}
          <Button size="md" onClick={() => disconnect()}>
            disconnect
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
