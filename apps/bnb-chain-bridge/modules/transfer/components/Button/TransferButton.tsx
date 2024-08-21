import { Button, ButtonProps, Flex, theme, useIntl } from '@bnb-chain/space';
import { useCallback, useState } from 'react';
import { useAccount, useBalance, usePublicClient, useWalletClient } from 'wagmi';
import { formatUnits } from 'viem';

import { deBridgeInstance } from '@/modules/bridges/debridge/sdk-instance';
import { useAppSelector } from '@/core/store/hooks';
import { useCBridgeTransferParams } from '@/modules/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { useStarGateTransferParams } from '@/modules/bridges/stargate/hooks/useStarGateTransferParams';
import { useStarGateTransfer } from '@/modules/bridges/stargate/hooks/useStarGateTransfer';
import { reportEvent } from '@/core/utils/ga';

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
  const { args: cBridgeArgs } = useCBridgeTransferParams();
  const { args: stargateArgs } = useStarGateTransferParams();

  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { sendToken } = useStarGateTransfer();

  const { data: balance } = useBalance({ address: address as `0x${string}` });

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isTransferable = useAppSelector((state) => state.transfer.isTransferable);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const [isLoading, setIsLoading] = useState(false);

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: transferActionInfo?.bridgeAddress as `0x${string}`,
  });

  const sendTx = useCallback(async () => {
    if (
      !walletClient ||
      !publicClient ||
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
      if (transferActionInfo.bridgeType === 'cBridge' && cBridgeArgs) {
        try {
          const gas = await publicClient.estimateContractGas(cBridgeArgs as any);
          const gasPrice = await publicClient.getGasPrice();
          const cBridgeHash = await walletClient.writeContract({
            ...(cBridgeArgs as any),
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
            reportEvent({
              name: 'bridge_transaction_success',
              data: {
                pair: `${fromChain?.name}, ${toChain?.name}`,
                token: selectedToken?.symbol,
                amount: sendValue,
                bridge_route: 'cbridge',
              },
            });
          }
          // eslint-disable-next-line no-console
          console.log('cBridge tx', cBridgeHash);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
          onOpenFailedModal();
          reportEvent({
            name: 'bridge_transaction_fail',
            data: {
              pair: `${fromChain?.name}, ${toChain?.name}`,
              token: selectedToken?.symbol,
              amount: sendValue,
              bridge_route: 'cbridge',
            },
          });
        }
      } else if (transferActionInfo.bridgeType === 'deBridge' && transferActionInfo.value) {
        try {
          if (balance && balance?.value < BigInt(transferActionInfo.value)) {
            throw new Error('Could not cover deBridge Protocol Fee. Insufficient balance.');
          }
          const deBridgeHash = await deBridgeInstance.sendToken({
            walletClient,
            bridgeAddress: transferActionInfo.bridgeAddress as string,
            data: transferActionInfo.data as `0x${string}`,
            amount: BigInt(transferActionInfo.value),
            address,
          });
          await publicClient.waitForTransactionReceipt({
            hash: deBridgeHash,
          });
          if (deBridgeHash) {
            onCloseConfirmingModal();
            setChosenBridge('deBridge');
            setHash(deBridgeHash);
            onOpenSubmittedModal();
            reportEvent({
              name: 'bridge_transaction_success',
              data: {
                pair: `${fromChain?.name}, ${toChain?.name}`,
                token: selectedToken?.symbol,
                amount: sendValue,
                bridge_route: 'debridge',
              },
            });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
          onOpenFailedModal();
          reportEvent({
            name: 'bridge_transaction_fail',
            data: {
              pair: `${fromChain?.name}, ${toChain?.name}`,
              token: selectedToken?.symbol,
              amount: sendValue,
              bridge_route: 'debridge',
            },
          });
        }
      } else if (transferActionInfo.bridgeType === 'stargate' && stargateArgs) {
        const stargateHash = await sendToken({ onOpenFailedModal });
        if (stargateHash) {
          onCloseConfirmingModal();
          setChosenBridge('stargate');
          setHash(stargateHash);
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
    walletClient,
    publicClient,
    selectedToken,
    address,
    transferActionInfo,
    allowance,
    setHash,
    setChosenBridge,
    sendValue,
    onOpenConfirmingModal,
    cBridgeArgs,
    stargateArgs,
    onOpenApproveModal,
    onCloseConfirmingModal,
    onOpenSubmittedModal,
    fromChain?.name,
    toChain?.name,
    onOpenFailedModal,
    balance,
    sendToken,
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

export function StyledTransferButton(props: ButtonProps) {
  const { ...restProps } = props;
  const { formatMessage } = useIntl();

  return (
    <Flex flexDir="column" w={'100%'}>
      <Button size={'lg'} h={theme.sizes['14']} w="100%" {...restProps}>
        {formatMessage({ id: 'transfer.button.confirm' })}
      </Button>
    </Flex>
  );
}
