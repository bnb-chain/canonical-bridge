import { useCallback } from 'react';
import { parseUnits } from 'viem';

import { createDeBridgeTxQuote } from '@/modules/bridges/debridge/api';
import { setEstimatedAmount, setReceiveValue } from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { DEBRIDGE_ACCESS_TOKEN } from '@/core/constants';
import { useCurrentWallet } from '@/modules/wallet/hooks/useCurrentWallet';
import { useSolanaTransferInfo } from '@/modules/transfer/hooks/useSolanaTransferInfo';

export const useGetDebridgeEstimateAmount = () => {
  const { address } = useCurrentWallet();
  const { toTokenInfo } = useToTokenInfo();

  const dispatch = useAppDispatch();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const toAccount = useAppSelector((state) => state.transfer.toAccount);

  const { isSolanaTransfer, isAvailableAccount } = useSolanaTransferInfo();

  const getDeBridgeEstimate = useCallback(async () => {
    if (
      !fromChain ||
      !toChain ||
      !selectedToken ||
      !sendValue ||
      !Number(sendValue) ||
      (isSolanaTransfer && !isAvailableAccount)
    ) {
      dispatch(setEstimatedAmount({ deBridge: undefined }));
      return null;
    }
    try {
      const deBridgeParams: any = {
        srcChainId: fromChain.id,
        srcChainTokenIn: selectedToken?.address as `0x${string}`,
        srcChainTokenInAmount: parseUnits(sendValue, selectedToken.decimal),
        dstChainId: toChain.id,
        dstChainTokenOut: toTokenInfo?.rawData.deBridge?.address,
        prependOperatingExpenses: false,
        affiliateFeePercent: 0,
        accesstoken: DEBRIDGE_ACCESS_TOKEN,
      } as any;
      if (address) {
        const dstAddress = isSolanaTransfer ? toAccount.address : address;

        deBridgeParams.dstChainTokenOutRecipient = dstAddress;
        deBridgeParams.dstChainOrderAuthorityAddress = dstAddress;
        deBridgeParams.srcChainOrderAuthorityAddress = address;
      }
      const urlParams = new URLSearchParams(deBridgeParams);
      const deBridgeQuote = await createDeBridgeTxQuote(urlParams);

      // console.log('deBridgeQuote', deBridgeQuote);
      dispatch(setEstimatedAmount({ deBridge: deBridgeQuote }));

      return deBridgeQuote;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error, error.message);

      dispatch(setEstimatedAmount({ deBridge: undefined }));
      return null;
    }
  }, [
    fromChain,
    toChain,
    selectedToken,
    sendValue,
    isSolanaTransfer,
    isAvailableAccount,
    dispatch,
    toTokenInfo?.rawData.deBridge?.address,
    address,
    toAccount.address,
  ]);

  return { getDeBridgeEstimate };
};
