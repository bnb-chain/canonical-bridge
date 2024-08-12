import { Flex, theme, useDisclosure, useHasMounted } from '@bnb-chain/space';
import { useAccount, useNetwork } from 'wagmi';
import { useState } from 'react';

import { useAppSelector } from '@/core/store/hooks';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
import { TransferButton } from '@/modules/transfer/components/Button/TransferButton';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { TransactionSubmittedModal } from '@/modules/transfer/components/Modal/TransactionSubmittedModal';
import { TransactionFailedModal } from '@/modules/transfer/components/Modal/TransactionFailedModal';
import { TransactionApproveModal } from '@/modules/transfer/components/Modal/TransactionApproveModal';
import { TransactionConfirmingModal } from '@/modules/transfer/components/Modal/TransactionConfirmingModal';

export const TransferButtonGroup = () => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const hasMounted = useHasMounted();

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
      <Flex gap={theme.sizes['1']} mt={theme.sizes['6']}>
        {!isConnected && hasMounted ? (
          <WalletConnectButton />
        ) : chain && fromChain && chain.id !== fromChain?.id ? (
          <SwitchNetworkButton />
        ) : (
          <TransferButton
            onOpenSubmittedModal={onOpenSubmittedModal}
            onOpenFailedModal={onOpenFailedModal}
            onOpenApproveModal={onOpenApproveModal}
            onOpenConfirmingModal={onOpenConfirmingModal}
            onCloseConfirmingModal={onCloseConfirmingModal}
            setHash={setHash}
            setChosenBridge={setChosenBridge}
          />
        )}
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
