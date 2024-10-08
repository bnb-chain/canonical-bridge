import { Box, Flex, useBreakpointValue, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { formatNumber } from '@/core/utils/number';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { AllowedSendAmount } from '@/modules/transfer/components/TransferOverview/RouteInfo/AllowedSendAmount';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { useGetCBridgeFees } from '@/modules/aggregator/adapters/cBridge/hooks/useGetCBridgeFees';
import { useGetStargateFees } from '@/modules/aggregator/adapters/stargate/hooks/useGetStarGateFees';
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
  const { loadingBridgeFees } = useLoadingBridgeFees();
  const dispatch = useAppDispatch();
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const routeFees = useAppSelector((state) => state.transfer.routeFees);

  const receiveAmt = useMemo(() => {
    if (!Number(sendValue)) return null;
    if (transferActionInfo && transferActionInfo.bridgeType) {
      const bridgeType = transferActionInfo.bridgeType;
      const receiveValue = getSortedReceiveAmount();
      return Number(receiveValue[bridgeType].value);
    }
    return null;
  }, [getSortedReceiveAmount, transferActionInfo, sendValue]);

  const bridgeType = useMemo(() => transferActionInfo?.bridgeType, [transferActionInfo]);

  const { isAllowSendError, cBridgeAllowedAmt } = useGetCBridgeFees();

  const { allowedSendAmount: STAllowedSendAmount, isAllowSendError: STIsAllowSendError } =
    useGetStargateFees();

  const feeDetails = useMemo(() => {
    let feeContent = '';
    const feeBreakdown = [];
    if (bridgeType === 'cBridge' && routeFees?.['cBridge']) {
      feeContent = routeFees?.['cBridge'].summary;
      feeBreakdown.push(...routeFees?.['cBridge'].breakdown);
    } else if (bridgeType === 'deBridge' && routeFees?.['deBridge']) {
      feeContent = routeFees?.['deBridge'].summary;
      feeBreakdown.push(...routeFees?.['deBridge'].breakdown);
    } else if (bridgeType === 'stargate' && routeFees?.['stargate']) {
      feeContent = routeFees?.['stargate'].summary;
      feeBreakdown.push(...routeFees?.['stargate'].breakdown);
    } else if (bridgeType === 'layerZero' && routeFees?.['layerZero']) {
      feeContent = routeFees?.['layerZero'].summary;
      feeBreakdown.push(...routeFees?.['layerZero'].breakdown);
    }
    return { summary: feeContent ? feeContent : '--', breakdown: feeBreakdown };
  }, [bridgeType, routeFees]);

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
    // On mobile
    if (!isBase) return;
    if (sendValue === debouncedSendValue) {
      dispatch(setTransferActionInfo(undefined));
      if (!selectedToken || !Number(debouncedSendValue)) {
        dispatch(setEstimatedAmount(undefined));
        dispatch(setIsRefreshing(false));
        dispatch(setIsGlobalFeeLoading(false));
        return;
      }
      dispatch(setIsGlobalFeeLoading(true));
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
        {isBase && !!receiveAmt && !isGlobalFeeLoading ? (
          <RouteChangeButton onOpen={onOpen} />
        ) : null}
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
              {isBase && <RouteName bridgeType={bridgeType} isReceiveSection={true} />}
              {isBase && <RefreshingButton position={'absolute'} right={'16px'} top={'16px'} />}
              {bridgeType && (
                <RouteTitle
                  receiveAmt={receiveAmt ? formatNumber(Number(Number(receiveAmt)), 8) : undefined}
                  toTokenInfo={toTokenInfo?.[bridgeType]}
                />
              )}
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
            <NoRouteFound />
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
