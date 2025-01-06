import { Flex, useDisclosure, useIntl } from '@bnb-chain/space';
import { useState } from 'react';

import { TransferButton } from '@/modules/transfer/components/Button/TransferButton';
import { TransactionSubmittedModal } from '@/modules/transfer/components/Modal/TransactionSubmittedModal';
import { TransactionFailedModal } from '@/modules/transfer/components/Modal/TransactionFailedModal';
import { TransactionApproveModal } from '@/modules/transfer/components/Modal/TransactionApproveModal';
import { TransactionConfirmingModal } from '@/modules/transfer/components/Modal/TransactionConfirmingModal';
import { WalletButtonWrapper } from '@/modules/transfer/components/Button/WalletButtonWrapper';
import { TransactionSummaryModal } from '@/modules/transfer/components/Modal/TransactionSummaryModal';
import { TransferWarningMessage } from '@/modules/transfer/components/TransferWarningMessage';
import { MIN_SOL_TO_ENABLED_TX } from '@/core/constants';
import { FailedToGetQuoteModal } from '@/modules/transfer/components/Modal/FailedToGetQuoteModal';
import { useFailGetQuoteModal } from '@/modules/transfer/hooks/modal/useFailGetQuoteModal';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useSummaryModal } from '@/modules/transfer/hooks/modal/useSummaryModal';

export const TransferButtonGroup = () => {
  const [hash, setHash] = useState<string | null>(null);
  const [chosenBridge, setChosenBridge] = useState<string | null>(null);
  const { formatMessage } = useIntl();

  const isFailedGetQuoteModalOpen = useAppSelector(
    (state) => state.transfer.isFailedGetQuoteModalOpen,
  );
  const isSummaryModalOpen = useAppSelector((state) => state.transfer.isSummaryModalOpen);

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
  const { onCloseFailedGetQuoteModal } = useFailGetQuoteModal();
  const { onCloseSummaryModal, onOpenSummaryModal } = useSummaryModal();
  return (
    <>
      <Flex
        className="bccb-widget-transfer-button-container"
        mt={{ base: '8px', md: '16px' }}
        flexDir={'column'}
      >
        <WalletButtonWrapper>
          <TransferButton
            onOpenFailedModal={onOpenFailedModal}
            onOpenApproveModal={onOpenApproveModal}
            onCloseConfirmingModal={onCloseConfirmingModal}
            onOpenSummaryModal={onOpenSummaryModal}
            setChosenBridge={setChosenBridge}
          />
        </WalletButtonWrapper>
        <TransferWarningMessage
          text={formatMessage(
            { id: 'transfer.warning.sol.balance' },
            { min: MIN_SOL_TO_ENABLED_TX },
          )}
        />
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
      <TransactionSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={onCloseSummaryModal}
        onOpenSubmittedModal={onOpenSubmittedModal}
        onOpenFailedModal={onOpenFailedModal}
        onOpenApproveModal={onOpenApproveModal}
        onOpenConfirmingModal={onOpenConfirmingModal}
        onCloseConfirmingModal={onCloseConfirmingModal}
        setHash={setHash}
        setChosenBridge={setChosenBridge}
      />
      <FailedToGetQuoteModal
        isOpen={isFailedGetQuoteModalOpen}
        onClose={onCloseFailedGetQuoteModal}
      />
    </>
  );
};
