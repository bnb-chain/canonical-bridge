import { BnbChainButton } from '@/app/transfer/components/BNBChain/BnbChainButton';
import { WalletConnectButton } from '@/app/transfer/components/WalletConnectButton';
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
      px={64}
      {...props}
    >
      <LogoIcon />

      <WalletConnectButton />
    </Flex>
  );
}
