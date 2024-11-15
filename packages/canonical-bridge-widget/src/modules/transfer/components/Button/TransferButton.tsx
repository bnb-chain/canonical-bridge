import { Button, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useCallback, useState } from 'react';
import { useAccount, useBytecode, usePublicClient, useSignMessage, useWalletClient } from 'wagmi';
import { formatUnits } from 'viem';
import { useTronWallet } from '@node-real/walletkit/tron';
import { useConnection } from '@solana/wallet-adapter-react';
import { useSolanaWallet } from '@node-real/walletkit/solana';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { reportEvent } from '@/core/utils/gtm';
import { useGetTronAllowance } from '@/modules/aggregator/adapters/meson/hooks/useGetTronAllowance';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';
import { useTronTransferInfo } from '@/modules/transfer/hooks/tron/useTronTransferInfo';
import { useTronContract } from '@/modules/aggregator/adapters/meson/hooks/useTronContract';
import { useSolanaTransferInfo } from '@/modules/transfer/hooks/solana/useSolanaTransferInfo';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';

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
  const { address: tronAddress, signTransaction } = useTronWallet();
  const { isTronAvailableToAccount, isTronTransfer } = useTronTransferInfo();
  const { signMessageAsync } = useSignMessage();

  const { isSolanaTransfer, isSolanaAvailableToAccount } = useSolanaTransferInfo();
  const { connection } = useConnection();
  const { sendTransaction: sendSolanaTransaction } = useSolanaWallet();
  const { address: solanaAddress } = useSolanaAccount();

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isTransferable = useAppSelector((state) => state.transfer.isTransferable);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const toAccount = useAppSelector((state) => state.transfer.toAccount);
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

  const tronAllowance = useGetTronAllowance();
  const { isTronConnected, isEvmConnected } = useCurrentWallet();

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

  const sendTx = useCallback(async () => {
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
      onOpenConfirmingModal();

      reportEvent({
        id: 'click_bridge_goal',
        params: {
          item_name: 'Send',
        },
      });

      if (transferActionInfo.bridgeType === 'cBridge' && cBridgeArgs && fromChain && address) {
        const { hash: cBridgeHash } = await bridgeSDK.sendToken({
          bridgeType: 'cBridge',
          publicClient,
          walletClient: walletClient as any,
          fromChainId: fromChain.id,
          toChainId: toChain!.id,
          tokenAddress: selectedToken.address,
          userAddress: address,
          sendValue,
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
      } else if (transferActionInfo.bridgeType === 'deBridge') {
        const userAddress = (fromChain?.chainType === 'solana' ? solanaAddress : address) as string;
        const toUserAddress =
          fromChain?.chainType === 'solana' || toChain?.chainType === 'solana'
            ? toAccount?.address
            : undefined;

        const { hash: deBridgeHash } = await bridgeSDK.sendToken({
          bridgeType: 'deBridge',
          publicClient,
          walletClient: walletClient as any,
          fromChainId: fromChain!.id,
          toChainId: toChain!.id,
          tokenAddress: selectedToken.address,
          userAddress,
          toUserAddress,
          sendValue,
          solanaOpts: {
            connection,
            sendTransaction: sendSolanaTransaction,
          },
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
      } else if (transferActionInfo.bridgeType === 'stargate' && address) {
        const { hash: stargateHash } = await bridgeSDK.sendToken({
          bridgeType: 'stargate',
          publicClient,
          walletClient: walletClient as any,
          fromChainId: fromChain!.id,
          toChainId: toChain!.id,
          tokenAddress: selectedToken.address,
          userAddress: address as string,
          sendValue,
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
      } else if (transferActionInfo.bridgeType === 'layerZero' && address) {
        const { hash: layerZeroHash } = await bridgeSDK.sendToken({
          bridgeType: 'layerZero',
          publicClient,
          walletClient: walletClient as any,
          fromChainId: fromChain!.id,
          toChainId: toChain!.id,
          tokenAddress: selectedToken.address,
          userAddress: address as string,
          sendValue,
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
      } else if (transferActionInfo.bridgeType === 'meson') {
        let userAddress = '';
        let toUserAddress = '';

        if (fromChain?.chainType === 'tron' && tronAddress) {
          userAddress = tronAddress;
        } else if (fromChain?.chainType !== 'tron' && address) {
          userAddress = address;
        }

        if (isTronTransfer && isTronAvailableToAccount && toAccount?.address) {
          toUserAddress = toAccount.address;
        } else if (address) {
          toUserAddress = address;
        }

        const { swapId } = await bridgeSDK.sendToken({
          bridgeType: 'meson',
          publicClient,
          walletClient: walletClient as any,
          fromChainId: fromChain!.id,
          toChainId: toChain!.id,
          tokenAddress: selectedToken.address,
          userAddress,
          toUserAddress,
          sendValue,
          mesonOpts: {
            signTransaction: async (message) => {
              return String(await signTransaction(message as any));
            },
            signMessage: async (message) => {
              return await signMessageAsync({
                account: userAddress as `0x${string}`,
                message: {
                  raw: message as `0x${string}`,
                },
              });
            },
          },
        });
        // eslint-disable-next-line no-console
        console.log(swapId);
        if (swapId?.result?.swapId) {
          setChosenBridge('meson');
          setHash(swapId?.result?.swapId);
        }
        if (swapId?.error) {
          throw new Error(swapId?.error.message);
        }

        reportEvent({
          id: 'transaction_bridge_success',
          params: {
            item_category: fromChain?.name,
            item_category2: toChain?.name,
            token: selectedToken.displaySymbol,
            value: sendValue,
            item_variant: 'meson',
          },
        });

        onCloseConfirmingModal();
        onOpenSubmittedModal();
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
    toChain,
    sendValue,
    onOpenFailedModal,
    setHash,
    setChosenBridge,
    isApproveNeeded,
    onOpenConfirmingModal,
    cBridgeArgs,
    onOpenApproveModal,
    bridgeSDK,
    onCloseConfirmingModal,
    onOpenSubmittedModal,
    solanaAddress,
    toAccount.address,
    connection,
    sendSolanaTransaction,
    isTronTransfer,
    isTronAvailableToAccount,
    signTransaction,
    signMessageAsync,
  ]);

  return (
    <Flex className="bccb-widget-transfer-button" flexDir="column" w={'100%'}>
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
          !isTransferable ||
          (isTronTransfer &&
            (!isToAddressChecked || !toAccount?.address || !isTronAvailableToAccount)) ||
          isTronContract === true ||
          !!evmBytecode ||
          (isSolanaTransfer &&
            (!isToAddressChecked || !toAccount.address || !isSolanaAvailableToAccount))
        }
      >
        {isApproveNeeded
          ? formatMessage({ id: 'transfer.button.approve' })
          : formatMessage({ id: 'transfer.button.confirm' })}
      </Button>
    </Flex>
  );
}
