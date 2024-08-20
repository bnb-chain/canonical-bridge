import { Button, theme, useIntl } from '@bnb-chain/space';

import { useAppSelector } from '@/core/store/hooks';
import { useEvmSwitchChain } from '@/modules/wallet/hooks/useEvmSwitchChain';

export const SwitchNetworkButton = () => {
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { switchChain } = useEvmSwitchChain();

  return (
    <Button
      size="lg"
      h={theme.sizes['14']}
      w="100%"
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
