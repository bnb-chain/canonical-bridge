import { useCallback, useState } from 'react';
import { VersionedTransaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useAppSelector } from '@/core/store/hooks';
import { StyledTransferButton } from '@/modules/transfer/components/Button/TransferButton';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';

export interface SolanaTransferButtonProps {
  onOpenSubmittedModal: () => void;
  onOpenFailedModal: () => void;
  onOpenConfirmingModal: () => void;
  onCloseConfirmingModal: () => void;
  setHash: (hash: string | null) => void;
}

export function SolanaTransferButton(params: SolanaTransferButtonProps) {
  const {
    onOpenSubmittedModal,
    onOpenFailedModal,
    onOpenConfirmingModal,
    onCloseConfirmingModal,
    setHash,
  } = params;

  const { address } = useSolanaAccount();
  const { connection } = useConnection();

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isTransferable = useAppSelector((state) => state.transfer.isTransferable);

  const [isLoading, setIsLoading] = useState(false);
  const { signTransaction, sendTransaction } = useWallet();

  const sendTx = useCallback(async () => {
    if (
      !selectedToken ||
      !address ||
      !transferActionInfo ||
      !transferActionInfo.bridgeType ||
      !signTransaction ||
      !sendTransaction
    ) {
      return;
    }
    try {
      setHash(null);
      setIsLoading(true);
      onOpenConfirmingModal();

      const { blockhash } = await connection.getLatestBlockhash();
      const data = (transferActionInfo.data as string)?.slice(2);
      const tx = VersionedTransaction.deserialize(Buffer.from(data, 'hex'));
      tx.message.recentBlockhash = blockhash;

      const txHash = await sendTransaction(tx, connection);

      if (txHash) {
        setHash(txHash);

        onCloseConfirmingModal();
        onOpenSubmittedModal();
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e, e.message);
      onOpenFailedModal();
    } finally {
      onCloseConfirmingModal();
      setIsLoading(false);
    }
  }, [
    selectedToken,
    address,
    transferActionInfo,
    signTransaction,
    sendTransaction,
    setHash,
    onOpenConfirmingModal,
    connection,
    onCloseConfirmingModal,
    onOpenSubmittedModal,
    onOpenFailedModal,
  ]);

  return (
    <StyledTransferButton
      onClick={sendTx}
      isDisabled={
        isLoading ||
        isGlobalFeeLoading ||
        !sendValue ||
        !Number(sendValue) ||
        !transferActionInfo ||
        !isTransferable
      }
    />
  );
}
