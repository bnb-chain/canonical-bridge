import { CloseIcon } from '@bnb-chain/icons';
import {
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useColorMode,
  useIntl,
  useTheme,
} from '@bnb-chain/space';

import { TransferSummary } from '@/modules/transfer/components/Modal/TransactionSummaryModal/TransferSummary';
import { TransferConfirmButton } from '@/modules/transfer/components/Button/TransferConfirmButton';
import { FeeSummary } from '@/modules/transfer/components/Modal/TransactionSummaryModal/FeeSummary';

interface ITransactionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubmittedModal: () => void;
  onOpenFailedModal: () => void;
  onOpenApproveModal: () => void;
  onOpenConfirmingModal: () => void;
  onCloseConfirmingModal: () => void;
  setHash: (hash: string | null) => void;
  setChosenBridge: (bridge: string | null) => void;
}

export function TransactionSummaryModal(props: ITransactionSummaryModalProps) {
  const {
    isOpen,
    onClose,
    onOpenSubmittedModal,
    onOpenFailedModal,
    onOpenConfirmingModal,
    onCloseConfirmingModal,
    setHash,
    setChosenBridge,
  } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ md: 'lg' }} isCentered>
      <ModalOverlay className="bccb-widget-transaction-summary-modal-overlap" w={'100%'} />
      <ModalContent
        className="bccb-widget-transaction-summary-modal-content"
        background={theme.colors[colorMode].background.body}
        p={0}
        w={['100%', '100%', '558px']}
        overflow={['auto', 'auto', 'auto', 'hidden']}
        margin={0}
      >
        <Flex
          className="bccb-widget-transaction-summary-modal-header"
          h={'64px'}
          px={'20px'}
          py={0}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          lineHeight={1.4}
          fontWeight={500}
          fontSize={'20px'}
          borderBottom={`1px solid ${theme.colors[colorMode].border['3']}`}
          flexShrink={0}
        >
          <Flex boxSize={'24px'}></Flex>
          {formatMessage({ id: 'modal.summary.title' })}
          <CloseIcon
            boxSize={'24px'}
            onClick={onClose}
            cursor="pointer"
            color={theme.colors[colorMode].modal.close.default}
            _hover={{
              color: theme.colors[colorMode].modal.close.hover,
            }}
          />
        </Flex>
        <Flex
          className="bccb-widget-transaction-summary-modal-wrapper"
          flexDir="column"
          p={['20px', '20px', '20px 20px 24px']}
          flex={1}
        >
          <Flex flexDir="column" mt={0} flex={1} overflowY="auto">
            <TransferSummary />
            <FeeSummary />
            <TransferConfirmButton
              onClose={onClose}
              onOpenSubmittedModal={onOpenSubmittedModal}
              onOpenFailedModal={onOpenFailedModal}
              onOpenConfirmingModal={onOpenConfirmingModal}
              onCloseConfirmingModal={onCloseConfirmingModal}
              setHash={setHash}
              setChosenBridge={setChosenBridge}
            />
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
