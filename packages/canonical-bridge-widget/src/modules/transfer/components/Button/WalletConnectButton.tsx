import { Button, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useConnectModal } from '@node-real/walletkit';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { reportEvent } from '@/core/utils/gtm';

export const WalletConnectButton = () => {
  const { onOpen } = useConnectModal();
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const theme = useTheme();
  return (
    <Button
      size="lg"
      h={'56px'}
      w="100%"
      onClick={() => {
        onOpen({
          initialChainId: fromChain?.id,
        });
        reportEvent({
          id: 'click_bridge_goal',
          params: {
            item_name: 'Connect Wallet',
          },
        });
      }}
      color={theme.colors[colorMode].button.wallet.text}
      background={theme.colors[colorMode].button.wallet.background.default}
      _hover={{
        background: theme.colors[colorMode].button.wallet.background.hover,
      }}
    >
      <span>{formatMessage({ id: 'transfer.button.wallet-connect' })}</span>
    </Button>
  );
};
