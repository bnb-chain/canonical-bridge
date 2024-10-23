import { Button, useColorMode, useIntl, useTheme, ButtonProps } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useEvmSwitchChain } from '@/modules/wallet/hooks/useEvmSwitchChain';
import { reportEvent } from '@/core/utils/gtm';

export const SwitchNetworkButton = (props: ButtonProps) => {
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { switchChain } = useEvmSwitchChain();
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
        if (fromChain?.id && switchChain) {
          switchChain({
            chainId: fromChain?.id,
          });

          reportEvent({
            id: 'click_bridge_goal',
            params: {
              item_name: 'Switch Network',
            },
          });
        }
      }}
      {...props}
    >
      {formatMessage({ id: 'transfer.button.switch-network' })}
    </Button>
  );
};
