import { Button, useIntl } from '@bnb-chain/space';

import { useWalletModal } from '@/modules/wallet/hooks/useWalletModal';

export const WalletConnectButton = () => {
  const { onOpen } = useWalletModal();
  const { formatMessage } = useIntl();

  return (
    <Button size="lg" h={'56px'} w="100%" onClick={() => onOpen()}>
      <span>{formatMessage({ id: 'transfer.button.wallet-connect' })}</span>
    </Button>
  );
};
