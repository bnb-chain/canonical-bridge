import { Button, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useCallback, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { reportEvent } from '@/core/utils/gtm';

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
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const { address } = useAccount();

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isTransferable = useAppSelector((state) => state.transfer.isTransferable);
  const toToken = useAppSelector((state) => state.transfer.toToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const [isLoading, setIsLoading] = useState(false);

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: transferActionInfo?.bridgeAddress as `0x${string}`,
  });

  const isApproveNeeded =
    allowance !== null &&
    selectedToken?.decimals &&
    Number(sendValue) > Number(formatUnits(allowance, selectedToken?.decimals || 18)) &&
    transferActionInfo?.bridgeAddress !== selectedToken?.address &&
    selectedToken?.address !== '0x0000000000000000000000000000000000000000';

  const sendTx = useCallback(async () => {
    if (
      !walletClient ||
      !publicClient ||
      !selectedToken ||
      !address ||
      !transferActionInfo ||
      !transferActionInfo.bridgeType ||
      !transferActionInfo.bridgeAddress ||
      (allowance === null &&
        selectedToken?.address !== '0x0000000000000000000000000000000000000000')
    ) {
      return;
    }
    const handleFailure = (e: any) => {
      reportEvent({
        id: 'transaction_bridge_fail',
        params: {
          item_category: fromChain?.name,
          item_category2: toChain?.name,
          token: selectedToken.displaySymbol,
          value: sendValue,
          item_variant: transferActionInfo?.bridgeType,
          message: JSON.stringify(e.message || e),
          page_location: JSON.stringify(e.message || e),
        },
      });
      onOpenFailedModal();
    };

    try {
      setHash(null);
      setChosenBridge('');
      setIsLoading(true);
      if (
        allowance !== null &&
        Number(sendValue) > Number(formatUnits(allowance, selectedToken?.decimals)) &&
        transferActionInfo.bridgeAddress !== selectedToken?.address &&
        selectedToken?.address !== '0x0000000000000000000000000000000000000000' // doesn't need approve for OFT
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

        reportEvent({
          id: 'click_bridge_goal',
          params: {
            item_name: 'Approval',
          },
        });

        return;
      }
      onOpenConfirmingModal();

      reportEvent({
        id: 'click_bridge_goal',
        params: {
          item_name: 'Send',
        },
      });

      if (transferActionInfo.bridgeType === 'cBridge' && cBridgeArgs && fromChain) {
        try {
          const cBridgeHash = await bridgeSDK.cBridge.sendToken({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            walletClient: walletClient as any,
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
            reportEvent({
              id: 'transaction_bridge_success',
              params: {
                item_category: fromChain?.name,
                item_category2: toChain?.name,
                token: selectedToken.displaySymbol,
                value: sendValue,
                item_variant: 'cBridge',
              },
            });
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
          handleFailure(e);
        }
      } else if (transferActionInfo.bridgeType === 'deBridge' && transferActionInfo.value) {
        try {
          const deBridgeHash = await bridgeSDK.deBridge.sendToken({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            walletClient: walletClient as any,
            bridgeAddress: transferActionInfo.bridgeAddress as string,
            data: transferActionInfo.data as `0x${string}`,
            amount: BigInt(transferActionInfo.value),
            address,
          });
          await publicClient.waitForTransactionReceipt({
            hash: deBridgeHash,
          });
          if (deBridgeHash) {
            reportEvent({
              id: 'transaction_bridge_success',
              params: {
                item_category: fromChain?.name,
                item_category2: toChain?.name,
                token: selectedToken.displaySymbol,
                value: sendValue,
                item_variant: 'deBridge',
              },
            });
            onCloseConfirmingModal();
            setChosenBridge('deBridge');
            setHash(deBridgeHash);
            onOpenSubmittedModal();
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
          handleFailure(e);
        }
      } else if (transferActionInfo.bridgeType === 'stargate') {
        const stargateHash = await bridgeSDK.stargate.sendToken({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          walletClient: walletClient as any,
          publicClient,
          bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          tokenAddress: selectedToken.address as `0x${string}`,
          endPointId: toToken?.stargate?.raw?.endpointID as number,
          receiver: address,
          amount: parseUnits(sendValue, selectedToken.decimals),
        });
        if (stargateHash) {
          reportEvent({
            id: 'transaction_bridge_success',
            params: {
              item_category: fromChain?.name,
              item_category2: toChain?.name,
              token: selectedToken.displaySymbol,
              value: sendValue,
              item_variant: 'stargate',
            },
          });
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          walletClient: walletClient as any,
          publicClient,
        });
        if (layerZeroHash) {
          reportEvent({
            id: 'transaction_bridge_success',
            params: {
              item_category: fromChain?.name,
              item_category2: toChain?.name,
              token: selectedToken.displaySymbol,
              value: sendValue,
              item_variant: 'layerZero',
            },
          });
          onCloseConfirmingModal();
          setChosenBridge('layerZero');
          setHash(layerZeroHash);
          onOpenSubmittedModal();
        }
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e, e.message);
      handleFailure(e);
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

    toToken,
    fromChain,
    toChain,
  ]);

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
        onClick={sendTx}
        isDisabled={
          isLoading ||
          isGlobalFeeLoading ||
          !sendValue ||
          !Number(sendValue) ||
          !transferActionInfo ||
          !isTransferable
        }
      >
        {isApproveNeeded
          ? formatMessage({ id: 'transfer.button.approve' })
          : formatMessage({ id: 'transfer.button.confirm' })}
      </Button>
    </Flex>
  );
}
