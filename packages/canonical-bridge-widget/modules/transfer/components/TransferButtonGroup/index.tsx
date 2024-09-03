import { Flex, theme, useDisclosure } from '@bnb-chain/space';
import { useState } from 'react';

import { TransferButton } from '@/modules/transfer/components/Button/TransferButton';
import { TransactionSubmittedModal } from '@/modules/transfer/components/Modal/TransactionSubmittedModal';
import { TransactionFailedModal } from '@/modules/transfer/components/Modal/TransactionFailedModal';
import { TransactionApproveModal } from '@/modules/transfer/components/Modal/TransactionApproveModal';
import { TransactionConfirmingModal } from '@/modules/transfer/components/Modal/TransactionConfirmingModal';
import { WalletButtonWrapper } from '@/modules/transfer/components/Button/WalletButtonWrapper';

export const TransferButtonGroup = () => {
  const [hash, setHash] = useState<string | null>(null);
  const [chosenBridge, setChosenBridge] = useState<string | null>(null);

  const {
    isOpen: isSubmittedModalOpen,
    onOpen: onOpenSubmittedModal,
    onClose: onCloseSubmittedModal,
  } = useDisclosure();
  const {
    isOpen: isFailedModalOpen,
    onOpen: onOpenFailedModal,
    onClose: onCloseFailedModal,
  } = useDisclosure();
  const {
    isOpen: isApproveModalOpen,
    onOpen: onOpenApproveModal,
    onClose: onCloseApproveModal,
  } = useDisclosure();
  const {
    isOpen: isConfirmingModalOpen,
    onOpen: onOpenConfirmingModal,
    onClose: onCloseConfirmingModal,
  } = useDisclosure();

  return (
    <>
      <Flex gap={theme.sizes['1']}>
        <WalletButtonWrapper>
          <TransferButton
            onOpenSubmittedModal={onOpenSubmittedModal}
            onOpenFailedModal={onOpenFailedModal}
            onOpenApproveModal={onOpenApproveModal}
            onOpenConfirmingModal={onOpenConfirmingModal}
            onCloseConfirmingModal={onCloseConfirmingModal}
            setHash={setHash}
            setChosenBridge={setChosenBridge}
          />
        </WalletButtonWrapper>
      </Flex>
      <TransactionSubmittedModal
        isOpen={isSubmittedModalOpen}
        onClose={onCloseSubmittedModal}
        hash={hash || ''}
        chosenBridge={chosenBridge || ''}
      />
      <TransactionFailedModal isOpen={isFailedModalOpen} onClose={onCloseFailedModal} />
      <TransactionApproveModal
        isOpen={isApproveModalOpen}
        onClose={onCloseApproveModal}
        onOpenConfirmingModal={onOpenConfirmingModal}
        onCloseConfirmingModal={onCloseConfirmingModal}
      />
      <TransactionConfirmingModal isOpen={isConfirmingModalOpen} onClose={onCloseConfirmingModal} />
    </>
  );
};
