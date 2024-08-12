import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import {
  setEstimatedAmount,
  setIsGlobalFeeLoading,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { useGetDebridgeEstimateAmount } from '@/modules/bridges/debridge/hooks/useGetDebridgeEstimateAmount';
import { useGetCbridgeEstimateAmount } from '@/modules/bridges/cbridge/hooks/useGetCbridgeEstimateAmount';
import { useCBridgeTransferParams } from '@/modules/bridges/cbridge/hooks/useCBridgeTransferParams';

export const useLoadingBridgeFees = () => {
  const dispatch = useAppDispatch();
  const { getCBridgeEstimated } = useGetCbridgeEstimateAmount();
  const { getDeBridgeEstimate } = useGetDebridgeEstimateAmount();
  const { bridgeAddress: cBridgeAddress } = useCBridgeTransferParams();

  const toToken = useAppSelector((state) => state.transfer.toToken);

  const loadingBridgeFees = useCallback(async () => {
    dispatch(setIsGlobalFeeLoading(true));
    dispatch(setEstimatedAmount(undefined));
    const promiseArr = [];
    const valueArr = [];
    try {
      if (toToken?.rawData.deBridge) {
        promiseArr.push(getDeBridgeEstimate());
      } else {
        promiseArr.push(new Promise((reject) => reject(null)));
      }
      if (toToken?.rawData.cBridge) {
        promiseArr.push(getCBridgeEstimated());
      } else {
        promiseArr.push(new Promise((reject) => reject(null)));
      }
      const response = await Promise.allSettled(promiseArr);
      // eslint-disable-next-line no-console
      console.log('API response deBridge[0], cBridge[1]', response);
      const debridgeEst = response?.[0];
      const cbridgeEst = response?.[1];
      if (debridgeEst?.status === 'fulfilled' && cbridgeEst?.status === 'fulfilled') {
        if (debridgeEst.value) {
          dispatch(setEstimatedAmount({ deBridge: debridgeEst.value }));
          valueArr.push({
            type: 'deBridge',
            value: debridgeEst.value?.estimation.dstChainTokenOut.amount,
          });
        } else {
          dispatch(setEstimatedAmount({ deBridge: undefined }));
        }
        if (cbridgeEst.value) {
          dispatch(setEstimatedAmount({ cBridge: cbridgeEst.value }));
          valueArr.push({ type: 'cBridge', value: cbridgeEst.value?.estimated_receive_amt });
        } else {
          dispatch(setEstimatedAmount({ cBridge: undefined }));
        }
        if (valueArr.length > 0) {
          const maxEntry = valueArr.reduce((max, entry) =>
            Number(entry['value']) > Number(max['value']) ? entry : max,
          );
          // eslint-disable-next-line no-console
          // console.log('max amount', maxEntry, Number(maxEntry.value));
          if (Number(maxEntry.value) > 0) {
            if (maxEntry.type === 'deBridge') {
              dispatch(
                setTransferActionInfo({
                  bridgeType: 'deBridge',
                  bridgeAddress: debridgeEst.value.tx.to as `0x${string}`,
                  data: debridgeEst.value.tx.data,
                  value: debridgeEst.value.tx.value,
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
            }
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
    getCBridgeEstimated,
    getDeBridgeEstimate,
    toToken?.rawData.cBridge,
    toToken?.rawData.deBridge,
  ]);

  return {
    loadingBridgeFees,
  };
};
