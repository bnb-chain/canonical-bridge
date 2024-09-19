import { Box, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useMemo } from 'react';
import { formatUnits } from 'viem';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { formatNumber } from '@/core/utils/number';
import { useGetCBridgeFees } from '@/modules/bridges/cbridge/hooks/useGetCBridgeFees';
import { useGetDeBridgeFees } from '@/modules/bridges/debridge/hooks/useGetDeBridgeFees';
import { useGetStarGateFees } from '@/modules/bridges/stargate/hooks/useGetStarGateFees';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { useGetLayerZeroFees } from '@/modules/bridges/layerZero/hooks/useGetLayerZeroFees';
import { RouteTitle } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteTitle';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/RouteInfo/EstimatedArrivalTime';
import { FeesInfo } from '@/modules/transfer/components/TransferOverview/RouteInfo/FeesInfo';
import { AllowedSendAmount } from '@/modules/transfer/components/TransferOverview/RouteInfo/AllowedSendAmount';
import { RouteName } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteName';
export const ReceiveInfo = () => {
  const { getSortedReceiveAmount } = useGetReceiveAmount();
  const { getToDecimals, toTokenInfo } = useToTokenInfo();
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const nativeToken = useGetNativeToken();

  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);

  const receiveAmt = useMemo(() => {
    if (transferActionInfo && transferActionInfo.bridgeType) {
      const bridgeType = transferActionInfo.bridgeType;
      const receiveValue = getSortedReceiveAmount();
      return receiveValue[bridgeType];
    }
    return null;
  }, [getSortedReceiveAmount, transferActionInfo]);

  const bridgeType = useMemo(() => transferActionInfo?.bridgeType, [transferActionInfo]);

  const {
    baseFee: CBBaseFee,
    protocolFee: CBProtocolFee,
    gasInfo: CBGasInfo,
    cBridgeAllowedAmt,
  } = useGetCBridgeFees();
  const {
    debridgeFee,
    marketMakerFee: DBMarketMakerFee,
    protocolFee: DBProtocolFee,
    gasInfo: DBGasInfo,
  } = useGetDeBridgeFees();
  const {
    nativeFee: STNativeFee,
    gasInfo: STGasInfo,
    protocolFee: STProtocolFee,
    allowedSendAmount: STAllowedSendAmount,
  } = useGetStarGateFees();
  const { nativeFee: LZNativeFee, gasInfo: LZGasInfo } = useGetLayerZeroFees();

  const decimals = useMemo(
    () => (bridgeType && getToDecimals()?.[bridgeType]) || 18,
    [getToDecimals, bridgeType],
  );

  const feeDetails = useMemo(() => {
    let feeContent = '';
    const feeBreakdown = [];
    // Gas
    const gasInfo =
      bridgeType === 'cBridge'
        ? CBGasInfo
        : bridgeType === 'deBridge'
        ? DBGasInfo
        : bridgeType === 'stargate'
        ? STGasInfo
        : bridgeType === 'layerZero'
        ? LZGasInfo
        : null;
    if (gasInfo && gasInfo?.gas && gasInfo?.gasPrice) {
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

    // Other fees
    if (bridgeType === 'cBridge') {
      if (CBBaseFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${CBBaseFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.base-fee' }),
          value: CBBaseFee,
        });
      }
      if (CBProtocolFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${CBProtocolFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.protocol-fee' }),
          value: CBProtocolFee,
        });
      }
    } else if (bridgeType === 'deBridge') {
      if (DBMarketMakerFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${DBMarketMakerFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.market-maker-fee' }),
          value: DBMarketMakerFee,
        });
      }
      if (debridgeFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${debridgeFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.debridge-fee' }),
          value: debridgeFee,
        });
      }
      if (DBProtocolFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${DBProtocolFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.protocol-fee' }),
          value: DBProtocolFee,
        });
      }
    } else if (bridgeType === 'stargate') {
      if (STNativeFee) {
        const formattedNativeFee = formatNumber(Number(formatUnits(STNativeFee, 18)), 8);
        feeContent += (!!feeContent ? ` + ` : '') + `${formattedNativeFee} ${nativeToken}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.native-fee' }),
          value: `${formattedNativeFee} ${nativeToken}`,
        });
      }
      if (STProtocolFee) {
        feeContent += (!!feeContent ? ` + ` : '') + `${STProtocolFee}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.protocol-fee' }),
          value: STProtocolFee,
        });
      }
    } else if (bridgeType === 'layerZero') {
      if (LZNativeFee) {
        const formattedNativeFee = formatNumber(Number(formatUnits(LZNativeFee, 18)), 8);
        feeContent += (!!feeContent ? ` + ` : '') + `${formattedNativeFee} ${nativeToken}`;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.native-fee' }),
          value: `${formattedNativeFee} ${nativeToken}`,
        });
      }
    }
    return { summary: feeContent ? feeContent : '--', breakdown: feeBreakdown };
  }, [
    formatMessage,
    bridgeType,
    CBGasInfo,
    DBGasInfo,
    STGasInfo,
    LZGasInfo,
    CBBaseFee,
    CBProtocolFee,
    DBMarketMakerFee,
    debridgeFee,
    DBProtocolFee,
    STNativeFee,
    STProtocolFee,
    LZNativeFee,
    nativeToken,
  ]);

  const allowedAmtContent = useMemo(() => {
    if (cBridgeAllowedAmt && transferActionInfo?.bridgeType === 'cBridge') {
      return cBridgeAllowedAmt;
    } else if (STAllowedSendAmount && transferActionInfo?.bridgeType === 'stargate') {
      return STAllowedSendAmount;
    }
    return null;
  }, [cBridgeAllowedAmt, STAllowedSendAmount, transferActionInfo]);

  return receiveAmt ? (
    <Flex flexDir={'column'} gap={'12px'}>
      <Flex flexDir={'row'} justifyContent={'space-between'}>
        <Box color={theme.colors[colorMode].input.title} fontSize={'14px'} fontWeight={400}>
          {formatMessage({ id: 'you.receive.title' })}
        </Box>
      </Flex>
      <Flex
        borderRadius={'8px'}
        p={'16px'}
        flexDir={'column'}
        gap={'12px'}
        background={theme.colors[colorMode].receive.background}
      >
        <RouteName bridgeType={bridgeType} />
        <RouteTitle
          receiveAmt={formatNumber(Number(formatUnits(BigInt(receiveAmt), decimals)), 8)}
          tokenAddress={toTokenInfo?.address}
          toTokenInfo={toTokenInfo}
        />
        <Flex flexDir={'column'} gap={'4px'}>
          <EstimatedArrivalTime bridgeType={bridgeType} />
          <FeesInfo
            bridgeType={bridgeType}
            summary={feeDetails.summary}
            breakdown={feeDetails.breakdown}
          />
          <AllowedSendAmount allowedSendAmount={allowedAmtContent} />
        </Flex>
      </Flex>
    </Flex>
  ) : null;
};
