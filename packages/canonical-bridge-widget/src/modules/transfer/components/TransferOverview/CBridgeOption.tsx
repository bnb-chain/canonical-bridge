import { Flex, useColorMode, useTheme } from '@bnb-chain/space';
import { useCallback, useEffect, useMemo } from 'react';
import { formatUnits } from 'viem';

import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { setRouteError, setTransferActionInfo } from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { formatNumber } from '@/core/utils/number';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { AllowedSendAmount } from '@/modules/transfer/components/TransferOverview/RouteInfo/AllowedSendAmount';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { useGetCBridgeFees } from '@/modules/aggregator/adapters/cBridge/hooks/useGetCBridgeFees';

export const CBridgeOption = () => {
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { isAllowSendError, bridgeAddress, cBridgeAllowedAmt } = useGetCBridgeFees();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const routeError = useAppSelector((state) => state.transfer.routeError);
  const routeFees = useAppSelector((state) => state.transfer.routeFees);
  const theme = useTheme();

  const receiveAmt = useMemo(() => {
    return estimatedAmount &&
      estimatedAmount?.['cBridge'] &&
      toTokenInfo &&
      Number(sendValue) > 0 &&
      !!getToDecimals()['cBridge'] &&
      Number(estimatedAmount?.['cBridge']?.estimated_receive_amt) > 0
      ? `${formatNumber(
          Number(
            formatUnits(
              estimatedAmount?.['cBridge']?.estimated_receive_amt,
              getToDecimals()['cBridge'],
            ),
          ),
          8,
        )}`
      : '--';
  }, [estimatedAmount, toTokenInfo, sendValue, getToDecimals]);

  useEffect(() => {
    if (Number(estimatedAmount?.['cBridge']?.estimated_receive_amt) < 0) {
      dispatch(
        setRouteError({
          cBridge: 'Please increase your send amount',
        }),
      );
    }
  }, [dispatch, estimatedAmount]);

  const isError = useMemo(
    () =>
      estimatedAmount?.cBridge === 'error' ||
      (routeError && routeError?.['cBridge']) ||
      isAllowSendError ||
      receiveAmt === '--' ||
      false,
    [estimatedAmount?.cBridge, isAllowSendError, receiveAmt, routeError],
  );

  const onSelectBridge = useCallback(() => {
    if (isError) return;
    dispatch(
      setTransferActionInfo({
        bridgeType: 'cBridge',
        bridgeAddress: bridgeAddress as `0x${string}`,
      }),
    );
  }, [bridgeAddress, dispatch, isError]);

  return (
    <Flex
      flex={1}
      flexDir={'column'}
      gap={'4px'}
      border={`1px solid`}
      height={'fit-content'}
      borderColor={
        transferActionInfo?.bridgeType === 'cBridge'
          ? theme.colors[colorMode].border.brand
          : theme.colors[colorMode].button.select.border
      }
      background={
        transferActionInfo?.bridgeType === 'cBridge' ? 'rgba(255, 233, 0, 0.06);' : 'none'
      }
      borderRadius={'8px'}
      padding={'16px'}
      position={'relative'}
      cursor={isError ? 'default' : 'pointer'}
      _hover={{
        borderColor: isError
          ? theme.colors[colorMode].button.select.border
          : theme.colors[colorMode].border.brand,
      }}
      onClick={onSelectBridge}
    >
      <RouteName isError={isError} bridgeType="cBridge" />
      <RouteTitle
        isError={isError}
        receiveAmt={receiveAmt}
        toTokenInfo={toTokenInfo?.['cBridge']}
      />
      <EstimatedArrivalTime isError={isError} bridgeType={'cBridge'} />
      <FeesInfo
        isError={isError}
        bridgeType="cBridge"
        summary={routeFees?.['cBridge']?.summary ?? '--'}
        breakdown={routeFees?.['cBridge']?.breakdown}
      />
      <AllowedSendAmount
        position={'static'}
        zIndex={2}
        isError={isAllowSendError}
        allowedSendAmount={
          !!Number(cBridgeAllowedAmt.min) && !!Number(cBridgeAllowedAmt.max) && selectedToken
            ? {
                min: cBridgeAllowedAmt.min,
                max: cBridgeAllowedAmt.max,
              }
            : null
        }
      />
      {!isAllowSendError && <OtherRouteError bridgeType={'cBridge'} />}
    </Flex>
  );
};
