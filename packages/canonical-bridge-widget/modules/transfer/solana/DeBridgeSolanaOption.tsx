import { Box, Flex, Image, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

import { setTransferActionInfo } from '@/modules/transfer/action';
import { InfoRow } from '@/modules/transfer/components/InfoRow';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { AdditionalDetails } from '@/modules/transfer/components/TransferOverview/AdditionalDetails';
import { env } from '@/core/configs/env';
import { formatNumber } from '@/core/utils/number';
import { formatEstimatedTime } from '@/core/utils/time';
import { useNativeCurrencyInfo } from '@/modules/bridges';
// import { useSolanaTransactionFee } from '@/modules/transfer/hooks/useSolanaTransactionFee';

export const DeBridgeSolanaOption = () => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();

  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const nativeCurrency = useNativeCurrencyInfo(fromChain?.id);

  // const { transactionFee } = useSolanaTransactionFee();

  const setSelectBridge = useCallback(() => {
    if (!estimatedAmount || !estimatedAmount?.['deBridge']?.tx) {
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
  }, [estimatedAmount, dispatch]);

  const debridgeFee = useMemo(() => {
    const srcReserveTokenInfo =
      estimatedAmount?.deBridge?.estimation.srcChainTokenOut ||
      estimatedAmount?.deBridge?.estimation.srcChainTokenIn;

    const debridgeFee =
      estimatedAmount?.deBridge?.estimation.costsDetails?.filter(
        (cost) => cost.type === 'DlnProtocolFee',
      )?.[0]?.payload.feeAmount || null;
    if (srcReserveTokenInfo?.decimals && srcReserveTokenInfo?.symbol) {
      return `${formatNumber(
        Number(formatUnits(BigInt(debridgeFee), srcReserveTokenInfo?.decimals)),
      )} ${srcReserveTokenInfo?.symbol}`;
    } else {
      return null;
    }
  }, [estimatedAmount]);

  const marketMakerFee = useMemo(() => {
    let marketFeeStr = '';
    const dstChainTokenOut = estimatedAmount?.deBridge?.estimation?.dstChainTokenOut;
    const estimatedOperatingExpenses = estimatedAmount?.deBridge?.estimation?.costsDetails?.filter(
      (cost) => cost.type === 'EstimatedOperatingExpenses',
    )?.[0];

    if (estimatedOperatingExpenses && dstChainTokenOut) {
      marketFeeStr += `${formatNumber(
        Number(
          formatUnits(
            BigInt(estimatedOperatingExpenses.payload.feeAmount),
            dstChainTokenOut.decimals,
          ),
        ),
        8,
      )} ${dstChainTokenOut.symbol}`;
    } else {
      const srcChainInTokenIn = estimatedAmount?.deBridge?.estimation?.srcChainTokenIn;
      if (srcChainInTokenIn) {
        marketFeeStr += `${formatNumber(
          Number(
            formatUnits(
              BigInt(srcChainInTokenIn.approximateOperatingExpense),
              srcChainInTokenIn.decimals,
            ),
          ),
          8,
        )} ${srcChainInTokenIn?.symbol}`;
      }
    }
    return marketFeeStr;
  }, [estimatedAmount]);

  return (
    <Flex
      flex={1}
      gap={theme.sizes['1']}
      flexDir={'column'}
      height={'fit-content'}
      border={`1px solid`}
      borderColor={
        transferActionInfo?.bridgeType === 'deBridge'
          ? theme.colors[colorMode].support.brand['3']
          : theme.colors[colorMode].border['3']
      }
      background={
        transferActionInfo?.bridgeType === 'deBridge' ? 'rgba(255, 233, 0, 0.06);' : 'none'
      }
      borderRadius={theme.sizes['4']}
      padding={`${theme.sizes['3']}`}
      position={'relative'}
      cursor={'pointer'}
      _hover={{
        borderColor: theme.colors[colorMode].support.brand['3'],
      }}
      onClick={setSelectBridge}
    >
      <Flex flexDir={'row'} gap={theme.sizes['2']} alignItems={'center'}>
        <Image
          src={`${env.ASSET_PREFIX}/images/debridgeIcon.png`}
          alt="deBridge"
          w={theme.sizes['5']}
          h={theme.sizes['5']}
          borderRadius={'100%'}
        />
        <Box fontSize={theme.sizes['3.5']} fontWeight={500} lineHeight={theme.sizes['5']}>
          {formatMessage({ id: 'route.option.deBridge.title' })}
        </Box>
      </Flex>
      <Box
        px={theme.sizes['2']}
        py={theme.sizes['1']}
        mt={theme.sizes['1']}
        mb={theme.sizes['2']}
        width={'fit-content'}
        fontWeight={500}
        background={theme.colors[colorMode].layer['4'].default}
        borderRadius={'100px'}
        fontSize={theme.sizes['3.5']}
      >
        {estimatedAmount?.['deBridge'] &&
        toTokenInfo &&
        Number(estimatedAmount?.['deBridge']?.estimation?.dstChainTokenOut?.amount) > 0
          ? `~${formatNumber(
              Number(
                formatUnits(
                  BigInt(estimatedAmount?.['deBridge']?.estimation?.dstChainTokenOut?.amount),
                  getToDecimals().deBridge,
                ),
              ),
              8,
            )} ${toTokenInfo.symbol}`
          : '-'}
      </Box>
      <InfoRow
        label={formatMessage({ id: 'route.option.info.estimated-time' })}
        value={formatEstimatedTime(
          estimatedAmount?.['deBridge']?.order?.approximateFulfillmentDelay,
        )}
      />
      <AdditionalDetails>
        {debridgeFee ? (
          <InfoRow
            label={formatMessage({ id: 'route.option.info.debridge-fee' })}
            value={debridgeFee}
          />
        ) : null}
        {marketMakerFee ? (
          <InfoRow
            label={formatMessage({ id: 'route.option.info.market-maker-fee' })}
            value={marketMakerFee}
          />
        ) : null}
        <InfoRow
          label={formatMessage({ id: 'route.option.info.protocol-fee' })}
          value={
            estimatedAmount?.['deBridge']?.fixFee && selectedToken
              ? `${formatUnits(
                  BigInt(estimatedAmount?.['deBridge']?.fixFee),
                  nativeCurrency?.decimals ?? 0,
                )} ${nativeCurrency?.symbol}`
              : '-'
          }
        />
      </AdditionalDetails>
    </Flex>
  );
};
