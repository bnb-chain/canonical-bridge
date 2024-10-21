import { Button, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { reportEvent } from '@/core/utils/gtm';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';

export const WalletConnectButton = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { linkWallet } = useCurrentWallet();

  return (
    <Button
      size="lg"
      h={'56px'}
      w="100%"
      onClick={() => {
        linkWallet({
          chainType: fromChain?.chainType,
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
