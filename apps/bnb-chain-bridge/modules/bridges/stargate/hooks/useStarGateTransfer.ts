import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useCallback } from 'react';
import { parseUnits } from 'viem';

import { STARGATE_POOL } from '@/modules/bridges/stargate/abi/stargatePool';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { setEstimatedAmount, setReceiveValue } from '@/modules/transfer/action';
import { toObject } from '@/core/utils/string';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY, DEFAULT_ADDRESS } from '@/core/constants';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useStarGateTransferParams } from '@/modules/bridges/stargate/hooks/useStarGateTransferParams';
import { stargateInstance } from '@/modules/bridges/stargate/sdk-instance';

export const useStarGateTransfer = () => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const dispatch = useAppDispatch();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const { toTokenInfo } = useToTokenInfo();

  const publicClient = usePublicClient({ chainId: fromChain?.id });
  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  const { args } = useStarGateTransferParams();

  const getQuoteOFT = useCallback(async () => {
    if (
      !args ||
      !fromChain ||
      !toChain ||
      !selectedToken ||
      !debouncedSendValue ||
      !Number(debouncedSendValue) ||
      !toTokenInfo ||
      !publicClient
    ) {
      return;
    }
    try {
      const bridgeAddress = selectedToken.rawData.stargate?.bridgeAddress as `0x${string}`;

      const quoteOFTResponse = await stargateInstance.getQuoteOFT({
        publicClient: publicClient,
        bridgeAddress,
        endPointId: args.dstEid,
        receiver: address || DEFAULT_ADDRESS,
        amount: parseUnits(debouncedSendValue, selectedToken.decimal),
      });

      dispatch(setEstimatedAmount({ stargate: toObject(quoteOFTResponse) }));
      if (Number(quoteOFTResponse?.[2].amountReceivedLD) > 0) {
        dispatch(
          setReceiveValue({
            stargate: String(quoteOFTResponse?.[2].amountReceivedLD),
          }),
        );
      } else {
        dispatch(
          setReceiveValue({
            stargate: undefined,
          }),
        );
      }
      return { quoteOFT: quoteOFTResponse };
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error, error.message);
      dispatch(setEstimatedAmount({ stargate: undefined }));
    }
  }, [
    args,
    fromChain,
    toChain,
    selectedToken,
    debouncedSendValue,
    toTokenInfo,
    dispatch,
    publicClient,
    address,
  ]);

  const sendToken = useCallback(
    async ({ onOpenFailedModal }: { onOpenFailedModal: () => void }) => {
      if (!address || !estimatedAmount?.stargate || !args || !selectedToken || !publicClient)
        return;
      try {
        const bridgeAddress = selectedToken.rawData.stargate?.bridgeAddress as `0x${string}`;
        const amountReceivedLD = estimatedAmount?.stargate[2].amountReceivedLD;
        const sendParams = { ...args };
        if (amountReceivedLD) {
          sendParams.minAmountLD = BigInt(amountReceivedLD);
        }

        const quoteSendResponse = await stargateInstance.getQuoteSend({
          publicClient: publicClient,
          bridgeAddress,
          endPointId: sendParams.dstEid,
          receiver: address || DEFAULT_ADDRESS,
          amount: parseUnits(sendValue, selectedToken.decimal),
          minAmount: sendParams.minAmountLD,
        });

        let nativeFee = quoteSendResponse!.nativeFee;
        if (
          selectedToken.rawData.stargate?.address === '0x0000000000000000000000000000000000000000'
        ) {
          nativeFee += sendParams.amountLD;
        }
        const sendTokenArgs = {
          address: bridgeAddress,
          abi: STARGATE_POOL,
          functionName: 'sendToken',
          args: [sendParams, quoteSendResponse, address],
          value: nativeFee,
          account: address,
        };
        const hash = await walletClient?.writeContract({
          ...(sendTokenArgs as any),
        });

        const tx = await publicClient.waitForTransactionReceipt({
          hash: hash as `0x${string}`,
        });
        // eslint-disable-next-line no-console
        console.log('send token response', tx);
        return hash;
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e, e.message);
        onOpenFailedModal();
      }
    },
    [address, args, estimatedAmount, publicClient, selectedToken, walletClient, sendValue],
  );

  return {
    getQuoteOFT,
    sendToken,
  };
};
