import { useCallback } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { BridgeType, DeBridgeCreateQuoteResponse } from '@bnb-chain/canonical-bridge-sdk';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import {
  setError,
  setEstimatedAmount,
  setIsGlobalFeeLoading,
  setRouteError,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY, DEFAULT_ADDRESS } from '@/core/constants';
import { toObject } from '@/core/utils/string';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';
import { useGetCBridgeFees } from '@/modules/aggregator/adapters/cBridge/hooks/useGetCBridgeFees';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { useBridgeConfig } from '@/index';

export const useLoadingBridgeFees = () => {
  const dispatch = useAppDispatch();
  const { bridgeAddress: cBridgeAddress } = useCBridgeTransferParams();
  const { getToDecimals } = useToTokenInfo();
  const { address } = useAccount();
  const { isAllowSendError } = useGetCBridgeFees();
  const bridgeSDK = useBridgeSDK();
  const { deBridgeAccessToken } = useBridgeConfig();
  const { data: nativeBalance } = useBalance({ address });

  const toToken = useAppSelector((state) => state.transfer.toToken);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const max_slippage = useAppSelector((state) => state.transfer.slippage);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  const loadingBridgeFees = useCallback(async () => {
    if (!selectedToken || !publicClient || !fromChain || !toChain || !debouncedSendValue) {
      dispatch(setIsGlobalFeeLoading(false));
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

    const availableBridgeTypes = bridgeSDK.getSupportedBridges();
    availableBridgeTypes.forEach((bridge) => {
      if (selectedToken[bridge]?.isCompatible) {
        bridgeTypeList.push(bridge);
      }
    });
    try {
      if (Number(parseUnits(debouncedSendValue, selectedToken.decimals)) <= 0) {
        dispatch(
          setError({ text: 'The amount is too small. Please enter a valid amount to transfer.' }),
        );
        dispatch(setIsGlobalFeeLoading(false));
        return;
      } else {
        dispatch(setError(undefined));
      }
      const response = await bridgeSDK.loadBridgeFees({
        bridgeType: bridgeTypeList,
        fromChainId: fromChain.id,
        fromTokenAddress: selectedToken.address as `0x${string}`,
        fromAccount: address || DEFAULT_ADDRESS,
        toChainId: toChain?.id,
        sendValue: parseUnits(debouncedSendValue, selectedToken.decimals),
        fromTokenSymbol: selectedToken.symbol,
        publicClient,
        endPointId: {
          layerZeroV1: toToken?.layerZero?.raw?.endpointID,
          layerZeroV2: toToken?.stargate?.raw?.endpointID,
        },
        bridgeAddress: {
          stargate: selectedToken?.stargate?.raw?.bridgeAddress as `0x${string}`,
          layerZero: selectedToken?.layerZero?.raw?.bridgeAddress as `0x${string}`,
        },
        toTokenAddress: toToken?.address as `0x${string}`,
        toAccount: address || DEFAULT_ADDRESS,
        isPegged: selectedToken?.isPegged,
        slippage: max_slippage,
        deBridgeAccessToken: deBridgeAccessToken,
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
        if (!isAllowSendError && !cbridgeEst.value?.err?.msg) {
          valueArr.push({
            type: 'cBridge',
            value: formatUnits(
              BigInt(cbridgeEst.value?.estimated_receive_amt),
              getToDecimals()['cBridge'],
            ),
          });
        }
        if (cbridgeEst.value?.err?.msg) {
          dispatch(setRouteError({ cBridge: cbridgeEst.value?.err?.msg }));
          dispatch(setEstimatedAmount({ cBridge: 'error' }));
        } else {
          dispatch(setEstimatedAmount({ cBridge: cbridgeEst.value }));
        }
      } else if (cbridgeEst.status === 'rejected') {
        dispatch(setRouteError({ cBridge: cbridgeEst.reason.message }));
        dispatch(setEstimatedAmount({ cBridge: 'error' }));
      } else {
        dispatch(setEstimatedAmount({ cBridge: undefined }));
      }

      // stargate
      if (stargateEst.status === 'fulfilled' && stargateEst?.value) {
        dispatch(setEstimatedAmount({ stargate: toObject(stargateEst.value) }));

        const allowedMin = Number(
          formatUnits(stargateEst.value[0].minAmountLD, selectedToken.decimals),
        );
        const allowedMax = Number(
          formatUnits(stargateEst.value[0].maxAmountLD, selectedToken.decimals),
        );
        if (Number(debouncedSendValue) >= allowedMin || Number(debouncedSendValue) <= allowedMax) {
          valueArr.push({
            type: 'stargate',
            value: formatUnits(
              stargateEst.value?.[2].amountReceivedLD,
              getToDecimals()['stargate'],
            ),
          });
        }
      } else if (stargateEst.status === 'rejected') {
        dispatch(setRouteError({ stargate: stargateEst.reason.message }));
        dispatch(setEstimatedAmount({ stargate: 'error' }));
      } else {
        dispatch(setEstimatedAmount({ stargate: undefined }));
      }

      // layerZero
      if (layerZeroEst.status === 'fulfilled' && layerZeroEst?.value) {
        const nativeFee = layerZeroEst?.value[0];
        if (nativeBalance?.value && nativeBalance.value < Number(nativeFee)) {
          dispatch(setRouteError({ layerZero: 'Insufficient funds to cover native fees' }));
          dispatch(setEstimatedAmount({ layerZero: 'error' }));
          return;
        }
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

      // pre-select best route
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
            selectedToken?.stargate?.raw?.bridgeAddress
          ) {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'stargate',
                bridgeAddress: selectedToken?.stargate?.raw?.bridgeAddress as `0x${string}`,
              }),
            );
          } else if (highestValue.type === 'layerZero') {
            dispatch(
              setTransferActionInfo({
                bridgeType: 'layerZero',
                bridgeAddress: selectedToken?.layerZero?.raw?.bridgeAddress as `0x${string}`,
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
    isAllowSendError,
    bridgeSDK,
    deBridgeAccessToken,
    nativeBalance?.value,
  ]);

  return {
    loadingBridgeFees,
  };
};
