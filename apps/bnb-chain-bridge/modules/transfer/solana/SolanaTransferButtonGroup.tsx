import { Flex, theme, useDisclosure } from '@bnb-chain/space';
import { useState } from 'react';

import { TransactionSubmittedModal } from '@/modules/transfer/components/Modal/TransactionSubmittedModal';
import { TransactionFailedModal } from '@/modules/transfer/components/Modal/TransactionFailedModal';
import { TransactionConfirmingModal } from '@/modules/transfer/components/Modal/TransactionConfirmingModal';
import { SolanaTransferButton } from '@/modules/transfer/solana/SolanaTransferButton';
import { WalletButtonWrapper } from '@/modules/transfer/components/Button/WalletButtonWrapper';

export const SolanaTransferButtonGroup = () => {
  const [hash, setHash] = useState<string | null>(null);

  const submittedModal = useDisclosure();
  const failedModal = useDisclosure();
  const confirmingModal = useDisclosure();

  return (
    <>
      <Flex gap={theme.sizes['1']}>
        <WalletButtonWrapper>
          <SolanaTransferButton
            onOpenSubmittedModal={submittedModal.onOpen}
            onOpenFailedModal={failedModal.onOpen}
            onOpenConfirmingModal={confirmingModal.onOpen}
            onCloseConfirmingModal={confirmingModal.onClose}
            setHash={setHash}
          />
        </WalletButtonWrapper>
      </Flex>

      <TransactionSubmittedModal
        isOpen={submittedModal.isOpen}
        onClose={submittedModal.onClose}
        hash={hash || ''}
        chosenBridge={'deBridge'}
      />
      <TransactionFailedModal isOpen={failedModal.isOpen} onClose={failedModal.onClose} />
      <TransactionConfirmingModal
        isOpen={confirmingModal.isOpen}
        onClose={confirmingModal.onClose}
      />
    </>
  );
};
