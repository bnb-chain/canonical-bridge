import { Box, Flex, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { usePublicClient } from 'wagmi';

import { AdditionalDetails } from '@/modules/transfer/components/TransferOverview/AdditionalDetails';
import { EstimatedArrivalTime } from '@/modules/transfer/components/TransferOverview/cbridge/EstimatedArrivalTime';
import { AllowAmountRange } from '@/modules/transfer/components/TransferOverview/cbridge/AllowedAmountRange';
import { InfoRow } from '@/modules/transfer/components/InfoRow';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { CBridgeIcon } from '@/core/components/icons/brand/CBridgeLogo';
import { setTransferActionInfo } from '@/modules/transfer/action';
import { useCBridgeTransferParams } from '@/modules/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { formatNumber } from '@/core/utils/number';

export const CBridgeOption = () => {
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const publicClient = usePublicClient();

  const { args, bridgeAddress } = useCBridgeTransferParams();
  const { formatMessage } = useIntl();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const [gasFee, setGasFee] = useState<{
    gas: bigint;
    gasPrice: bigint;
  }>({ gas: 0n, gasPrice: 0n });

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: bridgeAddress as `0x${string}`,
  });

  const debouncedArguments = useDebounce(args, DEBOUNCE_DELAY);

  useEffect(() => {
    let mount = true;
    if (!mount || !debouncedArguments || allowance === 0n || !publicClient) {
      return;
    }
    (async () => {
      try {
        const gas = await publicClient.estimateContractGas(debouncedArguments as any);
        const gasPrice = await publicClient.getGasPrice();
        if (gas && gasPrice) {
          setGasFee({
            gas,
            gasPrice,
          });
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message, debouncedArguments);
      }
    })();
    return () => {
      mount = false;
    };
  }, [debouncedArguments, allowance, dispatch, publicClient]);

  const setSelectBridge = useCallback(() => {
    dispatch(
      setTransferActionInfo({
        bridgeType: 'cBridge',
        bridgeAddress: bridgeAddress as `0x${string}`,
      }),
    );
  }, [bridgeAddress, dispatch]);

  return (
    <Flex
      flex={1}
      flexDir={'column'}
      gap={theme.sizes['1']}
      border={`1px solid`}
      height={'fit-content'}
      borderColor={
        transferActionInfo?.bridgeType === 'cBridge'
          ? theme.colors[colorMode].support.brand['3']
          : theme.colors[colorMode].border['3']
      }
      background={
        transferActionInfo?.bridgeType === 'cBridge' ? 'rgba(255, 233, 0, 0.06);' : 'none'
      }
      borderRadius={theme.sizes['4']}
      padding={theme.sizes['3']}
      cursor={'pointer'}
      _hover={{
        borderColor: theme.colors[colorMode].support.brand['3'],
      }}
      onClick={setSelectBridge}
      position={'relative'}
    >
      <Flex flexDir={'row'} gap={theme.sizes['2']}>
        <CBridgeIcon w={theme.sizes['5']} h={theme.sizes['5']} />
        <Box fontSize={theme.sizes['3.5']} fontWeight={500} lineHeight={theme.sizes['5']}>
          {formatMessage({ id: 'route.option.cBridge.title' })}
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
        {estimatedAmount && estimatedAmount?.['cBridge'] && toTokenInfo && Number(sendValue) > 0
          ? `~${formatNumber(
              Number(
                formatUnits(
                  estimatedAmount?.['cBridge']?.estimated_receive_amt,
                  getToDecimals()['cBridge'] || 18,
                ),
              ),
              8,
            )} ${toTokenInfo.symbol}`
          : '-'}
      </Box>
      <EstimatedArrivalTime />
      <AdditionalDetails>
        {!!gasFee?.gas && !!gasFee?.gasPrice ? (
          <InfoRow
            label={formatMessage({ id: 'route.option.info.gas-fee' })}
            value={`${formatNumber(Number(formatUnits(gasFee?.gas * gasFee?.gasPrice, 18)), 8)} ${
              fromChain?.rawData.cBridge?.gas_token_symbol
            }`}
          />
        ) : null}
        <InfoRow
          label={formatMessage({ id: 'route.option.info.base-fee' })}
          value={
            estimatedAmount?.['cBridge'] && toTokenInfo && Number(sendValue) > 0
              ? `${formatNumber(
                  Number(
                    formatUnits(
                      estimatedAmount?.['cBridge']?.base_fee,
                      getToDecimals().cBridge || 18,
                    ),
                  ),
                  8,
                )} ${toTokenInfo?.symbol}`
              : '-'
          }
        />
        <InfoRow
          label={formatMessage({ id: 'route.option.info.protocol-fee' })}
          value={
            estimatedAmount?.['cBridge'] && toTokenInfo
              ? `${formatUnits(
                  estimatedAmount?.['cBridge']?.perc_fee,
                  getToDecimals().cBridge || 18,
                )} ${toTokenInfo?.symbol}`
              : '-'
          }
        />
        <AllowAmountRange />
      </AdditionalDetails>
    </Flex>
  );
};