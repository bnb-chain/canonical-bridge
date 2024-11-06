import { useCallback } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { BridgeType, DeBridgeCreateQuoteResponse } from '@bnb-chain/canonical-bridge-sdk';
import { useTronWallet } from '@node-real/walletkit/tron';
import { useIntl } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import {
  setEstimatedAmount,
  setIsGlobalFeeLoading,
  setRouteError,
  setRouteFees,
} from '@/modules/transfer/action';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY, DEFAULT_ADDRESS, DEFAULT_TRON_ADDRESS } from '@/core/constants';
import { toObject } from '@/core/utils/string';
import { useGetCBridgeFees } from '@/modules/aggregator/adapters/cBridge/hooks/useGetCBridgeFees';
import { useGetDeBridgeFees } from '@/modules/aggregator/adapters/deBridge/hooks/useGetDeBridgeFees';
import { useGetStargateFees } from '@/modules/aggregator/adapters/stargate/hooks/useGetStarGateFees';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { useBridgeConfig } from '@/index';
import { useGetLayerZeroFees } from '@/modules/aggregator/adapters/layerZero/hooks/useGetLayerZeroFees';
import { usePreSelectRoute } from '@/modules/transfer/hooks/usePreSelectRoute';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { useGetMesonFees } from '@/modules/aggregator/adapters/meson/hooks/useGetMesonFees';
import { formatNumber } from '@/core/utils/number';

export const useLoadingBridgeFees = () => {
  const dispatch = useAppDispatch();
  const { preSelectRoute } = usePreSelectRoute();
  const { getToDecimals } = useToTokenInfo();
  const { address } = useAccount();
  const { address: tronAddress } = useTronWallet();
  const bridgeSDK = useBridgeSDK();
  const {
    http: { deBridgeAccessToken },
  } = useBridgeConfig();
  const nativeToken = useGetNativeToken();
  const { deBridgeFeeSorting } = useGetDeBridgeFees();
  const { cBridgeFeeSorting, isAllowSendError } = useGetCBridgeFees();
  const { stargateFeeSorting } = useGetStargateFees();
  const { layerZeroFeeSorting } = useGetLayerZeroFees();
  const { mesonFeeSorting } = useGetMesonFees();
  const { formatMessage } = useIntl();

  const toToken = useAppSelector((state) => state.transfer.toToken);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const max_slippage = useAppSelector((state) => state.transfer.slippage);

  const { data: nativeBalance } = useBalance({ address, chainId: fromChain?.id });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  const loadingBridgeFees = useCallback(async () => {
    dispatch(setRouteFees(undefined));
    if (!selectedToken || !fromChain || !toChain || !debouncedSendValue) {
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
        meson: undefined,
      }),
    );
    const bridgeTypeList: BridgeType[] = [];
    const valueArr = [];

    const availableBridgeTypes = bridgeSDK.getSupportedBridges();
    availableBridgeTypes.forEach((bridge) => {
      if (selectedToken[bridge]?.isMatched) {
        bridgeTypeList.push(bridge);
      }
    });
    try {
      const amount = parseUnits(debouncedSendValue, selectedToken.decimals);
      const response = await bridgeSDK.loadBridgeFees({
        bridgeType: bridgeTypeList,
        fromChainId: fromChain.id,
        fromAccount: address || DEFAULT_ADDRESS,
        toChainId: toChain?.id,
        sendValue: amount,
        fromTokenSymbol: selectedToken.symbol === 'ETH' ? 'WETH' : selectedToken.symbol,
        publicClient,
        endPointId: {
          layerZeroV1: toToken?.layerZero?.raw?.endpointID,
          layerZeroV2: toToken?.stargate?.raw?.endpointID,
        },
        bridgeAddress: {
          stargate: selectedToken?.stargate?.raw?.bridgeAddress as `0x${string}`,
          layerZero: selectedToken?.layerZero?.raw?.bridgeAddress as `0x${string}`,
        },
        isPegged: selectedToken?.isPegged,
        slippage: max_slippage,
        mesonOpts: {
          fromToken: `${fromChain?.meson?.raw?.id}:${selectedToken?.meson?.raw?.id}`,
          toToken: `${toChain?.meson?.raw?.id}:${toToken?.meson?.raw?.id}`,
          amount: debouncedSendValue,
          fromAddr:
            fromChain?.chainType === 'tron'
              ? tronAddress ?? DEFAULT_TRON_ADDRESS
              : address ?? DEFAULT_ADDRESS,
        },
        deBridgeOpts: {
          fromChainId: fromChain.id,
          fromTokenAddress: selectedToken.address as `0x${string}`,
          amount,
          toChainId: toChain?.id,
          toTokenAddress: toToken?.address as `0x${string}`,
          userAddress: address || DEFAULT_ADDRESS,
          accesstoken: deBridgeAccessToken,
        },
      });
      // eslint-disable-next-line no-console
      console.log(
        'API response deBridge[0], cBridge[1], stargate[2], layerZero[3], meson[4]',
        response,
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [debridgeEst, cbridgeEst, stargateEst, layerZeroEst, mesonEst] = response as any;
      // meson
      if (mesonEst.status === 'fulfilled' && mesonEst?.value) {
        if (mesonEst?.value?.error) {
          const error = mesonEst?.value?.error;
          if (error.code === 21 && error.message === 'amount-over-limit') {
            dispatch(setEstimatedAmount({ meson: 'error' }));
            dispatch(
              setRouteError({
                meson: formatMessage({ id: 'route.error.amount.max' }, { max: error.data.max }),
              }),
            );
          } else if (error.code === 66 && error.message === 'fee-over-amount') {
            dispatch(setEstimatedAmount({ meson: 'error' }));
            dispatch(
              setRouteError({
                meson: formatMessage(
                  { id: 'route.error.amount.min' },
                  { min: `${error.data.fee} ${selectedToken.symbol}` },
                ),
              }),
            );
          } else if (error.code === 19 && error.message === 'amount-exceeds-6-decimals') {
            dispatch(setEstimatedAmount({ meson: 'error' }));
            dispatch(
              setRouteError({
                meson: formatMessage({ id: 'route.error.amount.digits' }),
              }),
            );
          } else {
            // other error
            dispatch(setEstimatedAmount({ meson: 'error' }));
            dispatch(
              setRouteError({
                meson: error.message,
              }),
            );
          }
        } else {
          const feeSortingRes = await mesonFeeSorting(mesonEst.value.result);
          const decimals = selectedToken?.meson?.raw?.decimals || 6;
          const receiveMesonAmt =
            parseUnits(debouncedSendValue, decimals) -
            parseUnits(mesonEst.value.result.totalFee, decimals);
          if (feeSortingRes) {
            dispatch(
              setEstimatedAmount({
                meson: formatNumber(Number(formatUnits(receiveMesonAmt, decimals)), 8),
              }),
            );
            // TODO check amount value
            valueArr.push({
              type: 'meson',
              value: formatNumber(Number(formatUnits(receiveMesonAmt, decimals)), 8),
              isIgnoreSorted: false,
              isDisplayError: false,
            });
          }
        }
      } else if (mesonEst.status === 'rejected') {
        // TODO handle error
        dispatch(setEstimatedAmount({ meson: undefined }));
      } else {
        dispatch(setEstimatedAmount({ meson: undefined }));
      }

      // deBridge
      if (debridgeEst.status === 'fulfilled' && debridgeEst?.value) {
        const feeSortingRes = await deBridgeFeeSorting(
          debridgeEst.value as DeBridgeCreateQuoteResponse,
        );
        if (!feeSortingRes?.isFailedToGetGas) {
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
            isIgnoreSorted: feeSortingRes?.isFailedToGetGas,
            isDisplayError: feeSortingRes?.isDisplayError,
          });
        } else {
          dispatch(setEstimatedAmount({ deBridge: undefined }));
        }
      } else if (debridgeEst.status === 'rejected') {
        // Only show route on low amount error
        if (debridgeEst.reason.message === 'ERROR_LOW_GIVE_AMOUNT') {
          dispatch(setRouteError({ deBridge: 'Please increase your send amount' }));
          dispatch(setEstimatedAmount({ deBridge: 'error' }));
          dispatch(setRouteFees({ deBridge: undefined }));
        } else {
          dispatch(setEstimatedAmount({ deBridge: undefined }));
        }
      } else {
        dispatch(setEstimatedAmount({ deBridge: undefined }));
      }

      // cBridge
      if (cbridgeEst.status === 'fulfilled' && cbridgeEst?.value) {
        // Do not show route on error
        if (cbridgeEst?.value.err) {
          dispatch(setEstimatedAmount({ cBridge: undefined }));
        } else {
          if (cbridgeEst.value?.err?.msg) {
            dispatch(setRouteError({ cBridge: cbridgeEst.value?.err?.msg }));
            dispatch(setEstimatedAmount({ cBridge: 'error' }));
          } else {
            dispatch(setEstimatedAmount({ cBridge: cbridgeEst.value }));

            const feeSortingRes = await cBridgeFeeSorting(cbridgeEst.value);
            // Hide route on gas error
            if (feeSortingRes?.isFailedToGetGas) {
              dispatch(setEstimatedAmount({ cBridge: undefined }));
            }
            if (!isAllowSendError && !feeSortingRes?.isFailedToGetGas) {
              valueArr.push({
                type: 'cBridge',
                value: formatUnits(
                  BigInt(cbridgeEst.value?.estimated_receive_amt),
                  getToDecimals()['cBridge'],
                ),
                isIgnoreSorted: feeSortingRes?.isFailedToGetGas,
                isDisplayError: false,
              });
            }
          }
        }
      } else if (cbridgeEst.status === 'rejected') {
        dispatch(setRouteError({ cBridge: cbridgeEst.reason.message }));
        dispatch(setEstimatedAmount({ cBridge: 'error' }));
        dispatch(setRouteFees({ cBridge: undefined }));
      } else {
        dispatch(setEstimatedAmount({ cBridge: undefined }));
      }

      // stargate
      if (stargateEst.status === 'fulfilled' && stargateEst?.value) {
        const feeSortingRes = await stargateFeeSorting(stargateEst.value);
        // Hide route if we can not get gas fee.
        if (!feeSortingRes?.isFailedToGetGas) {
          dispatch(setEstimatedAmount({ stargate: toObject(stargateEst.value) }));
          if (!feeSortingRes?.isDisplayError) {
            valueArr.push({
              type: 'stargate',
              value: formatUnits(
                stargateEst.value?.[2].amountReceivedLD,
                getToDecimals()['stargate'],
              ),
              isIgnoreSorted: feeSortingRes?.isFailedToGetGas,
              isDisplayError: feeSortingRes?.isDisplayError,
            });
          }
        } else {
          dispatch(setEstimatedAmount({ stargate: undefined }));
        }
      } else if (stargateEst.status === 'rejected') {
        dispatch(setRouteError({ stargate: stargateEst.reason.message }));
        dispatch(setEstimatedAmount({ stargate: undefined }));
        dispatch(setRouteFees({ stargate: undefined }));
      } else {
        dispatch(setEstimatedAmount({ stargate: undefined }));
      }

      // layerZero
      if (layerZeroEst.status === 'fulfilled' && layerZeroEst?.value) {
        const nativeFee = layerZeroEst?.value[0];
        if (nativeBalance?.value && nativeBalance.value < Number(nativeFee)) {
          dispatch(setRouteError({ layerZero: `Insufficient ${nativeToken} to cover native fee` }));
          dispatch(setEstimatedAmount({ layerZero: 'error' }));
        } else {
          const feeSortingRes = await layerZeroFeeSorting(layerZeroEst.value);
          if (!feeSortingRes?.isFailedToGetGas) {
            dispatch(
              setEstimatedAmount({
                layerZero: String(parseUnits(debouncedSendValue, getToDecimals()['layerZero'])),
              }),
            );
            valueArr.push({
              type: 'layerZero',
              value: debouncedSendValue,
              isIgnoreSorted: feeSortingRes?.isFailedToGetGas,
              isDisplayError: feeSortingRes?.isDisplayError,
            });
          } else {
            dispatch(setEstimatedAmount({ layerZero: undefined }));
          }
        }
      } else if (layerZeroEst.status === 'rejected') {
        dispatch(setRouteError({ layerZero: layerZeroEst.reason.message }));
        dispatch(setEstimatedAmount({ layerZero: undefined }));
        dispatch(setRouteFees({ layerZero: undefined }));
      } else {
        dispatch(setEstimatedAmount({ layerZero: undefined }));
      }

      // pre-select best route
      if (valueArr.length > 0) {
        const highestValue = valueArr.reduce(
          (max, entry) =>
            Number(entry['value']) > Number(max['value']) &&
            entry.isIgnoreSorted === false &&
            entry.isDisplayError === false
              ? entry
              : max,
          { value: '0', type: '' },
        );
        if (Number(highestValue?.value) > 0) {
          preSelectRoute(response, highestValue.type as BridgeType);
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
    dispatch,
    getToDecimals,
    toToken,
    debouncedSendValue,
    address,
    tronAddress,

    publicClient,
    fromChain,
    toChain,
    selectedToken,
    max_slippage,
    bridgeSDK,
    deBridgeAccessToken,
    nativeBalance?.value,
    deBridgeFeeSorting,
    cBridgeFeeSorting,
    stargateFeeSorting,
    layerZeroFeeSorting,
    mesonFeeSorting,

    preSelectRoute,
    isAllowSendError,
    nativeToken,
  ]);

  return {
    loadingBridgeFees,
  };
};
