import { Button, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useEvmSwitchChain } from '@/modules/wallet/hooks/useEvmSwitchChain';

export const SwitchNetworkButton = () => {
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
      background={theme.colors[colorMode].button.wallet.background.default}
      _hover={{
        background: theme.colors[colorMode].button.wallet.background.hover,
      }}
      onClick={() => {
        if (fromChain?.id && switchChain) {
          switchChain({
            chainId: fromChain?.id,
          });
        }
      }}
    >
      {formatMessage({ id: 'transfer.button.switch-network' })}
    </Button>
  );
};
