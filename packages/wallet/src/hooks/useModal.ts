import { useFlowWallet } from '@/modules/flow/providers/FlowWalletProvider';
import { useWallet } from '@/providers/WalletProvider';
import { WalletType } from '@/types';
import { useModal as useEVMModal } from '@node-real/walletkit';
import { useMemo } from 'react';

export function useModal() {
  const { walletType, setWalletType } = useWallet();

  const evmModal = useEVMModal();
  const flowModal = useFlowWallet();

  const isOpen = useMemo(() => {
    if (walletType === 'evm') return evmModal.isOpen;
    if (walletType === 'flow') return flowModal.isOpen;
    return false;
  }, [evmModal.isOpen, flowModal.isOpen, walletType]);

  return {
    isOpen,
    onOpen: (walletType: WalletType = 'evm') => {
      setWalletType(walletType);

      if (walletType === 'evm') evmModal.onOpen();
      if (walletType === 'flow') flowModal.onOpen();
    },
    onClose: () => {
      if (walletType === 'evm') evmModal.onClose();
      if (walletType === 'flow') flowModal.onClose();
    },
  };
}
