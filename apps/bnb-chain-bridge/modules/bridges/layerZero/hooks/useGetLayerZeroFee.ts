import { useCallback } from 'react';
import { parseUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { bridgeSDK } from '@/core/constants/bridgeSDK';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { setEstimatedAmount } from '@/modules/transfer/action';

export const useGetLayerZeroFees = () => {
  const { address } = useAccount();

  const dispatch = useAppDispatch();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toToken = useAppSelector((state) => state.transfer.toToken);

  const publicClient = usePublicClient({ chainId: fromChain?.id });

  const getLayerZeroEstimateFees = useCallback(async () => {
    if (!selectedToken || !sendValue || !toToken || !address || !publicClient) {
      return;
    }
    try {
      const fees = await bridgeSDK.layerZero.getEstimateFee({
        bridgeAddress: selectedToken?.rawData.layerZero?.bridgeAddress as `0x${string}`,
        amount: parseUnits(sendValue, selectedToken?.rawData?.layerZero?.decimals as number),
        dstEndpoint: selectedToken?.rawData.layerZero?.endpointID as number,
        userAddress: address,
        publicClient: publicClient,
      });
      dispatch(setEstimatedAmount({ layerZero: sendValue }));

      return fees;
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e, e.message);
    }
  }, [address, publicClient, selectedToken, sendValue, toToken, dispatch]);
  return { getLayerZeroEstimateFees };
};
