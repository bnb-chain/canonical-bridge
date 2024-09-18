import { Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { setTransferActionInfo } from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { formatNumber } from '@/core/utils/number';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { AllowedSendAmount } from '@/modules/transfer/components/TransferOverview/RouteInfo/AllowedSendAmount';
import { RouteMask } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteMask';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { useGetCBridgeFees } from '@/modules/aggregator/adapters/cBridge/hooks/useGetCBridgeFees';

export const CBridgeOption = () => {
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const nativeToken = useGetNativeToken();
  const { baseFee, protocolFee, gasInfo, isAllowSendError, bridgeAddress, cBridgeAllowedAmt } =
    useGetCBridgeFees();

  const { formatMessage } = useIntl();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
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
        )} ${toTokenInfo.symbol}`
      : '--';
  }, [estimatedAmount, toTokenInfo, sendValue, getToDecimals]);

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
    if (baseFee) {
      feeContent += (!!feeContent ? ` + ` : '') + `${baseFee}`;
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.base-fee' }),
        value: baseFee,
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
  }, [gasInfo, nativeToken, protocolFee, baseFee, formatMessage]);

  const isError = useMemo(
    () => estimatedAmount?.cBridge === 'error' || isAllowSendError || false,
    [estimatedAmount?.cBridge, isAllowSendError],
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
      padding={'12px'}
      position={'relative'}
      cursor={isError ? 'default' : 'pointer'}
      _hover={{
        borderColor: isError
          ? theme.colors[colorMode].button.select.border
          : theme.colors[colorMode].border.brand,
      }}
      onClick={onSelectBridge}
    >
      {isError ? <RouteMask /> : null}
      <RouteName bridgeType="cBridge" />
      <RouteTitle
        receiveAmt={receiveAmt}
        tokenAddress={toTokenInfo?.address}
        toTokenInfo={toTokenInfo}
      />
      <EstimatedArrivalTime bridgeType={'cBridge'} />
      <FeesInfo
        bridgeType="cBridge"
        summary={feeDetails.summary}
        breakdown={feeDetails.breakdown}
      />
      <AllowedSendAmount
        position={'static'}
        zIndex={2}
        isError={isAllowSendError}
        allowedSendAmount={
          cBridgeAllowedAmt && selectedToken
            ? {
                min: cBridgeAllowedAmt.min,
                max: cBridgeAllowedAmt.max,
              }
            : null
        }
      />
      <OtherRouteError bridgeType={'cBridge'} />
    </Flex>
  );
};
