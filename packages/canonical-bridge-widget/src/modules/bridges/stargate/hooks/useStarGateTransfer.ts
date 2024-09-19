import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useCallback } from 'react';
import { parseUnits } from 'viem';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setEstimatedAmount } from '@/modules/transfer/action';
import { toObject } from '@/core/utils/string';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY, DEFAULT_ADDRESS } from '@/core/constants';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useStarGateTransferParams } from '@/modules/bridges/stargate/hooks/useStarGateTransferParams';
import { bridgeSDK } from '@/core/constants/bridgeSDK';

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

      const quoteOFTResponse = await bridgeSDK.stargate.getQuoteOFT({
        publicClient: publicClient,
        bridgeAddress,
        endPointId: args.dstEid,
        receiver: address || DEFAULT_ADDRESS,
        amount: parseUnits(debouncedSendValue, selectedToken.decimal),
      });

      dispatch(setEstimatedAmount({ stargate: toObject(quoteOFTResponse) }));
      return { quoteOFT: quoteOFTResponse };
      // eslint-disable-next-line
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
      if (
        !address ||
        !estimatedAmount?.stargate ||
        !args ||
        !selectedToken ||
        !publicClient ||
        !walletClient
      )
        return;
      try {
        const bridgeAddress = selectedToken.rawData.stargate?.bridgeAddress as `0x${string}`;
        const amountReceivedLD = estimatedAmount?.stargate[2].amountReceivedLD;
        const sendParams = { ...args };
        if (amountReceivedLD) {
          sendParams.minAmountLD = BigInt(amountReceivedLD);
        }
        const hash = await bridgeSDK.stargate.sendToken({
          walletClient: walletClient,
          publicClient: publicClient,
          bridgeAddress,
          tokenAddress: selectedToken.address as `0x${string}`,
          endPointId: args.dstEid,
          receiver: address,
          amount: parseUnits(sendValue, selectedToken.decimal),
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
