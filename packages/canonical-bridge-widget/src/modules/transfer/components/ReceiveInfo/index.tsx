import {
  Box,
  Flex,
  useColorMode,
  useIntl,
  useTheme,
  Collapse,
  useBreakpointValue,
  Typography,
} from '@bnb-chain/space';
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

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;
  const toToken = useAppSelector((state) => state.transfer.toToken);

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
    if (!isBase || !toToken || !sendValue) return;

    // On mobile
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
  }, [selectedToken, debouncedSendValue, dispatch, sendValue, loadingBridgeFees, isBase, toToken]);

  const isHideSection = useMemo(() => {
    // no receive amount and some routes are displayed
    if (!toToken) return true;
    if (!Number(sendValue)) return true;
    if (isGlobalFeeLoading) return false;
    return (
      !Number(sendValue) ||
      (!isBase &&
        estimatedAmount &&
        !Object.values(estimatedAmount).every((element) => element === undefined) &&
        !receiveAmt)
    );
  }, [toToken, sendValue, isGlobalFeeLoading, isBase, estimatedAmount, receiveAmt]);

  const isHideRouteButton = useMemo(() => {
    return (
      estimatedAmount && Object.values(estimatedAmount).every((element) => element === undefined)
    );
  }, [estimatedAmount]);

  return (
    <Box className="bccb-widget-received-info-container" mb={isHideSection ? '-24px' : 0}>
      <Collapse in={!isHideSection} animateOpacity>
        <Flex flexDir={'column'} gap={'8px'}>
          <Flex
            className="bccb-widget-received-info-title"
            flexDir={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Typography
              variant={'label'}
              size={'md'}
              color={theme.colors[colorMode].text.placeholder}
            >
              {formatMessage({ id: 'you.receive.title' })}
            </Typography>
            {!isHideRouteButton ? (
              <Box
                className="bccb-widget-received-info-route-open"
                display={{ base: 'block', lg: 'none' }}
              >
                <RouteChangeButton onOpen={onOpen} />
              </Box>
            ) : null}
          </Flex>
          <Flex
            className="bccb-widget-received-info-route-content"
            minH={'102px'}
            borderRadius={'8px'}
            p={'12px'}
            flexDir={'column'}
            gap={'8px'}
            background={theme.colors[colorMode].receive.background}
            position={'relative'}
          >
            {debouncedSendValue === sendValue ? (
              receiveAmt && !isGlobalFeeLoading ? (
                <>
                  {
                    <Box display={'block'}>
                      <RouteName bridgeType={bridgeType} isReceiveSection={true} />
                    </Box>
                  }
                  {
                    <Box
                      display={{ base: 'block', lg: 'none' }}
                      mb={'-12px'}
                      sx={{
                        svg: {
                          w: '29px',
                          h: '29px',
                        },
                      }}
                    >
                      <RefreshingButton
                        boxProps={{
                          position: 'absolute',
                          right: '12px',
                          top: '10px',
                        }}
                      />
                    </Box>
                  }
                  {bridgeType && (
                    <RouteTitle
                      receiveAmt={
                        receiveAmt ? formatNumber(Number(receiveAmt), 8, false) : undefined
                      }
                      toTokenInfo={toTokenInfo?.[bridgeType]}
                      hoverToShowTokenAddress={false}
                    />
                  )}
                  <Flex flexDir={'column'} gap={'4px'}>
                    <EstimatedArrivalTime bridgeType={bridgeType} />
                    <FeesInfo bridgeType={bridgeType} />
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
      </Collapse>
    </Box>
  );
};
