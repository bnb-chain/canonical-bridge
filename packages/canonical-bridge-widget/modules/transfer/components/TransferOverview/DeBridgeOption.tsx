import { Box, Flex, Image, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { setError, setTransferActionInfo } from '@/modules/transfer/action';
import { InfoRow } from '@/modules/transfer/components/InfoRow';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { AdditionalDetails } from '@/modules/transfer/components/TransferOverview/AdditionalDetails';
import { env } from '@/core/configs/env';
import { formatNumber } from '@/core/utils/number';
import { formatEstimatedTime } from '@/core/utils/time';
import { bridgeSDK } from '@/core/constants/bridgeSDK';
export const DeBridgeOption = () => {
  const nativeToken = useGetNativeToken();
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const { address, chain } = useAccount();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const publicClient = usePublicClient({ chainId: fromChain?.id });
  const [gasInfo, setGasInfo] = useState<{ gas: bigint; gasPrice: bigint }>({
    gas: 0n,
    gasPrice: 0n,
  });

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  useEffect(() => {
    let mount = true;
    (async () => {
      try {
        if (
          !selectedToken?.rawData.deBridge ||
          !fromChain ||
          !toChain ||
          !debouncedSendValue ||
          debouncedSendValue === '0' ||
          !toTokenInfo ||
          !mount ||
          !estimatedAmount ||
          !estimatedAmount['deBridge'] ||
          chain?.id !== fromChain.id
        ) {
          return;
        }
        // init value
        setGasInfo({
          gas: 0n,
          gasPrice: 0n,
        });
        dispatch(setError(''));
        if (estimatedAmount['deBridge']?.tx && address && publicClient) {
          // Check whether token allowance is enough before getting gas estimation
          const allowance = await bridgeSDK.getTokenAllowance({
            publicClient: publicClient,
            tokenAddress: selectedToken?.address as `0x${string}`,
            owner: address as `0x${string}`,
            spender: estimatedAmount['deBridge'].tx.to,
          });

          if (allowance < parseUnits(debouncedSendValue, selectedToken.decimal)) {
            // eslint-disable-next-line no-console
            console.log(
              `Allowance is not enough: Allowance ${allowance}, send value: ${parseUnits(
                debouncedSendValue,
                selectedToken.decimal,
              )}`,
            );
            return;
          }
          const response = await Promise.all([
            await publicClient.estimateGas({
              account: address as `0x${string}`,
              to: estimatedAmount['deBridge']?.tx.to,
              value: BigInt(estimatedAmount['deBridge']?.tx.value),
              data: estimatedAmount['deBridge']?.tx.data,
            }),
            await publicClient.getGasPrice(),
          ]);
          if (response[0] && response[1]) {
            setGasInfo({
              gas: response[0],
              gasPrice: response[1],
            });
          }
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message, error.response);
        if (error?.response?.data?.errorMessage) {
          dispatch(setError(error.response.data.errorMessage));
        }
      }
    })();
    return () => {
      mount = false;
    };
  }, [
    debouncedSendValue,
    selectedToken,
    fromChain,
    toChain,
    address,
    toTokenInfo,
    dispatch,
    estimatedAmount,
    publicClient,
    chain?.id,
  ]);

  const onSelectBridge = useCallback(() => {
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
      onClick={onSelectBridge}
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
        Number(estimatedAmount?.['deBridge']?.estimation?.dstChainTokenOut?.amount) > 0 &&
        !!getToDecimals().deBridge
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
        {gasInfo && gasInfo?.gas && gasInfo?.gasPrice ? (
          <InfoRow
            label={formatMessage({ id: 'route.option.info.gas-fee' })}
            value={`${formatNumber(
              Number(formatUnits(gasInfo.gas * gasInfo.gasPrice, 18)),
              8,
            )} ${nativeToken}`}
          />
        ) : null}
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
              ? `${formatUnits(BigInt(estimatedAmount?.['deBridge']?.fixFee), 18)} ${nativeToken}`
              : '-'
          }
        />
      </AdditionalDetails>
    </Flex>
  );
};
