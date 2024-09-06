import { useCallback } from 'react';
import { formatUnits } from 'viem';

import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import {
  setEstimatedAmount,
  setIsGlobalFeeLoading,
  setReceiveValue,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { useGetDebridgeEstimateAmount } from '@/modules/bridges/debridge/hooks/useGetDebridgeEstimateAmount';
import { useGetCbridgeEstimateAmount } from '@/modules/bridges/cbridge/hooks/useGetCbridgeEstimateAmount';
import { useCBridgeTransferParams } from '@/modules/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useStarGateTransfer } from '@/modules/bridges/stargate/hooks/useStarGateTransfer';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useGetLayerZeroFees } from '@/modules/bridges/layerZero/hooks/useGetLayerZeroFee';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY } from '@/core/constants';

export const useLoadingBridgeFees = () => {
  const dispatch = useAppDispatch();
  const { getCBridgeEstimated } = useGetCbridgeEstimateAmount();
  const { getDeBridgeEstimate } = useGetDebridgeEstimateAmount();
  const { getLayerZeroEstimateFees } = useGetLayerZeroFees();
  const { getQuoteOFT } = useStarGateTransfer();
  const { bridgeAddress: cBridgeAddress } = useCBridgeTransferParams();
  const { getToDecimals } = useToTokenInfo();

  const toToken = useAppSelector((state) => state.transfer.toToken);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
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
      if (toToken?.rawData.stargate) {
        promiseArr.push(getQuoteOFT());
      } else {
        promiseArr.push(new Promise((reject) => reject(null)));
      }
      if (toToken?.rawData.layerZero) {
        promiseArr.push(getLayerZeroEstimateFees());
      } else {
        promiseArr.push(new Promise((reject) => reject(null)));
      }
      const response = await Promise.allSettled<any>(promiseArr);
      // eslint-disable-next-line no-console
      console.log('API response deBridge[0], cBridge[1], stargate[2], layerZero[3]', response);
      const debridgeEst = response?.[0];
      const cbridgeEst = response?.[1];
      const stargateEst = response?.[2];
      const layerZeroEst = response?.[3];
      if (
        debridgeEst?.status === 'fulfilled' &&
        cbridgeEst?.status === 'fulfilled' &&
        stargateEst?.status === 'fulfilled' &&
        layerZeroEst?.status === 'fulfilled'
      ) {
        if (debridgeEst.value) {
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
        if (cbridgeEst.value) {
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
        if (stargateEst.value) {
          valueArr.push({
            type: 'stargate',
            value: formatUnits(
              stargateEst.value?.quoteOFT?.[2].amountReceivedLD,
              selectedToken?.rawData.stargate?.decimals || 18,
            ),
          });
        } else {
          dispatch(setEstimatedAmount({ stargate: undefined }));
        }
        if (layerZeroEst.value) {
          valueArr.push({
            type: 'layerZero',
            value: debouncedSendValue,
          });
          dispatch(setEstimatedAmount({ layerZero: Number(layerZeroEst.value[0]) }));
          dispatch(
            setReceiveValue({
              layerZero: debouncedSendValue,
            }),
          );
        } else {
          dispatch(setEstimatedAmount({ layerZero: undefined }));
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
    getLayerZeroEstimateFees,
    getQuoteOFT,
    getToDecimals,
    selectedToken?.rawData.stargate?.bridgeAddress,
    selectedToken?.rawData.layerZero?.bridgeAddress,
    selectedToken?.rawData.stargate?.decimals,
    toToken?.rawData.cBridge,
    toToken?.rawData.deBridge,
    toToken?.rawData.stargate,
    toToken?.rawData.layerZero,
    debouncedSendValue,
  ]);

  return {
    loadingBridgeFees,
  };
};
