import { Box, Flex, useBreakpointValue, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useEffect, useMemo } from 'react';
import { formatUnits } from 'viem';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { formatNumber } from '@/core/utils/number';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { useGetLayerZeroFees } from '@/modules/aggregator/adapters/layerZero/hooks/useGetLayerZeroFees';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { AllowedSendAmount } from '@/modules/transfer/components/TransferOverview/RouteInfo/AllowedSendAmount';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { useGetCBridgeFees } from '@/modules/aggregator/adapters/cBridge/hooks/useGetCBridgeFees';
import { useGetDeBridgeFees } from '@/modules/aggregator/adapters/deBridge/hooks/useGetDeBridgeFees';
import { useGetStargateFees } from '@/modules/aggregator/adapters/stargate/hooks/useGetStargateFees';
import { ReceiveLoading } from '@/modules/transfer/components/ReceiveInfo/ReceiveLoading';
import { NoRouteFound } from '@/modules/transfer/components/TransferOverview/NoRouteFound';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { RefreshingButton } from '@/modules/transfer/components/Button/RefreshingButton';
import { RouteChangeButton } from '@/modules/transfer/components/ReceiveInfo/RouteChangeButton';
import {
  setEstimatedAmount,
  setIsGlobalFeeLoading,
  setIsRefreshing,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { useLoadingBridgeFees } from '@/modules/transfer/hooks/useLoadingBridgeFees';

interface ReceiveInfoProps {
  onOpen: () => void;
}

export const ReceiveInfo = ({ onOpen }: ReceiveInfoProps) => {
  const { getSortedReceiveAmount } = useGetReceiveAmount();
  const { toTokenInfo } = useToTokenInfo();
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const nativeToken = useGetNativeToken();
  const { loadingBridgeFees } = useLoadingBridgeFees();
  const dispatch = useAppDispatch();
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const receiveAmt = useMemo(() => {
    if (!Number(sendValue)) return null;
    if (transferActionInfo && transferActionInfo.bridgeType) {
      const bridgeType = transferActionInfo.bridgeType;
      const receiveValue = getSortedReceiveAmount();
      return Number(receiveValue[bridgeType]);
    }
    return null;
  }, [getSortedReceiveAmount, transferActionInfo, sendValue]);

  const bridgeType = useMemo(() => transferActionInfo?.bridgeType, [transferActionInfo]);

  const {
    baseFee: CBBaseFee,
    protocolFee: CBProtocolFee,
    gasInfo: CBGasInfo,
    cBridgeAllowedAmt,
    isAllowSendError,
  } = useGetCBridgeFees();
  const {
    debridgeFee,
    marketMakerFee: DBMarketMakerFee,
    protocolFee: DBProtocolFee,
    gasInfo: DBGasInfo,
  } = useGetDeBridgeFees();
  const {
    nativeFee: STNativeFee,
    gasInfo: STGasInfo,
    protocolFee: STProtocolFee,
    allowedSendAmount: STAllowedSendAmount,
    isAllowSendError: STIsAllowSendError,
  } = useGetStargateFees();
  const { nativeFee: LZNativeFee, gasInfo: LZGasInfo } = useGetLayerZeroFees();

  const feeDetails = useMemo(() => {
    let feeContent = '';
    const feeBreakdown = [];
    // Gas
    const gasInfo =
      bridgeType === 'cBridge'
        ? CBGasInfo
        : bridgeType === 'deBridge'
        ? DBGasInfo
        : bridgeType === 'stargate'
        ? STGasInfo
        : bridgeType === 'layerZero'
        ? LZGasInfo
        : null;
    if (gasInfo && gasInfo?.gas && gasInfo?.gasPrice) {
      const gasFee = `${formatNumber(
        Number(formatUnits(gasInfo.gas * gasInfo.gasPrice, 18)),
        8,
      )} ${nativeToken}`;
      feeContent += gasFee;
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.gas-fee' }),
        value: gasFee,
      });
    }

    // Other fees
    if (bridgeType === 'cBridge') {
      if (CBBaseFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${CBBaseFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.base-fee' }),
          value: CBBaseFee,
        });
      }
      if (CBProtocolFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${CBProtocolFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.protocol-fee' }),
          value: CBProtocolFee,
        });
      }
    } else if (bridgeType === 'deBridge') {
      if (DBMarketMakerFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${DBMarketMakerFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.market-maker-fee' }),
          value: DBMarketMakerFee,
        });
      }
      if (debridgeFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${debridgeFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.debridge-fee' }),
          value: debridgeFee,
        });
      }
      if (DBProtocolFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${DBProtocolFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.protocol-fee' }),
          value: DBProtocolFee,
        });
      }
    } else if (bridgeType === 'stargate') {
      if (STNativeFee) {
        const formattedNativeFee = formatNumber(Number(formatUnits(STNativeFee, 18)), 8);
        feeContent += (!!feeContent ? ` + ` : '') + `${formattedNativeFee} ${nativeToken}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.native-fee' }),
          value: `${formattedNativeFee} ${nativeToken}`,
        });
      }
      if (STProtocolFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${STProtocolFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.protocol-fee' }),
          value: STProtocolFee,
        });
      }
    } else if (bridgeType === 'layerZero') {
      if (LZNativeFee) {
        const formattedNativeFee = formatNumber(Number(formatUnits(LZNativeFee, 18)), 8);
        feeContent += (!!feeContent ? ` + ` : '') + `${formattedNativeFee} ${nativeToken}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.native-fee' }),
          value: `${formattedNativeFee} ${nativeToken}`,
        });
      }
    }
    return { summary: feeContent ? feeContent : '--', breakdown: feeBreakdown };
  }, [
    formatMessage,
    bridgeType,
    CBGasInfo,
    DBGasInfo,
    STGasInfo,
    LZGasInfo,
    CBBaseFee,
    CBProtocolFee,
    DBMarketMakerFee,
    debridgeFee,
    DBProtocolFee,
    STNativeFee,
    STProtocolFee,
    LZNativeFee,
    nativeToken,
  ]);

  const allowedAmtContent = useMemo(() => {
    if (cBridgeAllowedAmt && transferActionInfo?.bridgeType === 'cBridge') {
      return cBridgeAllowedAmt;
    } else if (STAllowedSendAmount && transferActionInfo?.bridgeType === 'stargate') {
      return STAllowedSendAmount;
    }
    return null;
  }, [cBridgeAllowedAmt, STAllowedSendAmount, transferActionInfo]);

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);

  useEffect(() => {
    if (!isBase) return;
    if (sendValue === debouncedSendValue) {
      dispatch(setTransferActionInfo(undefined));
      if (!selectedToken || !Number(debouncedSendValue)) {
        dispatch(setEstimatedAmount(undefined));
        dispatch(setIsRefreshing(false));
        dispatch(setIsGlobalFeeLoading(false));
        return;
      }
      dispatch(setIsRefreshing(true));
      loadingBridgeFees();
      dispatch(setIsRefreshing(false));
    } else {
      dispatch(setIsGlobalFeeLoading(true));
    }
  }, [selectedToken, debouncedSendValue, dispatch, sendValue, loadingBridgeFees, isBase]);

  return !!Number(sendValue) ? (
    <Flex flexDir={'column'} gap={'12px'}>
      <Flex flexDir={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Box color={theme.colors[colorMode].input.title} fontSize={'14px'} fontWeight={400}>
          {formatMessage({ id: 'you.receive.title' })}
        </Box>
        {isBase ? <RouteChangeButton onOpen={onOpen} /> : null}
      </Flex>
      <Flex
        borderRadius={'8px'}
        p={'16px'}
        flexDir={'column'}
        gap={'12px'}
        background={theme.colors[colorMode].receive.background}
        position={'relative'}
      >
        {debouncedSendValue === sendValue ? (
          receiveAmt && !isGlobalFeeLoading ? (
            <>
              <RouteName bridgeType={bridgeType} isReceiveSection={true} />
              {isBase && <RefreshingButton position={'absolute'} right={'16px'} top={'16px'} />}
              <RouteTitle
                receiveAmt={receiveAmt ? formatNumber(Number(Number(receiveAmt)), 8) : undefined}
                tokenAddress={toTokenInfo?.address}
                toTokenInfo={toTokenInfo}
              />
              <Flex flexDir={'column'} gap={'4px'}>
                <EstimatedArrivalTime bridgeType={bridgeType} />
                <FeesInfo
                  bridgeType={bridgeType}
                  summary={feeDetails.summary}
                  breakdown={feeDetails.breakdown}
                />
                <AllowedSendAmount
                  allowedSendAmount={allowedAmtContent}
                  isError={
                    bridgeType === 'cBridge'
                      ? isAllowSendError
                      : bridgeType === 'stargate'
                      ? STIsAllowSendError
                      : false
                  }
                />
              </Flex>
            </>
          ) : !receiveAmt && !isGlobalFeeLoading ? (
            <NoRouteFound onOpen={onOpen} />
          ) : (
            <ReceiveLoading />
          )
        ) : (
          <ReceiveLoading />
        )}
      </Flex>
    </Flex>
  ) : null;
};
