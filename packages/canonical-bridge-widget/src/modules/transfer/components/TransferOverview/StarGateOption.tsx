import { Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';

import { setTransferActionInfo } from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { formatNumber } from '@/core/utils/number';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { AllowedSendAmount } from '@/modules/transfer/components/TransferOverview/RouteInfo/AllowedSendAmount';
import { RouteMask } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteMask';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { useGetStargateFees } from '@/modules/aggregator/adapters/stargate/hooks/useGetStargateFees';

export const StarGateOption = () => {
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const nativeToken = useGetNativeToken();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const theme = useTheme();

  const { nativeFee, gasInfo, protocolFee, allowedSendAmount } = useGetStargateFees();
  const [isAllowSendError, setIsAllowSendError] = useState(false);

  useEffect(() => {
    setIsAllowSendError(false);
    if (!sendValue || !selectedToken || !toTokenInfo) {
      return;
    }
    if (allowedSendAmount?.min && allowedSendAmount?.max) {
      if (Number(sendValue) < Number(allowedSendAmount.min)) {
        setIsAllowSendError(true);
      } else if (Number(sendValue) > Number(allowedSendAmount.max)) {
        setIsAllowSendError(true);
      }
    }
  }, [allowedSendAmount, sendValue, selectedToken, toTokenInfo]);

  const feeDetails = useMemo(() => {
    let feeContent = '';
    const feeBreakdown = [];
    if (gasInfo?.gas && gasInfo?.gasPrice) {
      const gasFee = `${formatNumber(
        Number(formatUnits(gasInfo.gas * gasInfo.gasPrice, 18)),
        8,
      )} ${nativeToken}`;
      feeContent += gasFee;
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.gas-fee' }),
        value: gasFee,
      });
    }
    if (nativeFee) {
      const formattedNativeFee = formatNumber(Number(formatUnits(nativeFee, 18)), 8);
      feeContent += (!!feeContent ? ` + ` : '') + `${formattedNativeFee} ${nativeToken}`;
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.native-fee' }),
        value: `${formattedNativeFee} ${nativeToken}`,
      });
    }
    if (protocolFee) {
      feeContent += (!!feeContent ? ` + ` : '') + `${protocolFee}`;
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.protocol-fee' }),
        value: protocolFee,
      });
    }
    return { summary: feeContent ? feeContent : '--', breakdown: feeBreakdown };
  }, [gasInfo, nativeToken, protocolFee, nativeFee, formatMessage]);

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
        )} ${toTokenInfo.symbol}`
      : '--';
  }, [estimatedAmount, toTokenInfo, sendValue, getToDecimals]);

  const isError = useMemo(
    () => estimatedAmount?.stargate === 'error' || isAllowSendError || receiveAmt === '--' || false,
    [estimatedAmount?.stargate, isAllowSendError],
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
      {isError ? <RouteMask /> : null}

      <RouteName bridgeType="stargate" />
      <RouteTitle
        receiveAmt={receiveAmt}
        tokenAddress={toTokenInfo?.address}
        toTokenInfo={toTokenInfo}
      />
      <EstimatedArrivalTime bridgeType={'stargate'} />
      <FeesInfo
        bridgeType="stargate"
        summary={feeDetails.summary}
        breakdown={feeDetails.breakdown}
      />
      <AllowedSendAmount
        position={'static'}
        isError={isAllowSendError}
        zIndex={2}
        allowedSendAmount={allowedSendAmount}
      />
      <OtherRouteError bridgeType={'stargate'} />
    </Flex>
  );
};
