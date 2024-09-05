import { useCallback } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import {
  setEstimatedAmount,
  setIsGlobalFeeLoading,
  setTransferActionInfo,
} from '@/modules/transfer/action';
// import { useGetDebridgeEstimateAmount } from '@/modules/bridges/debridge/hooks/useGetDebridgeEstimateAmount';
// import { useGetCbridgeEstimateAmount } from '@/modules/bridges/cbridge/hooks/useGetCbridgeEstimateAmount';
import { useCBridgeTransferParams } from '@/modules/bridges/cbridge/hooks/useCBridgeTransferParams';
// import { useStarGateTransfer } from '@/modules/bridges/stargate/hooks/useStarGateTransfer';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
// import { useGetLayerZeroFees } from '@/modules/bridges/layerZero/hooks/useGetLayerZeroFee';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY, DEFAULT_ADDRESS } from '@/core/constants';
import { bridgeSDK } from '@/core/constants/bridgeSDK';
import { toObject } from '@/core/utils/string';

export const useLoadingBridgeFees = () => {
  const dispatch = useAppDispatch();
  // const { getCBridgeEstimated } = useGetCbridgeEstimateAmount();
  // const { getDeBridgeEstimate } = useGetDebridgeEstimateAmount();
  // const { getLayerZeroEstimateFees } = useGetLayerZeroFees();
  // const { getQuoteOFT } = useStarGateTransfer();
  const { bridgeAddress: cBridgeAddress } = useCBridgeTransferParams();
  const { getToDecimals } = useToTokenInfo();
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const toToken = useAppSelector((state) => state.transfer.toToken);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const max_slippage = useAppSelector((state) => state.transfer.slippage);

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  const loadingBridgeFees = useCallback(async () => {
    if (!selectedToken || !publicClient || !fromChain || !toChain || !debouncedSendValue) {
      return;
    }
    dispatch(setIsGlobalFeeLoading(true));
    dispatch(setEstimatedAmount(undefined));
    const valueArr = [];
    try {
      const response = await bridgeSDK.loadBridgeFees({
        bridgeType: ['cBridge', 'deBridge', 'stargate', 'layerZero'],
        fromChainId: fromChain.id,
        fromTokenAddress: selectedToken.address as `0x${string}`,
        fromAccount: address || DEFAULT_ADDRESS,
        toChainId: toChain?.id,
        sendValue: parseUnits(debouncedSendValue, selectedToken.decimal),
        fromTokenSymbol: selectedToken.symbol,
        publicClient,
        endPointId: {
          layerZeroV1: selectedToken?.rawData.layerZero?.endpointID,
          layerZeroV2: selectedToken?.rawData.stargate?.endpointID,
        },
        bridgeAddress: {
          stargate: selectedToken?.rawData.stargate?.bridgeAddress as `0x${string}`,
          layerZero: selectedToken?.rawData.layerZero?.bridgeAddress as `0x${string}`,
        },
        toTokenAddress: toToken?.address as `0x${string}`,
        toAccount: address,
        isPegged: selectedToken?.isPegged,
        slippage: max_slippage,
      });
      // eslint-disable-next-line no-console
      console.log('API response deBridge[0], cBridge[1], stargate[2], layerZero[3]', response);

      const [debridgeEst, cbridgeEst, stargateEst, layerZeroEst] = response;
      if (debridgeEst.status === 'fulfilled' && debridgeEst?.value) {
        dispatch(setEstimatedAmount({ deBridge: debridgeEst.value }));
        valueArr.push({
          type: 'deBridge',
          value: formatUnits(
            BigInt(debridgeEst.value?.estimation.dstChainTokenOut.amount),
            getToDecimals()['deBridge'],
          ),
        });
      } else {
        dispatch(setEstimatedAmount({ deBridge: undefined }));
      }
      if (cbridgeEst.status === 'fulfilled' && cbridgeEst?.value) {
        dispatch(setEstimatedAmount({ cBridge: cbridgeEst.value }));
        valueArr.push({
          type: 'cBridge',
          value: formatUnits(
            BigInt(cbridgeEst.value?.estimated_receive_amt),
            getToDecimals()['cBridge'],
          ),
        });
      } else {
        dispatch(setEstimatedAmount({ cBridge: undefined }));
      }
      if (stargateEst.status === 'fulfilled' && stargateEst?.value) {
        dispatch(setEstimatedAmount({ stargate: toObject(stargateEst.value) }));
        valueArr.push({
          type: 'stargate',
          value: formatUnits(
            stargateEst.value?.[2].amountReceivedLD,
            selectedToken?.rawData.stargate?.decimals || 18,
          ),
        });
      } else {
        dispatch(setEstimatedAmount({ stargate: undefined }));
      }
      if (layerZeroEst.status === 'fulfilled' && layerZeroEst?.value) {
        dispatch(
          setEstimatedAmount({
            layerZero: String(parseUnits(debouncedSendValue, getToDecimals()['layerZero'])),
          }),
        );
        valueArr.push({
          type: 'layerZero',
          value: debouncedSendValue,
        });
      } else {
        dispatch(setEstimatedAmount({ layerZero: undefined }));
      }
      if (valueArr.length > 0) {
        const maxEntry = valueArr.reduce((max, entry) =>
          Number(entry['value']) > Number(max['value']) ? entry : max,
        );
        // eslint-disable-next-line no-console
        console.log('max amount', maxEntry, Number(maxEntry.value));
        if (Number(maxEntry.value) > 0) {
          if (maxEntry.type === 'deBridge' && debridgeEst.status === 'fulfilled') {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'deBridge',
                bridgeAddress: debridgeEst.value.tx?.to as `0x${string}`,
                data: debridgeEst.value.tx?.data,
                value: debridgeEst.value.tx?.value,
                orderId: debridgeEst.value.orderId,
              }),
            );
          } else if (maxEntry.type === 'cBridge' && cBridgeAddress) {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'cBridge',
                bridgeAddress: cBridgeAddress as `0x${string}`,
              }),
            );
          } else if (
            maxEntry.type === 'stargate' &&
            selectedToken?.rawData.stargate?.bridgeAddress
          ) {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'stargate',
                bridgeAddress: selectedToken?.rawData.stargate?.bridgeAddress as `0x${string}`,
              }),
            );
          } else if (maxEntry.type === 'layerZero') {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'layerZero',
                bridgeAddress: selectedToken?.rawData.layerZero?.bridgeAddress as `0x${string}`,
              }),
            );
          }
        }
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error, error.message);
    } finally {
      dispatch(setIsGlobalFeeLoading(false));
    }
  }, [
    cBridgeAddress,
    dispatch,
    getToDecimals,
    toToken,
    debouncedSendValue,
    address,
    publicClient,
    fromChain,
    toChain,
    selectedToken,
    max_slippage,
  ]);

  return {
    loadingBridgeFees,
  };
};
