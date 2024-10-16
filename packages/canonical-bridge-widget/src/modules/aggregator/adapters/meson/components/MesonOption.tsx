import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

import { setTransferActionInfo } from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { formatNumber } from '@/core/utils/number';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { AllowedSendAmount } from '@/modules/transfer/components/TransferOverview/RouteInfo/AllowedSendAmount';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { RouteWrapper } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteWrapper';

export const MesonOption = () => {
  const dispatch = useAppDispatch();

  const { toTokenInfo, getToDecimals } = useToTokenInfo();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const routeError = useAppSelector((state) => state.transfer.routeError);
  const routeFees = useAppSelector((state) => state.transfer.routeFees);

  const receiveAmt = useMemo(() => {
    return estimatedAmount &&
      toTokenInfo &&
      Number(sendValue) > 0 &&
      estimatedAmount?.['meson']?.[2].amountReceivedLD &&
      Number(estimatedAmount['meson']?.[2]?.amountReceivedLD) > 0
      ? `${formatNumber(
          Number(
            formatUnits(
              BigInt(estimatedAmount?.['meson']?.[2].amountReceivedLD),
              getToDecimals()['meson'] || 18,
            ),
          ),
          8,
        )}`
      : '--';
  }, [estimatedAmount, toTokenInfo, sendValue, getToDecimals]);

  const isError = useMemo(
    () =>
      estimatedAmount?.meson === 'error' ||
      (routeError && routeError?.['meson']) ||
      receiveAmt === '--' ||
      false,
    [estimatedAmount?.meson, receiveAmt, routeError],
  );

  const onSelectBridge = useCallback(() => {
    // if (!selectedToken?.meson?.raw?.bridgeAddress || isError) return;
    // const bridgeAddress = selectedToken.meson.raw?.bridgeAddress;
    // dispatch(
    //   setTransferActionInfo({
    //     bridgeType: 'meson',
    //     bridgeAddress: bridgeAddress as `0x${string}`,
    //   }),
    // );
  }, [selectedToken, dispatch, isError]);

  return (
    <RouteWrapper
      isError={isError}
      onSelectBridge={onSelectBridge}
      isSelected={transferActionInfo?.bridgeType === 'meson'}
    >
      <RouteName isError={isError} bridgeType="meson" />
      <RouteTitle isError={isError} receiveAmt={receiveAmt} toTokenInfo={toTokenInfo?.['meson']} />
      <EstimatedArrivalTime isError={isError} bridgeType={'meson'} />
      <FeesInfo
        isError={isError}
        bridgeType="meson"
        summary={routeFees?.meson?.summary ?? '--'}
        breakdown={routeFees?.meson?.breakdown}
      />
      {/* <AllowedSendAmount
        position={'static'}
        isError={isAllowSendError}
        zIndex={2}
        allowedSendAmount={allowedSendAmount}
      /> */}
      {/* {!isAllowSendError && <OtherRouteError bridgeType={'meson'} />} */}
    </RouteWrapper>
  );
};
