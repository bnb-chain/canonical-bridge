import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';
import { ILayerZeroToken } from '@bnb-chain/canonical-bridge-sdk';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { setTransferActionInfo } from '@/modules/transfer/action';
import { formatNumber } from '@/core/utils/number';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { RouteWrapper } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteWrapper';

export const LayerZeroOption = () => {
  const dispatch = useAppDispatch();

  const { toTokenInfo, getToDecimals } = useToTokenInfo();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const routeError = useAppSelector((state) => state.transfer.routeError);

  const receiveAmt = useMemo(() => {
    return estimatedAmount &&
      toTokenInfo &&
      Number(sendValue) > 0 &&
      estimatedAmount?.['layerZero'] &&
      Number(estimatedAmount?.['layerZero']) > 0
      ? `${formatNumber(
          Number(formatUnits(BigInt(estimatedAmount?.['layerZero']), getToDecimals()['layerZero'])),
          8,
        )}`
      : '--';
  }, [estimatedAmount, toTokenInfo, sendValue, getToDecimals]);

  const isError = useMemo(
    () =>
      estimatedAmount?.layerZero === 'error' ||
      receiveAmt === '--' ||
      (routeError && routeError['layerZero']) ||
      false,
    [estimatedAmount?.layerZero, receiveAmt, routeError],
  );

  const onSelectBridge = useCallback(() => {
    if (!selectedToken?.layerZero?.raw?.bridgeAddress || isError) return;
    const bridgeAddress = selectedToken.layerZero.raw?.bridgeAddress;
    const details = selectedToken.layerZero.raw?.details || ({} as ILayerZeroToken['details']);
    dispatch(
      setTransferActionInfo({
        bridgeType: 'layerZero',
        bridgeAddress: bridgeAddress as `0x${string}`,
        details,
      }),
    );
  }, [selectedToken, dispatch, isError]);

  return (
    <RouteWrapper
      isSelected={transferActionInfo?.bridgeType === 'layerZero'}
      isError={isError}
      onSelectBridge={onSelectBridge}
    >
      <RouteName isError={isError} bridgeType="layerZero" receiveAmt={receiveAmt} />
      <RouteTitle
        isError={isError}
        receiveAmt={receiveAmt}
        toTokenInfo={toTokenInfo?.['layerZero']}
      />
      <EstimatedArrivalTime bridgeType={'layerZero'} />
      <FeesInfo isError={isError} bridgeType="layerZero" />
      <OtherRouteError bridgeType={'layerZero'} />
    </RouteWrapper>
  );
};
