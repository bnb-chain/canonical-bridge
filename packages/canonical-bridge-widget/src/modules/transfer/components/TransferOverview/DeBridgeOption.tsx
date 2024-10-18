import { Flex, useColorMode, useTheme } from '@bnb-chain/space';
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

interface DeBridgeOptionProps {
  isReceiveTab?: boolean;
}

export const DeBridgeOption = ({}: DeBridgeOptionProps) => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const routeError = useAppSelector((state) => state.transfer.routeError);
  const routeFees = useAppSelector((state) => state.transfer.routeFees);
  const theme = useTheme();

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
    <Flex
      flex={1}
      gap={'4px'}
      flexDir={'column'}
      height={'fit-content'}
      border={`1px solid`}
      borderColor={
        transferActionInfo?.bridgeType === 'deBridge'
          ? theme.colors[colorMode].border.brand
          : theme.colors[colorMode].button.select.border
      }
      background={
        transferActionInfo?.bridgeType === 'deBridge' ? 'rgba(255, 233, 0, 0.06);' : 'none'
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
      <RouteName isError={isError} bridgeType="deBridge" />
      <RouteTitle
        isError={isError}
        receiveAmt={receiveAmt}
        toTokenInfo={toTokenInfo?.['deBridge']}
      />
      <EstimatedArrivalTime isError={isError} bridgeType={'deBridge'} />
      <FeesInfo
        isError={isError}
        bridgeType="deBridge"
        summary={routeFees?.['deBridge']?.summary ?? '--'}
        breakdown={routeFees?.['deBridge']?.breakdown}
      />
      <OtherRouteError bridgeType={'deBridge'} />
    </Flex>
  );
};
