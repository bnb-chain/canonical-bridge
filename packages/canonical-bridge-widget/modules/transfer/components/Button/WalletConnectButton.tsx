import { Button, useColorMode, useIntl } from '@bnb-chain/space';
import { useConnectModal } from '@node-real/walletkit';

import { useAppSelector } from '@/modules/store/StoreProvider';

export const WalletConnectButton = () => {
  const { onOpen } = useConnectModal();
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();

  const theme = useAppSelector((state) => state.theme.themeConfig);
  return (
    <Button
      size="lg"
      h={'56px'}
      w="100%"
      onClick={() => onOpen()}
      color={theme.colors[colorMode].button.wallet.text}
      background={theme.colors[colorMode].button.wallet.background.hover}
      _hover={{
        background: theme.colors[colorMode].button.wallet.background.hover,
      }}
    >
      <span>{formatMessage({ id: 'transfer.button.wallet-connect' })}</span>
    </Button>
  );
};
