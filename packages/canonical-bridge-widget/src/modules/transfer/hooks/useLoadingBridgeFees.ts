import { useCallback } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { BridgeType, DeBridgeCreateQuoteResponse } from '@bnb-chain/canonical-bridge-sdk';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import {
  setEstimatedAmount,
  setIsGlobalFeeLoading,
  setRouteError,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { useCBridgeTransferParams } from '@/modules/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY, DEFAULT_ADDRESS } from '@/core/constants';
import { bridgeSDK } from '@/core/constants/bridgeSDK';
import { toObject } from '@/core/utils/string';

const availableBridgeTypes: BridgeType[] = ['deBridge', 'cBridge', 'stargate', 'layerZero'];

export const useLoadingBridgeFees = () => {
  const dispatch = useAppDispatch();
  const { bridgeAddress: cBridgeAddress } = useCBridgeTransferParams();
  const { getToDecimals } = useToTokenInfo();
  const { address } = useAccount();

  const toToken = useAppSelector((state) => state.transfer.toToken);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const max_slippage = useAppSelector((state) => state.transfer.slippage);

  const publicClient = usePublicClient({ chainId: fromChain?.id });
  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  const loadingBridgeFees = useCallback(async () => {
    if (!selectedToken || !publicClient || !fromChain || !toChain || !debouncedSendValue) {
      return;
    }
    dispatch(setEstimatedAmount(undefined));
    dispatch(
      setRouteError({
        deBridge: undefined,
        cBridge: undefined,
        stargate: undefined,
        layerZero: undefined,
      }),
    );
    const bridgeTypeList: BridgeType[] = [];
    const valueArr = [];
    availableBridgeTypes.forEach((bridge) => {
      if (selectedToken.available[bridge]) {
        bridgeTypeList.push(bridge);
      }
    });
    try {
      const response = await bridgeSDK.loadBridgeFees({
        bridgeType: bridgeTypeList,
        fromChainId: fromChain.id,
        fromTokenAddress: selectedToken.address as `0x${string}`,
        fromAccount: address || DEFAULT_ADDRESS,
        toChainId: toChain?.id,
        sendValue: parseUnits(debouncedSendValue, selectedToken.decimal),
        fromTokenSymbol: selectedToken.symbol,
        publicClient,
        endPointId: {
          layerZeroV1: toToken?.rawData.layerZero?.endpointID,
          layerZeroV2: toToken?.rawData.stargate?.endpointID,
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [debridgeEst, cbridgeEst, stargateEst, layerZeroEst] = response as any;
      // deBridge
      if (debridgeEst.status === 'fulfilled' && debridgeEst?.value) {
        dispatch(
          setEstimatedAmount({ deBridge: debridgeEst.value as DeBridgeCreateQuoteResponse }),
        );
        valueArr.push({
          type: 'deBridge',
          value: formatUnits(
            BigInt(
              (debridgeEst.value as DeBridgeCreateQuoteResponse)?.estimation.dstChainTokenOut
                .amount,
            ),
            getToDecimals()['deBridge'],
          ),
        });
      } else if (debridgeEst.status === 'rejected') {
        dispatch(setRouteError({ deBridge: debridgeEst.reason.message }));
        dispatch(setEstimatedAmount({ deBridge: 'error' }));
      } else {
        dispatch(setEstimatedAmount({ deBridge: undefined }));
      }

      // cBridge
      if (cbridgeEst.status === 'fulfilled' && cbridgeEst?.value) {
        dispatch(setEstimatedAmount({ cBridge: cbridgeEst.value }));
        valueArr.push({
          type: 'cBridge',
          value: formatUnits(
            BigInt(cbridgeEst.value?.estimated_receive_amt),
            getToDecimals()['cBridge'],
          ),
        });
      } else if (cbridgeEst.status === 'rejected') {
        dispatch(setRouteError({ cBridge: cbridgeEst.reason.message }));
        dispatch(setEstimatedAmount({ cBridge: 'error' }));
      } else {
        dispatch(setEstimatedAmount({ cBridge: undefined }));
      }

      // stargate
      if (stargateEst.status === 'fulfilled' && stargateEst?.value) {
        dispatch(setEstimatedAmount({ stargate: toObject(stargateEst.value) }));
        valueArr.push({
          type: 'stargate',
          value: formatUnits(stargateEst.value?.[2].amountReceivedLD, getToDecimals()['stargate']),
        });
      } else if (stargateEst.status === 'rejected') {
        dispatch(setRouteError({ stargate: stargateEst.reason.message }));
        dispatch(setEstimatedAmount({ stargate: 'error' }));
      } else {
        dispatch(setEstimatedAmount({ stargate: undefined }));
      }

      // layerZero
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
      } else if (layerZeroEst.status === 'rejected') {
        dispatch(setRouteError({ layerZero: layerZeroEst.reason.message }));
        dispatch(setEstimatedAmount({ layerZero: 'error' }));
      } else {
        dispatch(setEstimatedAmount({ layerZero: undefined }));
      }

      if (valueArr.length > 0) {
        const highestValue = valueArr.reduce((max, entry) =>
          Number(entry['value']) > Number(max['value']) ? entry : max,
        );

        if (Number(highestValue.value) > 0) {
          if (highestValue.type === 'deBridge' && debridgeEst.status === 'fulfilled') {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'deBridge',
                bridgeAddress: debridgeEst.value.tx?.to as `0x${string}`,
                data: debridgeEst.value.tx?.data,
                value: debridgeEst.value.tx?.value,
                orderId: debridgeEst.value.orderId,
              }),
            );
          } else if (highestValue.type === 'cBridge' && cBridgeAddress) {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'cBridge',
                bridgeAddress: cBridgeAddress as `0x${string}`,
              }),
            );
          } else if (
            highestValue.type === 'stargate' &&
            selectedToken?.rawData.stargate?.bridgeAddress
          ) {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'stargate',
                bridgeAddress: selectedToken?.rawData.stargate?.bridgeAddress as `0x${string}`,
              }),
            );
          } else if (highestValue.type === 'layerZero') {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'layerZero',
                bridgeAddress: selectedToken?.rawData.layerZero?.bridgeAddress as `0x${string}`,
              }),
            );
          }
        }
      }
      // eslint-disable-next-line
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
