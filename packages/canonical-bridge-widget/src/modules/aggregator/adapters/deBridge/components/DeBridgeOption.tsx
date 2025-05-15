import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

import { setTransferActionInfo } from '@/modules/transfer/action';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { formatNumber } from '@/core/utils/number';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { RouteWrapper } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteWrapper';

interface DeBridgeOptionProps {
  isReceiveTab?: boolean;
}

export const DeBridgeOption = ({}: DeBridgeOptionProps) => {
  const dispatch = useAppDispatch();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const routeError = useAppSelector((state) => state.transfer.routeError);

  const receiveAmt = useMemo(() => {
    return estimatedAmount?.['deBridge'] &&
      toTokenInfo &&
      Number(estimatedAmount?.['deBridge']?.estimation?.dstChainTokenOut?.amount) > 0 &&
      !!getToDecimals().deBridge
      ? formatNumber(
          Number(
            formatUnits(
              BigInt(estimatedAmount?.['deBridge']?.estimation?.dstChainTokenOut?.amount),
              getToDecimals().deBridge,
            ),
          ),
          8,
        )
      : '--';
  }, [estimatedAmount, toTokenInfo, getToDecimals]);

  const isError = useMemo(
    () =>
      estimatedAmount?.deBridge === 'error' ||
      receiveAmt === '--' ||
      (routeError && routeError?.['deBridge']) ||
      false,
    [estimatedAmount?.deBridge, receiveAmt, routeError],
  );

  const onSelectBridge = useCallback(() => {
    if (!estimatedAmount || !estimatedAmount?.['deBridge']?.tx || isError) {
      return;
    }
    dispatch(
      setTransferActionInfo({
        bridgeType: 'deBridge',
        bridgeAddress: estimatedAmount['deBridge'].tx.to as `0x${string}`,
        data: estimatedAmount['deBridge'].tx.data,
        value: estimatedAmount['deBridge'].tx.value,
        orderId: estimatedAmount['deBridge'].orderId,
      }),
    );
  }, [estimatedAmount, dispatch, isError]);

  return (
    <RouteWrapper
      isSelected={transferActionInfo?.bridgeType === 'deBridge'}
      isError={isError}
      onSelectBridge={onSelectBridge}
    >
      <RouteName isError={isError} bridgeType="deBridge" receiveAmt={receiveAmt} />
      <RouteTitle
        isError={isError}
        receiveAmt={receiveAmt}
        toTokenInfo={toTokenInfo?.['deBridge']}
      />
      <EstimatedArrivalTime isError={isError} bridgeType={'deBridge'} />
      <FeesInfo isError={isError} bridgeType="deBridge" />
      <OtherRouteError bridgeType={'deBridge'} />
    </RouteWrapper>
  );
};
