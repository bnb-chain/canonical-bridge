import { Flex, useColorMode, useTheme } from '@bnb-chain/space';
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
import { useGetStargateFees } from '@/modules/aggregator/adapters/stargate/hooks/useGetStarGateFees';

export const StarGateOption = () => {
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { allowedSendAmount, isAllowSendError } = useGetStargateFees();

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
      estimatedAmount?.['stargate']?.[2].amountReceivedLD &&
      Number(estimatedAmount['stargate']?.[2]?.amountReceivedLD) > 0
      ? `${formatNumber(
          Number(
            formatUnits(
              BigInt(estimatedAmount?.['stargate']?.[2].amountReceivedLD),
              getToDecimals()['stargate'] || 18,
            ),
          ),
          8,
        )}`
      : '--';
  }, [estimatedAmount, toTokenInfo, sendValue, getToDecimals]);

  const isError = useMemo(
    () =>
      estimatedAmount?.stargate === 'error' ||
      isAllowSendError ||
      (routeError && routeError?.['stargate']) ||
      receiveAmt === '--' ||
      false,
    [estimatedAmount?.stargate, isAllowSendError, receiveAmt, routeError],
  );

  const onSelectBridge = useCallback(() => {
    if (!selectedToken?.stargate?.raw?.bridgeAddress || isError) return;
    const bridgeAddress = selectedToken.stargate.raw?.bridgeAddress;
    dispatch(
      setTransferActionInfo({
        bridgeType: 'stargate',
        bridgeAddress: bridgeAddress as `0x${string}`,
      }),
    );
  }, [selectedToken, dispatch, isError]);

  return (
    <Flex
      flex={1}
      flexDir={'column'}
      gap={'4px'}
      border={`1px solid`}
      height={'fit-content'}
      borderColor={
        transferActionInfo?.bridgeType === 'stargate'
          ? theme.colors[colorMode].border.brand
          : theme.colors[colorMode].button.select.border
      }
      background={
        transferActionInfo?.bridgeType === 'stargate'
          ? theme.colors[colorMode].route.background.highlight
          : 'none'
      }
      borderRadius={'8px'}
      padding={'16px'}
      cursor={isError ? 'default' : 'pointer'}
      _hover={{
        borderColor: isError
          ? theme.colors[colorMode].button.select.border
          : theme.colors[colorMode].border.brand,
      }}
      onClick={onSelectBridge}
      position={'relative'}
    >
      <RouteName isError={isError} bridgeType="stargate" />
      <RouteTitle
        isError={isError}
        receiveAmt={receiveAmt}
        toTokenInfo={toTokenInfo?.['stargate']}
      />
      <EstimatedArrivalTime isError={isError} bridgeType={'stargate'} />
      <FeesInfo
        isError={isError}
        bridgeType="stargate"
        summary={routeFees?.stargate?.summary ?? '--'}
        breakdown={routeFees?.stargate?.breakdown}
      />
      <AllowedSendAmount
        position={'static'}
        isError={isAllowSendError}
        zIndex={2}
        allowedSendAmount={allowedSendAmount}
      />
      {!isAllowSendError && <OtherRouteError bridgeType={'stargate'} />}
    </Flex>
  );
};
