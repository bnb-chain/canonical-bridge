import { Button, ButtonProps, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { reportEvent } from '@/core/utils/gtm';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useBridgeConfig } from '@/index';

export const WalletConnectButton = (props: ButtonProps) => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { onClickConnectWalletButton } = useBridgeConfig();

  return (
    <Button
      className="bccb-widget-wallet-connect-button"
      size="lg"
      h={'56px'}
      w="100%"
      onClick={() => {
        onClickConnectWalletButton?.({ chainType: fromChain!.chainType, chainId: fromChain!.id });

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
      {...props}
    >
      <span>{formatMessage({ id: 'transfer.button.wallet-connect' })}</span>
    </Button>
  );
};
