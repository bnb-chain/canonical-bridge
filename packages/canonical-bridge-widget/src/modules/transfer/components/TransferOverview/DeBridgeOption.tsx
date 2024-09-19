import { Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

import { setTransferActionInfo } from '@/modules/transfer/action';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { formatNumber } from '@/core/utils/number';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { RouteMask } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteMask';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
import { useGetDeBridgeFees } from '@/modules/aggregator/adapters/deBridge/hooks/useGetDeBridgeFees';

interface DeBridgeOptionProps {
  isReceiveTab?: boolean;
}

export const DeBridgeOption = ({}: DeBridgeOptionProps) => {
  const nativeToken = useGetNativeToken();
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { formatMessage } = useIntl();

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const theme = useTheme();
  const { protocolFee, marketMakerFee, debridgeFee, gasInfo } = useGetDeBridgeFees();

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
    if (marketMakerFee) {
      feeContent += (!!feeContent ? ` + ` : '') + `${marketMakerFee}`;
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.market-maker-fee' }),
        value: marketMakerFee,
      });
    }
    if (debridgeFee) {
      feeContent += (!!feeContent ? ` + ` : '') + `${debridgeFee}`;
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.debridge-fee' }),
        value: debridgeFee,
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
  }, [debridgeFee, gasInfo, marketMakerFee, nativeToken, protocolFee, formatMessage]);

  const isError = useMemo(
    () => estimatedAmount?.deBridge === 'error' || receiveAmt === '--' || false,
    [estimatedAmount?.deBridge, receiveAmt],
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
      {isError ? <RouteMask /> : null}
      <RouteName bridgeType="deBridge" />
      <RouteTitle
        receiveAmt={receiveAmt}
        tokenAddress={toTokenInfo?.address}
        toTokenInfo={toTokenInfo}
      />
      <EstimatedArrivalTime bridgeType={'deBridge'} />
      <FeesInfo
        bridgeType="deBridge"
        summary={feeDetails.summary}
        breakdown={feeDetails.breakdown}
      />
      <OtherRouteError bridgeType={'deBridge'} />
    </Flex>
  );
};
