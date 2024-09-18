import { Box, Flex, useColorMode, Image, useIntl, useTheme } from '@bnb-chain/space';
import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { setTransferActionInfo } from '@/modules/transfer/action';
import { formatNumber } from '@/core/utils/number';
import { useGetLayerZeroFees } from '@/modules/aggregator/adapters/layerZero/hooks/useGetLayerZeroFees';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { RouteMask } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteMask';
import { OtherRouteError } from '@/modules/transfer/components/TransferOverview/RouteInfo/OtherRouteError';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';

export const LayerZeroOption = () => {
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const nativeToken = useGetNativeToken();

  const { formatMessage } = useIntl();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const theme = useTheme();
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const { nativeFee, gasInfo } = useGetLayerZeroFees();

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
    return { summary: feeContent ? feeContent : '--', breakdown: feeBreakdown };
  }, [gasInfo, nativeToken, nativeFee, formatMessage]);

  const receiveAmt = useMemo(() => {
    return estimatedAmount &&
      toTokenInfo &&
      Number(sendValue) > 0 &&
      estimatedAmount?.['layerZero'] &&
      Number(estimatedAmount?.['layerZero']) > 0
      ? `~${formatNumber(
          Number(formatUnits(BigInt(estimatedAmount?.['layerZero']), getToDecimals()['layerZero'])),
          8,
        )} ${toTokenInfo.symbol}`
      : '--';
  }, [estimatedAmount, toTokenInfo, sendValue, getToDecimals]);

  const isError = useMemo(
    () => estimatedAmount?.layerZero === 'error' || false,
    [estimatedAmount?.layerZero],
  );

  const onSelectBridge = useCallback(() => {
    if (!selectedToken?.layerZero?.raw?.bridgeAddress || isError) return;
    const bridgeAddress = selectedToken.layerZero.raw?.bridgeAddress;
    dispatch(
      setTransferActionInfo({
        bridgeType: 'layerZero',
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
        transferActionInfo?.bridgeType === 'layerZero'
          ? theme.colors[colorMode].border.brand
          : theme.colors[colorMode].button.select.border
      }
      background={
        transferActionInfo?.bridgeType === 'layerZero' ? 'rgba(255, 233, 0, 0.06);' : 'none'
      }
      borderRadius={'8px'}
      padding={'12px'}
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
      <RouteName bridgeType="layerZero" />
      <RouteTitle
        receiveAmt={receiveAmt}
        tokenAddress={toTokenInfo?.address}
        toTokenInfo={toTokenInfo}
      />
      <FeesInfo
        bridgeType="layerZero"
        summary={feeDetails.summary}
        breakdown={feeDetails.breakdown}
      />
      <OtherRouteError bridgeType={'layerZero'} />
    </Flex>
  );
};
