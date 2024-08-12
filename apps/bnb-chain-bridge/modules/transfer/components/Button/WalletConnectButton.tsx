import { Button, theme, useIntl } from '@bnb-chain/space';
import { useModal } from '@node-real/walletkit';

export const WalletConnectButton = () => {
  const { onOpen } = useModal();
  const { formatMessage } = useIntl();

  return (
    <Button size="lg" h={theme.sizes['14']} w="100%" onClick={() => onOpen()}>
      <span>{formatMessage({ id: 'transfer.button.wallet-connect' })}</span>
    </Button>
  );
};
