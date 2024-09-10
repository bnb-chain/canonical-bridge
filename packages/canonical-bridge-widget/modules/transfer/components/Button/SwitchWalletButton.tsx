import { Button, useIntl } from '@bnb-chain/space';
import { useConnectModal } from '@node-real/walletkit';

export function SwitchWalletButton() {
  const { formatMessage } = useIntl();
  const { onOpen } = useConnectModal();

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
