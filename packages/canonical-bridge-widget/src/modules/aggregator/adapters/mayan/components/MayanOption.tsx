import { memo, useCallback, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { formatNumber } from '@/core/utils/number';
import { setTransferActionInfo } from '@/modules/transfer/action';
import { RouteWrapper } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteWrapper';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { MAYAN_FORWARDER_CONTRACT } from '@/core/constants';

interface MayanOptionProps {}

export const MayanOption = memo<MayanOptionProps>(function MayanOption() {
  const dispatch = useAppDispatch();

  const { toTokenInfo } = useToTokenInfo();

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const routeError = useAppSelector((state) => state.transfer.routeError);
  // const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const receiveAmt = useMemo(() => {
    return Number(estimatedAmount?.mayan?.value)
      ? formatNumber(estimatedAmount?.mayan?.value, 8)
      : '--';
  }, [estimatedAmount?.mayan]);

  const isError = useMemo(
    () =>
      estimatedAmount?.mayan === 'error' ||
      (routeError && routeError?.['mayan']) ||
      receiveAmt === '--' ||
      false,
    [estimatedAmount?.mayan, receiveAmt, routeError],
  );

  const onSelectBridge = useCallback(() => {
    if (/*!fromChain?.mayan?.raw?.tokenBridgeAddress || */ isError) return;
    // const bridgeAddress = fromChain?.mayan?.raw?.tokenBridgeAddress;
    dispatch(
      setTransferActionInfo({
        bridgeType: 'mayan',
        bridgeAddress: MAYAN_FORWARDER_CONTRACT as `0x${string}`,
        quote: estimatedAmount?.mayan?.quote,
      }),
    );
  }, [dispatch, isError, estimatedAmount?.mayan?.quote]);

  return (
    <RouteWrapper
      isError={isError}
      onSelectBridge={onSelectBridge}
      isSelected={transferActionInfo?.bridgeType === 'mayan'}
    >
      <RouteName isError={isError} bridgeType="mayan" receiveAmt={receiveAmt} />
      <RouteTitle isError={isError} receiveAmt={receiveAmt} toTokenInfo={toTokenInfo?.['mayan']} />
      <EstimatedArrivalTime isError={isError} bridgeType={'mayan'} />
      <FeesInfo isError={isError} bridgeType="mayan" />
      <OtherRouteError bridgeType={'mayan'} />
    </RouteWrapper>
  );
});
