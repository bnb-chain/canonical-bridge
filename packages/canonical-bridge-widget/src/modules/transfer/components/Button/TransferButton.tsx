import { Button, ButtonProps, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useCallback, useState } from 'react';
import { useAccount, useBalance, usePublicClient, useWalletClient } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

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
  const bridgeSDK = useBridgeSDK();

  const { address } = useAccount();

  const { data: balance } = useBalance({ address: address as `0x${string}` });

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isTransferable = useAppSelector((state) => state.transfer.isTransferable);
  const toToken = useAppSelector((state) => state.transfer.toToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
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
      if (
        Number(sendValue) > Number(formatUnits(allowance, selectedToken?.decimals)) &&
        transferActionInfo.bridgeAddress !== selectedToken?.address // doesn't need approve for OFT
      ) {
        // eslint-disable-next-line no-console
        console.log(
          'sendValue',
          sendValue,
          'allowance',
          allowance,
          'selectedToken?.decimal',
          selectedToken?.decimals,
        );
        onOpenApproveModal();
        return;
      }
      onOpenConfirmingModal();
      if (transferActionInfo.bridgeType === 'cBridge' && cBridgeArgs && fromChain) {
        try {
          const cBridgeHash = await bridgeSDK.cBridge.sendToken({
            walletClient,
            publicClient,
            bridgeAddress: transferActionInfo.bridgeAddress as string,
            fromChainId: fromChain?.id,
            isPegged: selectedToken.isPegged,
            address,
            peggedConfig: selectedToken?.cBridge?.peggedConfig,
            args: cBridgeArgs.args,
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
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
          onOpenFailedModal();
        }
      } else if (transferActionInfo.bridgeType === 'deBridge' && transferActionInfo.value) {
        try {
          if (balance && balance?.value < BigInt(transferActionInfo.value)) {
            throw new Error('Could not cover deBridge Protocol Fee. Insufficient balance.');
          }
          const deBridgeHash = await bridgeSDK.deBridge.sendToken({
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
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
          onOpenFailedModal();
        }
      } else if (transferActionInfo.bridgeType === 'stargate') {
        const stargateHash = await bridgeSDK.stargate.sendToken({
          walletClient,
          publicClient,
          bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          tokenAddress: selectedToken.address as `0x${string}`,
          endPointId: toToken?.stargate?.raw?.endpointID as number,
          receiver: address,
          amount: parseUnits(sendValue, selectedToken.decimals),
        });
        if (stargateHash) {
          onCloseConfirmingModal();
          setChosenBridge('stargate');
          setHash(stargateHash);
          onOpenSubmittedModal();
        }
      } else if (transferActionInfo.bridgeType === 'layerZero') {
        const layerZeroHash = await bridgeSDK.layerZero.sendToken({
          bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          dstEndpoint: toToken?.layerZero?.raw?.endpointID as number,
          userAddress: address,
          amount: parseUnits(sendValue, selectedToken.decimals),
          walletClient,
          publicClient,
        });
        if (layerZeroHash) {
          onCloseConfirmingModal();
          setChosenBridge('layerZero');
          setHash(layerZeroHash);
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
    bridgeSDK,

    onOpenApproveModal,
    onCloseConfirmingModal,
    onOpenSubmittedModal,
    onOpenFailedModal,
    balance,
    toToken,
    fromChain,
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
  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <Flex flexDir="column" w={'100%'}>
      <Button
        bg={theme.colors[colorMode].button.brand.default}
        size={'lg'}
        fontWeight={500}
        h={'56px'}
        w="100%"
        _hover={{
          bg: theme.colors[colorMode].button.brand.hover,
          _disabled: { bg: theme.colors[colorMode].button.disabled },
        }}
        {...restProps}
      >
        {formatMessage({ id: 'transfer.button.confirm' })}
      </Button>
    </Flex>
  );
}
