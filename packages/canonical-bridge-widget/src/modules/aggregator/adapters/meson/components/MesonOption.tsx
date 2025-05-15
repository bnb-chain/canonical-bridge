import { useCallback, useMemo } from 'react';

import { setTransferActionInfo } from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
// import { AllowedSendAmount } from '@/modules/transfer/components/TransferOverview/RouteInfo/AllowedSendAmount';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { RouteWrapper } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteWrapper';
import { formatNumber } from '@/core/utils/number';

export const MesonOption = () => {
  const dispatch = useAppDispatch();

  const { toTokenInfo } = useToTokenInfo();

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const routeError = useAppSelector((state) => state.transfer.routeError);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const receiveAmt = useMemo(() => {
    return Number(estimatedAmount?.meson) ? formatNumber(estimatedAmount?.meson, 8) : '--';
  }, [estimatedAmount?.meson]);

  const isError = useMemo(
    () =>
      estimatedAmount?.meson === 'error' ||
      (routeError && routeError?.['meson']) ||
      receiveAmt === '--' ||
      false,
    [estimatedAmount?.meson, receiveAmt, routeError],
  );

  const onSelectBridge = useCallback(() => {
    if (!fromChain?.meson?.raw?.address || isError) return;
    const bridgeAddress = fromChain?.meson?.raw?.address;
    dispatch(
      setTransferActionInfo({
        bridgeType: 'meson',
        bridgeAddress: bridgeAddress as `0x${string}`,
      }),
    );
  }, [fromChain, dispatch, isError]);

  return (
    <RouteWrapper
      isError={isError}
      onSelectBridge={onSelectBridge}
      isSelected={transferActionInfo?.bridgeType === 'meson'}
    >
      <RouteName isError={isError} bridgeType="meson" receiveAmt={receiveAmt} />
      <RouteTitle isError={isError} receiveAmt={receiveAmt} toTokenInfo={toTokenInfo?.['meson']} />
      <EstimatedArrivalTime isError={isError} bridgeType={'meson'} />
      <FeesInfo isError={isError} bridgeType="meson" />
      {/* <AllowedSendAmount
        position={'static'}
        isError={isAllowSendError}
        allowedSendAmount={allowedSendAmount}
      /> */}
      <OtherRouteError bridgeType={'meson'} />
    </RouteWrapper>
  );
};
