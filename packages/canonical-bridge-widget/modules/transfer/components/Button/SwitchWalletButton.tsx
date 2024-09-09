import { Button, useIntl } from '@bnb-chain/space';

import { useWalletModal } from '@/modules/wallet/hooks/useWalletModal';

export function SwitchWalletButton() {
  const { formatMessage } = useIntl();
  const { onOpen } = useWalletModal();

  return (
    <Button
      size="lg"
      h={'56px'}
      w="100%"
      colorScheme="warning"
      onClick={() => {
        onOpen();
      }}
    >
      {formatMessage({ id: 'transfer.button.switch-wallet' })}
    </Button>
  );
}
