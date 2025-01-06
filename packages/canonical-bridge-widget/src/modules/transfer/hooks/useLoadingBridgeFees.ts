import { useCallback, useRef } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { BridgeType, IDeBridgeCreateQuoteResponse } from '@bnb-chain/canonical-bridge-sdk';
import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
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
import {
  DEBOUNCE_DELAY,
  DEFAULT_ADDRESS,
  DEFAULT_SOLANA_ADDRESS,
  DEFAULT_TRON_ADDRESS,
} from '@/core/constants';
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
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useSolanaTransferInfo } from '@/modules/transfer/hooks/solana/useSolanaTransferInfo';
import { useIsWalletCompatible } from '@/modules/wallet/hooks/useIsWalletCompatible';

let lastTime = Date.now();

export type TriggerType = 'new' | 'refresh';

export const useLoadingBridgeFees = () => {
  const dispatch = useAppDispatch();
  const { preSelectRoute } = usePreSelectRoute();
  const { getToDecimals } = useToTokenInfo();
  const { address } = useAccount();
  const { address: tronAddress } = useTronWallet();
  const { address: solanaAddress } = useSolanaAccount();

  const { isSolanaAvailableToAccount } = useSolanaTransferInfo();
  const isWalletCompatible = useIsWalletCompatible();

  const bridgeSDK = useBridgeSDK();
  const {
    http: { deBridgeAccessToken },
  } = useBridgeConfig();
  const nativeToken = useGetNativeToken();
  const { deBridgeFeeSorting: _deBridgeFeeSorting } = useGetDeBridgeFees();
  const deBridgeFeeSorting = useRef(_deBridgeFeeSorting);
  deBridgeFeeSorting.current = _deBridgeFeeSorting;

  const { cBridgeFeeSorting: _cBridgeFeeSorting, isAllowSendError: _isAllowSendError } =
    useGetCBridgeFees();
  const cBridgeFeeSorting = useRef(_cBridgeFeeSorting);
  cBridgeFeeSorting.current = _cBridgeFeeSorting;

  // todo ensure cbridge minmax range updates before loadingBridgeFees
  const isAllowSendError = useRef(_isAllowSendError);
  isAllowSendError.current = _isAllowSendError;

  const { stargateFeeSorting: _stargateFeeSorting } = useGetStargateFees();
  const stargateFeeSorting = useRef(_stargateFeeSorting);
  stargateFeeSorting.current = _stargateFeeSorting;

  const { layerZeroFeeSorting: _layerZeroFeeSorting } = useGetLayerZeroFees();
  const layerZeroFeeSorting = useRef(_layerZeroFeeSorting);
  layerZeroFeeSorting.current = _layerZeroFeeSorting;

  const { mesonFeeSorting: _mesonFeeSorting } = useGetMesonFees();
  const mesonFeeSorting = useRef(_mesonFeeSorting);
  mesonFeeSorting.current = _mesonFeeSorting;

  const { formatMessage } = useIntl();

  const toToken = useAppSelector((state) => state.transfer.toToken);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const max_slippage = useAppSelector((state) => state.transfer.slippage);
  const toAccount = useAppSelector((state) => state.transfer.toAccount);

  // Avoid `loadBridgeFees` to be repeatedly executed during toAccount input
  const toAccountRef = useRef<string | undefined>(toAccount.address);
  toAccountRef.current = toAccount.address;

  // todo ensure nativeBalance updates before loadingBridgeFees
  const { data: nativeBalance } = useBalance({ address, chainId: fromChain?.id });
  const nativeBalanceRef = useRef(nativeBalance);
  nativeBalanceRef.current = nativeBalance;

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const selectedBridgeTypeRef = useRef<BridgeType | undefined>(transferActionInfo?.bridgeType);
  selectedBridgeTypeRef.current = transferActionInfo?.bridgeType;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);

  const loadingBridgeFees = useCallback(
    async (params?: { triggerType?: TriggerType }) => {
      const { triggerType = 'new' } = params ?? {};

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
        if (selectedToken[bridge]) {
          bridgeTypeList.push(bridge);
        }
      });
      try {
        const amount = parseUnits(debouncedSendValue, selectedToken.decimals);
        const now = Date.now();
        lastTime = now;
        const response = await bridgeSDK.loadBridgeFees({
          bridgeType: bridgeTypeList,
          fromChainId: fromChain.id,
          fromAccount: address || DEFAULT_ADDRESS,
          toChainId: toChain?.id,
          sendValue: amount,
          fromTokenSymbol: selectedToken.symbol,
          publicClient,
          endPointId: {
            layerZeroV1: toToken?.layerZero?.raw?.endpointID,
            layerZeroV2: toToken?.stargate?.raw?.endpointID,
          },
          bridgeAddress: {
            stargate: selectedToken?.stargate?.raw?.address as `0x${string}`,
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
            fromTokenAddress: selectedToken.deBridge?.raw?.address as `0x${string}`,
            amount,
            toChainId: toChain?.id,
            toTokenAddress: toToken?.deBridge?.raw?.address as `0x${string}`,
            accesstoken: deBridgeAccessToken,
            userAddress:
              fromChain.chainType === 'solana'
                ? solanaAddress || DEFAULT_SOLANA_ADDRESS
                : address || DEFAULT_ADDRESS,
            toUserAddress:
              fromChain.chainType === 'solana'
                ? isSolanaAvailableToAccount
                  ? toAccountRef.current
                  : DEFAULT_ADDRESS
                : toChain.chainType === 'solana'
                ? isSolanaAvailableToAccount
                  ? toAccountRef.current
                  : DEFAULT_SOLANA_ADDRESS
                : undefined,
          },
        });
        // eslint-disable-next-line no-console
        console.log(
          'API response deBridge[0], cBridge[1], stargate[2], layerZero[3], meson[4]',
          response,
        );
        if (lastTime > now) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [debridgeEst, cbridgeEst, stargateEst, layerZeroEst, mesonEst] = response as any;
        // meson
        if (mesonEst.status === 'fulfilled' && mesonEst?.value) {
          if (mesonEst?.value?.error) {
            const error = mesonEst?.value?.error;
            dispatch(setRouteFees({ meson: undefined }));
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
            const feeSortingRes = await mesonFeeSorting.current(mesonEst.value.result);
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
          const feeSortingRes = await deBridgeFeeSorting.current(
            debridgeEst.value as IDeBridgeCreateQuoteResponse,
          );
          if (!feeSortingRes?.isFailedToGetGas) {
            dispatch(
              setEstimatedAmount({ deBridge: debridgeEst.value as IDeBridgeCreateQuoteResponse }),
            );
            valueArr.push({
              type: 'deBridge',
              value: formatUnits(
                BigInt(
                  (debridgeEst.value as IDeBridgeCreateQuoteResponse)?.estimation.dstChainTokenOut
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

              const feeSortingRes = await cBridgeFeeSorting.current(cbridgeEst.value);
              // Hide route on gas error
              if (feeSortingRes?.isFailedToGetGas) {
                dispatch(setEstimatedAmount({ cBridge: undefined }));
              }
              if (!isAllowSendError.current && !feeSortingRes?.isFailedToGetGas) {
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
          const feeSortingRes = await stargateFeeSorting.current(stargateEst.value);
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
          if (
            nativeBalanceRef.current?.value &&
            nativeBalanceRef.current.value < Number(nativeFee) &&
            isWalletCompatible
          ) {
            dispatch(
              setRouteError({ layerZero: `Insufficient ${nativeToken} to cover native fee` }),
            );
            dispatch(setEstimatedAmount({ layerZero: 'error' }));
          } else {
            const feeSortingRes = await layerZeroFeeSorting.current(layerZeroEst.value);
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
          const lastValue = valueArr.find(
            (e) => !e.isDisplayError && e.type === selectedBridgeTypeRef.current,
          );

          const highestValue = valueArr.reduce(
            (max, entry) =>
              Number(entry['value']) > Number(max['value']) &&
              entry.isIgnoreSorted === false &&
              entry.isDisplayError === false
                ? entry
                : max,
            { value: '0', type: '' },
          );

          if (triggerType === 'refresh' && lastValue) {
            preSelectRoute(response, lastValue.type as BridgeType);
          } else if (Number(highestValue?.value) > 0) {
            preSelectRoute(response, highestValue.type as BridgeType);
          }
        }
        dispatch(setIsGlobalFeeLoading(false));
        // eslint-disable-next-line
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message);
        dispatch(setIsGlobalFeeLoading(false));
      }
    },
    [
      dispatch,
      selectedToken,
      fromChain,
      toChain,
      debouncedSendValue,
      bridgeSDK,
      address,
      publicClient,
      toToken?.layerZero?.raw?.endpointID,
      toToken?.stargate?.raw?.endpointID,
      toToken?.meson?.raw?.id,
      toToken?.deBridge?.raw?.address,
      max_slippage,
      tronAddress,
      deBridgeAccessToken,
      solanaAddress,
      isSolanaAvailableToAccount,
      formatMessage,
      getToDecimals,
      isWalletCompatible,
      nativeToken,
      preSelectRoute,
    ],
  );

  return {
    loadingBridgeFees,
  };
};
