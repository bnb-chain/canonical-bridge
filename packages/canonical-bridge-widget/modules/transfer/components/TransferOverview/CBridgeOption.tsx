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

  const { args, bridgeAddress } = useCBridgeTransferParams();
  const { formatMessage } = useIntl();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const publicClient = usePublicClient({ chainId: fromChain?.id });

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gas = await publicClient.estimateContractGas(debouncedArguments as any);
        const gasPrice = await publicClient.getGasPrice();
        if (gas && gasPrice) {
          setGasFee({
            gas,
            gasPrice,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message, debouncedArguments);
      }
    })();
    return () => {
      mount = false;
    };
  }, [debouncedArguments, allowance, dispatch, publicClient]);

  const onSelectBridge = useCallback(() => {
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
      gap={'4px'}
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
      borderRadius={'16px'}
      padding={'12px'}
      cursor={'pointer'}
      _hover={{
        borderColor: theme.colors[colorMode].support.brand['3'],
      }}
      onClick={onSelectBridge}
      position={'relative'}
    >
      <Flex flexDir={'row'} gap={'8px'}>
        <CBridgeIcon w={'20px'} h={'20px'} />
        <Box fontSize={'14px'} fontWeight={500} lineHeight={'20px'}>
          {formatMessage({ id: 'route.option.cBridge.title' })}
        </Box>
      </Flex>

      <Box
        px={'8px'}
        py={'4px'}
        mt={'4px'}
        mb={'8px'}
        width={'fit-content'}
        fontWeight={500}
        background={theme.colors[colorMode].layer['4'].default}
        borderRadius={'100px'}
        fontSize={'14px'}
      >
        {estimatedAmount &&
        estimatedAmount?.['cBridge'] &&
        toTokenInfo &&
        Number(sendValue) > 0 &&
        !!getToDecimals()['cBridge']
          ? `~${formatNumber(
              Number(
                formatUnits(
                  estimatedAmount?.['cBridge']?.estimated_receive_amt,
                  getToDecimals()['cBridge'],
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
