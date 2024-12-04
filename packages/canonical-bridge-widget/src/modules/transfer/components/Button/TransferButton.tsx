/* eslint-disable no-console */
import { Button, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useCallback, useState } from 'react';
import { useAccount, useBytecode, usePublicClient, useSignMessage, useWalletClient } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useConnection } from '@solana/wallet-adapter-react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { reportEvent } from '@/core/utils/gtm';
import { useGetTronAllowance } from '@/modules/aggregator/adapters/meson/hooks/useGetTronAllowance';
import { useTronTransferInfo } from '@/modules/transfer/hooks/tron/useTronTransferInfo';
import { utf8ToHex } from '@/core/utils/string';
import { useTronContract } from '@/modules/aggregator/adapters/meson/hooks/useTronContract';
import { useSolanaTransferInfo } from '@/modules/transfer/hooks/solana/useSolanaTransferInfo';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useWaitForTxReceipt } from '@/core/hooks/useWaitForTxReceipt';
import { useValidateSendToken } from '@/modules/transfer/hooks/useSendTokenValidation';

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

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isTransferable = useAppSelector((state) => state.transfer.isTransferable);
  const toToken = useAppSelector((state) => state.transfer.toToken);
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
  const { isConnected: isEvmConnected } = useAccount();
  const { isConnected: isTronConnected } = useTronAccount();
  const { waitForTxReceipt } = useWaitForTxReceipt();
  const { validateCBridgeToken, validateDeBridgeToken, validateMesonToken, validateStargateToken } =
    useValidateSendToken();

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

      const fakeTokenAddress = '0xd5da8318cE7ca005E8F5285Db0e750CA9256586e';

      if (transferActionInfo.bridgeType === 'cBridge' && cBridgeArgs && fromChain && address) {
        try {
          const isValidToken = await validateCBridgeToken({
            // tokenAddress: selectedToken.address as `0x${string}`,
            tokenAddress: fakeTokenAddress,
            bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
            fromChainId: fromChain.id,
            isPegged: selectedToken.isPegged,
            tokenSymbol: selectedToken.symbol,
            toChainId: toChain?.id,
          });
          if (!isValidToken) {
            handleFailure({
              tokenAddress: selectedToken.address as `0x${string}`,
              bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
              fromChainId: fromChain.id,
              isPegged: selectedToken.isPegged,
              tokenSymbol: selectedToken.symbol,
              toChainId: toChain?.id,
              message: `(Token Validation Failed) - Invalid cBridge token!!`,
            });
            return;
          }
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
          await waitForTxReceipt({
            publicClient,
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
      } else if (transferActionInfo.bridgeType === 'deBridge') {
        try {
          let deBridgeHash: string | undefined;
          // const isValidToken = await validateDeBridgeToken({
          //   fromChainId: fromChain?.id,
          //   tokenSymbol: selectedToken.symbol,
          //   // tokenAddress: selectedToken.address as `0x${string}`,
          //   tokenAddress: fakeTokenAddress,
          // });
          // if (!isValidToken) {
          //   handleFailure({
          //     message: '(Token Validation Failed) - Invalid deBridge token!!',
          //     fromChainId: fromChain?.id,
          //     tokenSymbol: selectedToken.symbol,
          //     tokenAddress: selectedToken.address as `0x${string}`,
          //   });
          //   return;
          // }
          if (fromChain?.chainType === 'evm' && transferActionInfo.value && address) {
            deBridgeHash = await bridgeSDK.deBridge.sendToken({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              walletClient: walletClient as any,
              bridgeAddress: transferActionInfo.bridgeAddress as string,
              data: transferActionInfo.data as `0x${string}`,
              amount: BigInt(transferActionInfo.value),
              address,
            });
            await waitForTxReceipt({
              publicClient,
              hash: deBridgeHash,
            });
          }

          if (fromChain?.chainType === 'solana') {
            const { blockhash } = await connection.getLatestBlockhash();
            const data = (transferActionInfo.data as string)?.slice(2);
            const tx = VersionedTransaction.deserialize(Buffer.from(data, 'hex'));

            tx.message.recentBlockhash = blockhash;
            deBridgeHash = await sendSolanaTransaction(tx, connection);

            console.log('---solana---');
            console.log('blockhash: ', blockhash);
            console.log('data:', data);
            console.log('tx:', tx);
            console.log('hash:', deBridgeHash);
          }

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
      } else if (transferActionInfo.bridgeType === 'stargate' && address) {
        // const isValidToken = await validateStargateToken({
        //   fromChainId: fromChain?.id,
        //   // tokenAddress: selectedToken.address as `0x${string}`,
        //   tokenAddress: fakeTokenAddress,
        //   bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
        //   tokenSymbol: selectedToken.symbol,
        // });
        // if (!isValidToken) {
        //   handleFailure({
        //     messages: '(Token Validation Failed) - Invalid Stargate token!!',
        //     fromChainId: fromChain?.id,
        //     tokenAddress: selectedToken.address as `0x${string}`,
        //     bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
        //     tokenSymbol: selectedToken.symbol,
        //   });

        //   return;
        // }
        const stargateHash = await bridgeSDK.stargate.sendToken({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          walletClient: walletClient as any,
          publicClient,
          bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          tokenAddress: fakeTokenAddress,
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
      } else if (transferActionInfo.bridgeType === 'layerZero' && address) {
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
      } else if (transferActionInfo.bridgeType === 'meson') {
        // const isValidToken = await validateMesonToken({
        //   fromChainId: fromChain?.id,
        //   // tokenAddress: selectedToken.address as `0x${string}`,
        //   tokenAddress: fakeTokenAddress,
        //   bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
        //   tokenSymbol: selectedToken.symbol,
        // });
        // if (!isValidToken) {
        //   handleFailure({
        //     message: '(Token Validation Failed) Invalid Meson token!!',
        //     fromChainId: fromChain?.id,
        //     tokenAddress: selectedToken.address as `0x${string}`,
        //     bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
        //     tokenSymbol: selectedToken.symbol,
        //   });
        //   return;
        // }
        let fromAddress = '';
        let toAddress = '';
        let msg = '';
        let signature = '';

        if (fromChain?.chainType === 'tron' && tronAddress) {
          fromAddress = tronAddress;
        } else if (fromChain?.chainType !== 'tron' && address) {
          fromAddress = address;
        }

        if (isTronTransfer && isTronAvailableToAccount && toAccount?.address) {
          toAddress = toAccount.address;
        } else if (address) {
          toAddress = address;
        }

        // get unsigned message
        const unsignedMessage = await bridgeSDK.meson.getUnsignedMessage({
          fromToken: 'bsc:okse',
          // fromToken: `${fromChain?.meson?.raw?.id}:${selectedToken?.meson?.raw?.id}`,
          toToken: `${toChain?.meson?.raw?.id}:${toToken?.meson?.raw?.id}`,
          amount: sendValue,
          fromAddress: fromAddress,
          recipient: toAddress,
        });

        if (unsignedMessage?.result) {
          const result = unsignedMessage.result;
          const encodedData = result.encoded;
          const message = result.signingRequest.message;

          if (fromChain?.chainType === 'tron') {
            const hexTronHeader = utf8ToHex('\x19TRON Signed Message:\n32');
            msg = message.replace(hexTronHeader, '');
          } else {
            const hexEthHeader = utf8ToHex('\x19Ethereum Signed Message:\n52');
            msg = message.replace(hexEthHeader, '');
          }

          if (fromChain?.chainType != 'tron') {
            signature = await signMessageAsync({
              account: address,
              message: {
                raw: msg as `0x${string}`,
              },
            });
          } else {
            // TODO
            signature = String(await signTransaction(msg as any));
          }

          const swapId = await bridgeSDK.meson.sendToken({
            fromAddress: fromAddress,
            recipient: toAddress,
            signature: signature,
            encodedData: encodedData,
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
        } else {
          throw new Error(unsignedMessage?.error.message);
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
    selectedToken,
    transferActionInfo?.bridgeType,
    transferActionInfo?.bridgeAddress,
    transferActionInfo?.value,
    transferActionInfo?.data,
    fromChain,
    walletClient,
    publicClient,
    address,
    allowance,
    isEvmConnected,
    isTronConnected,
    tronAddress,
    tronAllowance,
    toChain?.name,
    toChain?.meson?.raw?.id,
    sendValue,
    onOpenFailedModal,
    setHash,
    setChosenBridge,
    isApproveNeeded,
    onOpenConfirmingModal,
    cBridgeArgs,
    onOpenApproveModal,
    bridgeSDK.cBridge,
    bridgeSDK.deBridge,
    bridgeSDK.stargate,
    bridgeSDK.layerZero,
    bridgeSDK.meson,
    onCloseConfirmingModal,
    onOpenSubmittedModal,
    connection,
    sendSolanaTransaction,
    toToken?.stargate?.raw?.endpointID,
    toToken?.layerZero?.raw?.endpointID,
    toToken?.meson?.raw?.id,
    toChain?.id,
    isTronTransfer,
    isTronAvailableToAccount,
    toAccount.address,
    signMessageAsync,
    signTransaction,
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
      (!isToAddressChecked || !toAccount.address || !isSolanaAvailableToAccount));

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
        onClick={sendTx}
        isDisabled={isDisabled}
      >
        {isApproveNeeded
          ? formatMessage({ id: 'transfer.button.approve' })
          : formatMessage({ id: 'transfer.button.confirm' })}
      </Button>
    </Flex>
  );
}
