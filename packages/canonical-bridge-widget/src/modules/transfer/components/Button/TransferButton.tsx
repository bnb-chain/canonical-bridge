/* eslint-disable no-console */
import { Button, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useCallback, useState } from 'react';
import { useAccount, useBytecode, usePublicClient, useWalletClient } from 'wagmi';
import { formatUnits } from 'viem';
import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { reportEvent } from '@/core/utils/gtm';
import { useGetTronAllowance } from '@/modules/aggregator/adapters/meson/hooks/useGetTronAllowance';
import { useTronTransferInfo } from '@/modules/transfer/hooks/tron/useTronTransferInfo';
import { useTronContract } from '@/modules/aggregator/adapters/meson/hooks/useTronContract';
import { useSolanaTransferInfo } from '@/modules/transfer/hooks/solana/useSolanaTransferInfo';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useHandleTxFailure } from '@/modules/aggregator/hooks/useHandleTxFailure';

export function TransferButton({
  onOpenFailedModal,
  onOpenApproveModal,
  onOpenSummaryModal,
  onCloseConfirmingModal,
  setChosenBridge,
}: {
  onOpenFailedModal: () => void;
  onOpenApproveModal: () => void;
  onOpenSummaryModal: () => void;
  onCloseConfirmingModal: () => void;

  setChosenBridge: (bridge: string | null) => void;
}) {
  const { data: walletClient } = useWalletClient();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const { address } = useAccount();
  const { address: tronAddress } = useTronWallet();
  const { isTronAvailableToAccount, isTronTransfer } = useTronTransferInfo();

  const { isSolanaTransfer, isSolanaAvailableToAccount } = useSolanaTransferInfo();

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isTransferable = useAppSelector((state) => state.transfer.isTransferable);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const toAccount = useAppSelector((state) => state.transfer.toAccount);
  const toToken = useAppSelector((state) => state.transfer.toToken);
  const toTokens = useAppSelector((state) => state.transfer.toTokens);
  const isToAddressChecked = useAppSelector((state) => state.transfer.isToAddressChecked);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const [isLoading, setIsLoading] = useState(false);

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: transferActionInfo?.bridgeAddress as `0x${string}`,
  });
  const { isTronContract } = useTronContract();
  const { data: evmBytecode } = useBytecode({
    address: toAccount.address as `0x${string}`,
    chainId: toChain?.id,
  });

  const { handleFailure } = useHandleTxFailure({ onOpenFailedModal });

  const tronAllowance = useGetTronAllowance();
  const { isConnected: isEvmConnected } = useAccount();
  const { isConnected: isTronConnected } = useTronAccount();

  const isApproveNeeded =
    (fromChain?.chainType === 'evm' &&
      allowance !== null &&
      selectedToken?.decimals &&
      Number(sendValue) > Number(formatUnits(allowance, selectedToken?.decimals || 18)) &&
      transferActionInfo?.bridgeAddress !== selectedToken?.address &&
      selectedToken?.address !== '0x0000000000000000000000000000000000000000') ||
    (fromChain?.chainType === 'tron' &&
      tronAllowance !== null &&
      Number(sendValue) >
        Number(formatUnits(tronAllowance, selectedToken?.meson?.raw?.decimals || 6))) ||
    (fromChain?.chainType === 'solana' && false);

  const onConfirmSummary = useCallback(async () => {
    if (
      !selectedToken ||
      !transferActionInfo?.bridgeType ||
      (!transferActionInfo?.bridgeAddress && fromChain?.chainType !== 'solana') ||
      ((!walletClient ||
        !publicClient ||
        !address ||
        (allowance === null &&
          selectedToken?.address !== '0x0000000000000000000000000000000000000000') ||
        !isEvmConnected) &&
        fromChain?.chainType !== 'tron' &&
        fromChain?.chainType !== 'solana') ||
      ((!isTronConnected || !tronAddress || tronAllowance === null) &&
        fromChain?.chainType === 'tron')
    ) {
      return;
    }
    try {
      setChosenBridge('');
      setIsLoading(true);
      if (
        isApproveNeeded &&
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
      onOpenSummaryModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e, e.message);
      handleFailure(e);
    } finally {
      onCloseConfirmingModal();
      setIsLoading(false);
    }
  }, [
    selectedToken,
    transferActionInfo?.bridgeType,
    transferActionInfo?.bridgeAddress,
    fromChain,
    walletClient,
    publicClient,
    address,
    allowance,
    isEvmConnected,
    isTronConnected,
    tronAddress,
    tronAllowance,
    sendValue,

    setChosenBridge,
    isApproveNeeded,
    onOpenSummaryModal,
    onOpenApproveModal,
    onCloseConfirmingModal,
    handleFailure,
  ]);

  const isDisabled =
    isLoading ||
    isGlobalFeeLoading ||
    !sendValue ||
    !Number(sendValue) ||
    !transferActionInfo ||
    !isTransferable ||
    (isTronTransfer && (!isToAddressChecked || !toAccount?.address || !isTronAvailableToAccount)) ||
    isTronContract === true ||
    !!evmBytecode ||
    (isSolanaTransfer &&
      (!isToAddressChecked || !toAccount.address || !isSolanaAvailableToAccount)) ||
    (toTokens.length > 1 && !toToken);

  return (
    <Flex
      className={`bccb-widget-transfer-button` + `${isDisabled ? ' disabled' : ''}`}
      flexDir="column"
      w={'100%'}
    >
      <Button
        className={isDisabled ? 'disabled' : ''}
        bg={theme.colors[colorMode].button.brand.default}
        size={'lg'}
        fontWeight={500}
        h={'56px'}
        w="100%"
        _hover={{
          bg: theme.colors[colorMode].button.brand.hover,
          _disabled: { bg: theme.colors[colorMode].button.disabled },
        }}
        onClick={onConfirmSummary}
        isDisabled={isDisabled}
      >
        {isApproveNeeded
          ? formatMessage({ id: 'transfer.button.approve' })
          : formatMessage({ id: 'transfer.button.confirm' })}
      </Button>
    </Flex>
  );
}
