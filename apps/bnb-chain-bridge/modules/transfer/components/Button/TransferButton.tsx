import { Button, Flex, theme, useIntl } from '@bnb-chain/space';
import { useCallback, useState } from 'react';
import { useAccount, useBalance, usePublicClient, useWalletClient } from 'wagmi';
import { formatUnits } from 'viem';
import { sendTransaction } from '@wagmi/core';

import { useAppSelector } from '@/core/store/hooks';
import { useCBridgeTransferParams } from '@/modules/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';

export function TransferButton({
  onOpenSubmittedModal,
  onOpenFailedModal,
  onOpenApproveModal,
  onOpenConfirmingModal,
  onCloseConfirmingModal,
  setHash,
  setChosenBridge,
}: {
  onOpenSubmittedModal: () => void;
  onOpenFailedModal: () => void;
  onOpenApproveModal: () => void;
  onOpenConfirmingModal: () => void;
  onCloseConfirmingModal: () => void;
  setHash: (hash: string | null) => void;
  setChosenBridge: (bridge: string | null) => void;
}) {
  const { data: walletClient } = useWalletClient();
  const { args } = useCBridgeTransferParams();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { formatMessage } = useIntl();

  const { data: balance } = useBalance({ address: address as `0x${string}` });

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isTransferable = useAppSelector((state) => state.transfer.isTransferable);

  const [isLoading, setIsLoading] = useState(false);

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: transferActionInfo?.bridgeAddress as `0x${string}`,
  });

  const sendTx = useCallback(async () => {
    if (
      !walletClient ||
      !selectedToken ||
      !address ||
      !transferActionInfo ||
      !transferActionInfo.bridgeType ||
      !transferActionInfo.bridgeAddress ||
      allowance === null
    ) {
      return;
    }
    try {
      setHash(null);
      setChosenBridge('');
      setIsLoading(true);
      if (Number(sendValue) > Number(formatUnits(allowance, selectedToken?.decimal))) {
        // eslint-disable-next-line no-console
        console.log(
          'sendValue',
          sendValue,
          'allowance',
          allowance,
          'selectedToken?.decimal',
          selectedToken?.decimal,
        );
        onOpenApproveModal();
        return;
      }
      onOpenConfirmingModal();
      if (transferActionInfo.bridgeType === 'cBridge' && args) {
        const gas = await publicClient.estimateContractGas(args as any);
        const gasPrice = await publicClient.getGasPrice();
        const cBridgeHash = await walletClient.writeContract({
          ...(args as any),
          gas,
          gasPrice,
        });
        await publicClient.waitForTransactionReceipt({
          hash: cBridgeHash,
        });
        if (cBridgeHash) {
          onCloseConfirmingModal();
          setHash(cBridgeHash);
          setChosenBridge('cBridge');
          onOpenSubmittedModal();
        }
        // eslint-disable-next-line no-console
        console.log('cBridge tx', cBridgeHash);
      } else if (transferActionInfo.bridgeType === 'deBridge' && transferActionInfo.value) {
        if (balance && balance?.value < BigInt(transferActionInfo.value)) {
          throw new Error('Could not cover deBridge Protocol Fee. Insufficient balance.');
        }
        const { hash: deBridgeHash } = await sendTransaction({
          to: transferActionInfo.bridgeAddress as string,
          data: transferActionInfo.data,
          value: BigInt(transferActionInfo.value),
        });
        await publicClient.waitForTransactionReceipt({
          hash: deBridgeHash,
        });
        if (deBridgeHash) {
          onCloseConfirmingModal();
          setChosenBridge('deBridge');
          setHash(deBridgeHash);
          onOpenSubmittedModal();
        }
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
    address,
    balance,
    args,
    publicClient,
    selectedToken,
    transferActionInfo,
    walletClient,
    allowance,
    onOpenApproveModal,
    onOpenSubmittedModal,
    onCloseConfirmingModal,
    onOpenConfirmingModal,
    onOpenFailedModal,
    sendValue,
    setHash,
    setChosenBridge,
  ]);

  return (
    <Flex flexDir="column" w={'100%'}>
      <Button
        onClick={sendTx}
        size={'lg'}
        h={theme.sizes['14']}
        w="100%"
        isDisabled={
          isLoading ||
          isGlobalFeeLoading ||
          !sendValue ||
          !Number(sendValue) ||
          !transferActionInfo ||
          !isTransferable
        }
      >
        {formatMessage({ id: 'transfer.button.confirm' })}
      </Button>
    </Flex>
  );
}
