import { Button, theme, useIntl } from '@bnb-chain/space';

import { useAppSelector } from '@/core/store/hooks';
import { useAppSwitchNetwork } from '@/core/hooks/useAppSwitchNetwork';

export const SwitchNetworkButton = () => {
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { switchNetwork } = useAppSwitchNetwork();

  return (
    <Button
      size="lg"
      h={theme.sizes['14']}
      w="100%"
      onClick={() => {
        if (fromChain?.id && switchNetwork) {
          switchNetwork(fromChain?.id);
        }
      }}
    >
      {formatMessage({ id: 'transfer.button.switch-network' })}
    </Button>
  );
};
