/* eslint-disable no-console */
import { Button, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useState } from 'react';
import { useAccount, usePublicClient, useSignMessage, useWalletClient } from 'wagmi';
import { parseUnits } from 'viem';
import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useConnection, useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { reportEvent } from '@/core/utils/gtm';
import { useGetTronAllowance } from '@/modules/aggregator/adapters/meson/hooks/useGetTronAllowance';
import { useTronTransferInfo } from '@/modules/transfer/hooks/tron/useTronTransferInfo';
import { utf8ToHex } from '@/core/utils/string';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useWaitForTxReceipt } from '@/core/hooks/useWaitForTxReceipt';
import {
  CBRIDGE_ENDPOINT,
  DEBRIDGE_ENDPOINT,
  EVM_NATIVE_TOKEN_ADDRESS,
  MESON_ENDPOINT,
  STARGATE_ENDPOINT,
} from '@/core/constants';
import { useHandleTxFailure } from '@/modules/aggregator/hooks/useHandleTxFailure';
import { usePriceValidation } from '@/modules/transfer/hooks/usePriceValidation';

export const TransferConfirmButton = ({
  onClose,
  onOpenSubmittedModal,
  onOpenFailedModal,
  onOpenConfirmingModal,
  onCloseConfirmingModal,
  setHash,
  setChosenBridge,
}: {
  onClose: () => void;
  onOpenSubmittedModal: () => void;
  onOpenFailedModal: () => void;
  onOpenConfirmingModal: () => void;
  onCloseConfirmingModal: () => void;
  setHash: (hash: string | null) => void;
  setChosenBridge: (bridge: string | null) => void;
}) => {
  const { data: walletClient } = useWalletClient();
  const { args: cBridgeArgs } = useCBridgeTransferParams();
  const bridgeSDK = useBridgeSDK();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { validateTokenPrice } = usePriceValidation();

  const { address } = useAccount();
  const { address: tronAddress, signTransaction } = useTronWallet();
  const { isTronAvailableToAccount, isTronTransfer } = useTronTransferInfo();
  const { signMessageAsync } = useSignMessage();
  const { handleFailure } = useHandleTxFailure({ onOpenFailedModal });

  const { connection } = useConnection();
  const solanaWallet = useSolanaWallet();

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isTransferable = useAppSelector((state) => state.transfer.isTransferable);
  const toToken = useAppSelector((state) => state.transfer.toToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const toAccount = useAppSelector((state) => state.transfer.toAccount);

  const publicClient = usePublicClient({ chainId: fromChain?.id });
  const toPublicClient = usePublicClient({ chainId: toChain?.id });
  const [isLoading, setIsLoading] = useState(false);

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: transferActionInfo?.bridgeAddress as `0x${string}`,
  });

  const tronAllowance = useGetTronAllowance();
  const { isConnected: isEvmConnected } = useAccount();
  const { isConnected: isTronConnected } = useTronAccount();
  const { waitForTxReceipt } = useWaitForTxReceipt();

  const sendTx = async () => {
    if (
      !fromChain ||
      !selectedToken ||
      !transferActionInfo?.bridgeType ||
      (!transferActionInfo?.bridgeAddress && fromChain?.chainType !== 'solana') ||
      ((!walletClient ||
        !publicClient ||
        !address ||
        (allowance === null && selectedToken?.address !== EVM_NATIVE_TOKEN_ADDRESS) ||
        !isEvmConnected) &&
        fromChain?.chainType !== 'tron' &&
        fromChain?.chainType !== 'solana') ||
      ((!isTronConnected || !tronAddress || tronAllowance === null) &&
        fromChain?.chainType === 'tron')
    ) {
      return;
    }

    const bridgeType = transferActionInfo.bridgeType;

    try {
      const result = await validateTokenPrice({
        chainId: fromChain.id,
        chainType: fromChain.chainType,
        tokenAddress: selectedToken.address,
        tokenSymbol: selectedToken.symbol,
      });
      if (result === undefined) {
        throw new Error(
          `Can not get token price from API server: ${sendValue} ${selectedToken.symbol}`,
        );
      }

      setHash(null);
      setChosenBridge('');
      setIsLoading(true);

      onClose();
      onOpenConfirmingModal();

      reportEvent({
        id: 'click_bridge_goal',
        params: { item_name: 'Send' },
      });

      // cBridge
      const handleCBridge = async () => {
        if (!cBridgeArgs || !address || !walletClient || !publicClient) return;

        const isValidToken = await bridgeSDK.cBridge.validateCBridgeToken({
          isPegged: selectedToken.isPegged,
          fromChainId: fromChain.id,
          fromTokenAddress: selectedToken?.cBridge?.raw?.token.address as `0x${string}`,
          fromTokenSymbol: selectedToken?.cBridge?.raw?.token?.symbol as string,
          fromTokenDecimals: selectedToken.cBridge?.raw?.token.decimal as number,
          bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          toChainId: toChain?.id,
          toTokenAddress: toToken?.cBridge?.raw?.token.address as `0x${string}`,
          toTokenSymbol: toToken?.cBridge?.raw?.token.symbol,
          toTokenDecimals: toToken?.cBridge?.raw?.token.decimal as number,
          amount: Number(sendValue),
          cBridgeEndpoint: `${CBRIDGE_ENDPOINT}/v2/getTransferConfigsForAll`,
        });

        if (!isValidToken) {
          handleFailure({
            fromTokenAddress: selectedToken.address as `0x${string}`,
            bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
            fromChainId: fromChain.id,
            isPegged: selectedToken.isPegged,
            fromTokenSymbol: selectedToken.symbol,
            toChainId: toChain?.id,
            toTokenAddress: toToken?.cBridge?.raw?.token.address as `0x${string}`,
            toTokenSymbol: toToken?.cBridge?.raw?.token.symbol,
            decimals: selectedToken.decimals,
            amount: Number(sendValue),
            message: `(Token Validation Failed) - Invalid cBridge token!!`,
          });
          return;
        }

        const cBridgeHash = await bridgeSDK.cBridge.sendToken({
          walletClient,
          publicClient,
          bridgeAddress: transferActionInfo.bridgeAddress as string,
          fromChainId: fromChain.id,
          isPegged: selectedToken.isPegged,
          address,
          peggedConfig: selectedToken?.cBridge?.peggedConfig,
          args: cBridgeArgs.args,
        });

        await waitForTxReceipt({ publicClient, hash: cBridgeHash });

        if (cBridgeHash) {
          reportEvent({
            id: 'transaction_bridge_success',
            params: {
              item_category: fromChain.name,
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
      };

      // deBridge
      const handleDeBridge = async () => {
        let deBridgeHash: string | undefined;
        const isValidToken = await bridgeSDK.deBridge.validateDeBridgeToken({
          fromChainId: fromChain.id,
          toChainId: toChain?.id,
          fromTokenSymbol: selectedToken.deBridge?.raw?.symbol as string,
          fromTokenAddress: selectedToken.deBridge?.raw?.address as `0x${string}`,
          fromTokenDecimals: selectedToken.deBridge?.raw?.decimals as number,
          toTokenSymbol: toToken?.deBridge?.raw?.symbol,
          toTokenAddress: toToken?.deBridge?.raw?.address as `0x${string}`,
          toTokenDecimals: toToken?.deBridge?.raw?.decimals as number,
          amount: Number(sendValue),
          fromChainType: fromChain?.chainType,
          fromBridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          toChainType: toChain?.chainType,
          deBridgeEndpoint: DEBRIDGE_ENDPOINT,
        });

        if (!isValidToken) {
          handleFailure({
            message: '(Token Validation Failed) - Invalid deBridge token!!',
            fromChainId: fromChain?.id,
            tokenSymbol: selectedToken.symbol,
            tokenAddress: selectedToken.address as `0x${string}`,
          });
          return;
        }

        if (fromChain?.chainType === 'evm' && transferActionInfo.value && address && walletClient) {
          deBridgeHash = await bridgeSDK.deBridge.sendToken({
            walletClient,
            bridgeAddress: transferActionInfo.bridgeAddress as string,
            data: transferActionInfo.data as `0x${string}`,
            amount: BigInt(transferActionInfo.value),
            address,
          });
          await waitForTxReceipt({ publicClient, hash: deBridgeHash });
        } else if (fromChain?.chainType === 'solana') {
          const { blockhash } = await connection.getLatestBlockhash();
          const data = (transferActionInfo.data as string)?.slice(2);
          const tx = VersionedTransaction.deserialize(Buffer.from(data, 'hex'));
          tx.message.recentBlockhash = blockhash;
          deBridgeHash = await solanaWallet.sendTransaction(tx, connection);

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
      };

      // stargate
      const handleStargate = async () => {
        if (!address || !walletClient || !publicClient || !toPublicClient) return;

        const isValidToken = await bridgeSDK.stargate.validateStargateToken({
          fromBridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          toBridgeAddress: toToken?.stargate?.raw?.address as `0x${string}`,
          fromTokenAddress: selectedToken?.stargate?.raw?.token?.address as `0x${string}`,
          fromTokenSymbol: selectedToken?.stargate?.raw?.token?.symbol as string,
          fromTokenDecimals: selectedToken?.stargate?.raw?.token?.decimals as number,
          fromChainId: fromChain?.id,
          toTokenAddress: toToken?.stargate?.raw?.token?.address as `0x${string}`,
          toTokenSymbol: toToken?.stargate?.raw?.token?.symbol as string,
          toTokenDecimals: toToken?.stargate?.raw?.token?.decimals as number,
          toChainId: toChain?.id,
          amount: Number(sendValue),
          dstEndpointId: toToken?.stargate?.raw?.endpointID as number,
          toPublicClient,
          fromPublicClient: publicClient,
          stargateEndpoint: STARGATE_ENDPOINT,
        });

        if (!isValidToken) {
          handleFailure({
            messages: '(Token Validation Failed) - Invalid Stargate token!!',
            fromChainId: fromChain?.id,
            tokenAddress: selectedToken.address as `0x${string}`,
            bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
            tokenSymbol: selectedToken.symbol,
          });
          return;
        }

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
      };

      // layerZero
      const handleLayerZero = async () => {
        if (!address || !walletClient || !publicClient || !toPublicClient) return;

        const isValidToken = await bridgeSDK.layerZero.validateLayerZeroToken({
          fromPublicClient: publicClient,
          toPublicClient,
          bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          fromTokenAddress: selectedToken.layerZero?.raw?.address as `0x${string}`,
          fromTokenSymbol: selectedToken.layerZero?.raw?.symbol as string,
          fromTokenDecimals: selectedToken.layerZero?.raw?.decimals as number,
          toTokenAddress: toToken?.layerZero?.raw?.address as `0x${string}`,
          toTokenDecimals: toToken?.layerZero?.raw?.decimals as number,
          toTokenSymbol: toToken?.layerZero?.raw?.symbol as string,
          toBridgeAddress: toToken?.layerZero?.raw?.bridgeAddress as `0x${string}`,
          dstEndpoint: toToken?.layerZero?.raw?.endpointID as number,
          amount: Number(sendValue),
        });

        if (!isValidToken) {
          handleFailure({
            messages: '(Token Validation Failed) - Invalid LayerZero token!!',
            fromChainId: fromChain?.id,
            tokenAddress: selectedToken.layerZero?.raw?.address as `0x${string}`,
            bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
            tokenSymbol: selectedToken.symbol,
          });
          return;
        }

        const layerZeroHash = await bridgeSDK.layerZero.sendToken({
          bridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          dstEndpoint: toToken?.layerZero?.raw?.endpointID as number,
          userAddress: address,
          amount: parseUnits(sendValue, selectedToken.decimals),
          walletClient,
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
      };

      // meson
      const handleMeson = async () => {
        let fromAddress = '';
        let toAddress = '';

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

        const isValidToken = await bridgeSDK.meson.validateMesonToken({
          fromChainId: fromChain?.id,
          toChainId: toChain?.id,
          fromTokenAddress:
            selectedToken.meson?.raw?.addr ?? '0x0000000000000000000000000000000000000000',
          fromTokenSymbol: selectedToken.meson?.raw?.id as string,
          fromTokenDecimals: selectedToken.meson?.raw?.decimals as number,
          fromChainType: fromChain?.chainType,
          toChainType: toChain?.chainType,
          toTokenAddress: toToken?.meson?.raw?.addr ?? '0x0000000000000000000000000000000000000000',
          toTokenSymbol: toToken?.meson?.raw?.id,
          toTokenDecimals: toToken?.meson?.raw?.decimals,
          amount: Number(sendValue),
          mesonEndpoint: MESON_ENDPOINT,
        });

        if (!isValidToken) {
          handleFailure({
            message: '(Token Validation Failed) Invalid Meson token!!',
            fromChainId: fromChain?.id,
            tokenAddress: selectedToken.address as `0x${string}`,
            tokenSymbol: selectedToken.symbol,
          });
          return;
        }

        const unsignedMessage = await bridgeSDK.meson.getUnsignedMessage({
          fromToken: `${fromChain?.meson?.raw?.id}:${selectedToken?.meson?.raw?.id}`,
          toToken: `${toChain?.meson?.raw?.id}:${toToken?.meson?.raw?.id}`,
          amount: sendValue,
          fromAddress,
          recipient: toAddress,
        });

        if (unsignedMessage?.result) {
          const result = unsignedMessage.result;
          const encodedData = result.encoded;
          const message = result.signingRequest.message;

          let msg = '';
          if (fromChain?.chainType === 'tron') {
            const hexTronHeader = utf8ToHex('\x19TRON Signed Message:\n32');
            msg = message.replace(hexTronHeader, '');
          } else {
            const hexEthHeader = utf8ToHex('\x19Ethereum Signed Message:\n52');
            msg = message.replace(hexEthHeader, '');
          }

          let signature = '';
          if (fromChain?.chainType !== 'tron') {
            signature = await signMessageAsync({
              account: address!,
              message: { raw: msg as `0x${string}` },
            });
          } else {
            signature = String(await signTransaction(msg as any));
          }

          const swapId = await bridgeSDK.meson.sendToken({
            fromAddress,
            recipient: toAddress,
            signature,
            encodedData,
          });

          // eslint-disable-next-line no-console
          console.log('Meson swap id', swapId);
          if (swapId?.result?.swapId) {
            setChosenBridge('meson');
            setHash(swapId.result.swapId);
          }
          if (swapId?.error) {
            throw new Error(swapId.error.message);
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
      };

      // mayan
      const handleMayan = async () => {
        let mayanBridgeHash: string | undefined;
        const isValidToken = await bridgeSDK.mayan.validateMayanToken({
          fromChainNameId: fromChain.mayan?.raw?.nameId,
          toChainNameId: toChain?.mayan?.raw?.nameId,
          fromTokenSymbol: selectedToken.mayan?.raw?.symbol as string,
          fromTokenAddress: selectedToken.mayan?.raw?.contract as `0x${string}`,
          fromTokenDecimals: selectedToken.mayan?.raw?.decimals as number,
          toTokenSymbol: toToken?.mayan?.raw?.symbol,
          toTokenAddress: toToken?.mayan?.raw?.contract as `0x${string}`,
          toTokenDecimals: toToken?.mayan?.raw?.decimals as number,
          amount: Number(sendValue),
          fromChainType: fromChain?.chainType,
          fromBridgeAddress: transferActionInfo.bridgeAddress as `0x${string}`,
          toChainType: toChain?.chainType,
        });

        if (!isValidToken) {
          handleFailure({
            message: '(Token Validation Failed) - Invalid mayan token!!',
            fromChainId: fromChain?.id,
            tokenSymbol: selectedToken.symbol,
            tokenAddress: selectedToken.address as `0x${string}`,
          });
          return;
        }

        const quote = transferActionInfo.quote;

        if (fromChain?.chainType === 'evm' && quote && address && walletClient && publicClient) {
          let toAddress = '';
          if (toChain?.chainType === 'solana' && toAccount?.address) {
            toAddress = toAccount.address;
          } else if (address) {
            toAddress = address;
          }
          mayanBridgeHash = await bridgeSDK.mayan.swapEVM(
            quote,
            walletClient,
            publicClient,
            address,
            toAddress,
            fromChain.id,
          );
        } else if (fromChain?.chainType === 'solana' && quote) {
          mayanBridgeHash = await bridgeSDK.mayan.swapSolana(
            quote,
            connection,
            solanaWallet,
            toAccount.address as string,
          );
        }

        if (mayanBridgeHash) {
          reportEvent({
            id: 'transaction_bridge_success',
            params: {
              item_category: fromChain?.name,
              item_category2: toChain?.name,
              token: selectedToken.displaySymbol,
              value: sendValue,
              item_variant: 'mayan',
            },
          });
          onCloseConfirmingModal();
          setChosenBridge('mayan');
          setHash(mayanBridgeHash);
          onOpenSubmittedModal();
        }
      };

      if (bridgeType === 'cBridge') {
        await handleCBridge();
      } else if (bridgeType === 'deBridge') {
        await handleDeBridge();
      } else if (bridgeType === 'stargate') {
        await handleStargate();
      } else if (bridgeType === 'layerZero') {
        await handleLayerZero();
      } else if (bridgeType === 'meson') {
        await handleMeson();
      } else if (bridgeType === 'mayan') {
        await handleMayan();
      }
    } catch (e: any) {
      console.error(e, e.message);
      handleFailure(e);
    } finally {
      onCloseConfirmingModal();
      setIsLoading(false);
    }
  };

  const isFeeLoading = isLoading || isGlobalFeeLoading || !transferActionInfo || !isTransferable;

  return (
    <Flex className={`bccb-widget-transfer-summary-button`} flexDir="column" w={'100%'} mt={'24px'}>
      <Button
        bg={theme.colors[colorMode].button.brand.default}
        size={'lg'}
        fontWeight={500}
        h={'44px'}
        w="100%"
        _hover={{
          bg: theme.colors[colorMode].button.brand.hover,
          _disabled: { bg: theme.colors[colorMode].button.disabled },
        }}
        onClick={sendTx}
        isDisabled={isFeeLoading}
      >
        {formatMessage({
          id: isFeeLoading ? 'transfer.button.confirm-loading' : 'transfer.button.confirm-summary',
        })}
      </Button>
    </Flex>
  );
};
