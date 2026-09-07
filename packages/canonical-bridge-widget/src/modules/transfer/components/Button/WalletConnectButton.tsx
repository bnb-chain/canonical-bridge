import { Button, ButtonProps, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useBridgeConfig } from '@/index';
import { EventTypes, useAnalytics } from '@/core/analytics';

export const WalletConnectButton = (props: ButtonProps) => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { onClickConnectWalletButton } = useBridgeConfig();
  const { emit } = useAnalytics();

  return (
    <Button
      className="bccb-widget-wallet-connect-button"
      size="lg"
      h={'56px'}
      w="100%"
      onClick={() => {
        onClickConnectWalletButton?.({ chainType: fromChain!.chainType, chainId: fromChain!.id });

        emit(EventTypes.CLICK_BRIDGE_GOAL, {
          ctaLabel: 'Connect Wallet',
          item_name: 'Connect Wallet',
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
