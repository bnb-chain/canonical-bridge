import { Button, useColorMode, useIntl } from '@bnb-chain/space';

import { useWalletModal } from '@/modules/wallet/hooks/useWalletModal';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const WalletConnectButton = () => {
  const { onOpen } = useWalletModal();
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
