import { Button, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { reportEvent } from '@/core/utils/gtm';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const SwitchWalletButton = () => {
  const { formatMessage } = useIntl();
  const { linkWallet } = useCurrentWallet();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <Button
      size="lg"
      h={'56px'}
      w="100%"
      color={theme.colors[colorMode].button.wallet.text}
      background={theme.colors[colorMode].support.warning['3']}
      _hover={{
        background: theme.colors[colorMode].support.warning['2'],
      }}
      onClick={() => {
        linkWallet({
          targetChainType: fromChain?.chainType,
          targetChainId: fromChain?.id,
        });

        reportEvent({
          id: 'click_bridge_goal',
          params: {
            item_name: 'Switch Wallet',
          },
        });
      }}
    >
      {formatMessage({ id: 'transfer.button.switch-wallet' })}
    </Button>
  );
};
