import { Box, Flex, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { setTransferActionInfo } from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { AdditionalDetails } from '@/modules/transfer/components/TransferOverview/AdditionalDetails';
import { InfoRow } from '@/modules/transfer/components/InfoRow';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { StarGateLogo } from '@/core/components/icons/brand/StargateLogo';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { formatNumber } from '@/core/utils/number';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { STARGATE_POOL } from '@/modules/bridges/stargate/abi/stargatePool';
import { useStarGateTransferParams } from '@/modules/bridges/stargate/hooks/useStarGateTransferParams';
import { useStarGateWaitTime } from '@/modules/bridges/stargate/hooks/useStarGateWaitTime';
import { formatEstimatedTime } from '@/core/utils/time';
import { DEFAULT_ADDRESS } from '@/core/constants';
import { bridgeSDK } from '@/core/constants/bridgeSDK';

export const StarGateOption = () => {
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const nativeToken = useGetNativeToken();
  const { address } = useAccount();
  const { args } = useStarGateTransferParams();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const publicClient = usePublicClient({ chainId: fromChain?.id });

  const { data: estimatedTime } = useStarGateWaitTime();

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.rawData.stargate?.address
      ? (selectedToken?.address as `0x${string}`)
      : ('' as `0x${string}`),
    sender: selectedToken?.rawData.stargate?.bridgeAddress as `0x${string}`,
  });

  const [gasFee, setGasFee] = useState<{
    gas: bigint;
    gasPrice: bigint;
  }>({ gas: 0n, gasPrice: 0n });
  const [nativeFee, setNativeFee] = useState<bigint>(0n);

  useEffect(() => {
    let mount = true;
    if (!mount || !args || !publicClient) {
      return;
    }
    (async () => {
      try {
        const receiver = address || DEFAULT_ADDRESS;
        const bridgeAddress = selectedToken?.rawData.stargate?.bridgeAddress as `0x${string}`;
        const quoteOFTResponse = await bridgeSDK.stargate.getQuoteOFT({
          publicClient: publicClient,
          bridgeAddress,
          endPointId: args.dstEid,
          receiver: receiver,
          amount: args.amountLD,
        });

        if (quoteOFTResponse?.[2].amountReceivedLD) {
          args.minAmountLD = BigInt(quoteOFTResponse[2].amountReceivedLD);
        }

        const quoteSendResponse = await bridgeSDK.stargate.getQuoteSend({
          publicClient: publicClient,
          bridgeAddress,
          endPointId: args.dstEid,
          amount: args.amountLD,
          minAmount: args.minAmountLD,
          receiver,
        });

        // eslint-disable-next-line no-console
        // console.log('native fee', quoteSendResponse, 'chainId', publicClient?.chain);
        setNativeFee(quoteSendResponse!.nativeFee);
        if (!allowance) return;
        let nativeFee = quoteSendResponse!.nativeFee;
        if (
          selectedToken?.rawData.stargate?.address === '0x0000000000000000000000000000000000000000'
        ) {
          nativeFee += args.amountLD;
        }
        const sendTokenArgs = {
          address: bridgeAddress,
          abi: STARGATE_POOL,
          functionName: 'sendToken',
          args: [args, quoteSendResponse, receiver],
          value: nativeFee,
          account: receiver,
        };
        const gas = await publicClient.estimateContractGas(sendTokenArgs as any);
        const gasPrice = await publicClient.getGasPrice();
        if (gas && gasPrice) {
          setGasFee({
            gas,
            gasPrice,
          });
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message);
      }
    })();
    return () => {
      mount = false;
    };
  }, [allowance, dispatch, publicClient, address, selectedToken, sendValue, toTokenInfo, args]);

  const onSelectBridge = useCallback(() => {
    if (!selectedToken?.rawData.stargate?.bridgeAddress) return;
    const bridgeAddress = selectedToken.rawData.stargate.bridgeAddress;
    dispatch(
      setTransferActionInfo({
        bridgeType: 'stargate',
        bridgeAddress: bridgeAddress as `0x${string}`,
      }),
    );
  }, [selectedToken, dispatch]);

  const protocolFee = Math.abs(
    estimatedAmount?.['stargate']?.[1].filter(
      (fee: { feeAmountLD: string; description: string }) => fee.description === 'protocol fee',
    )[0]?.feeAmountLD,
  );

  return (
    <Flex
      flex={1}
      flexDir={'column'}
      gap={'4px'}
      border={`1px solid`}
      height={'fit-content'}
      borderColor={
        transferActionInfo?.bridgeType === 'stargate'
          ? theme.colors[colorMode].support.brand['3']
          : theme.colors[colorMode].border['3']
      }
      background={
        transferActionInfo?.bridgeType === 'stargate' ? 'rgba(255, 233, 0, 0.06);' : 'none'
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
        <StarGateLogo w={'20px'} h={'20px'} />
        <Box fontSize={'14px'} fontWeight={500} lineHeight={'20px'}>
          {formatMessage({ id: 'route.option.stargate.title' })}
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
        estimatedAmount?.['stargate']?.[2].amountReceivedLD &&
        toTokenInfo &&
        Number(sendValue) > 0
          ? `~${formatNumber(
              Number(
                formatUnits(
                  BigInt(estimatedAmount?.['stargate']?.[2].amountReceivedLD),
                  getToDecimals()['stargate'] || 18,
                ),
              ),
              8,
            )} ${toTokenInfo.symbol}`
          : '-'}
      </Box>

      {estimatedTime?.avgWaitTime ? (
        <InfoRow
          label={formatMessage({ id: 'route.option.info.estimated-time' })}
          value={formatEstimatedTime(estimatedTime?.avgWaitTime / 1000)}
        />
      ) : null}

      <AdditionalDetails>
        {!!gasFee?.gas && !!gasFee?.gasPrice ? (
          <InfoRow
            label={formatMessage({ id: 'route.option.info.gas-fee' })}
            value={`${formatNumber(
              Number(formatUnits(gasFee?.gas * gasFee?.gasPrice, 18)),
              8,
            )} ${nativeToken}`}
          />
        ) : null}
        {nativeFee ? (
          <InfoRow
            label={formatMessage({ id: 'route.option.info.native-fee' })}
            value={
              estimatedAmount?.['stargate'] && toTokenInfo
                ? `${formatNumber(Number(formatUnits(nativeFee, 18)), 8)} ${nativeToken}`
                : '-'
            }
          />
        ) : null}
        {protocolFee ? (
          <InfoRow
            label={formatMessage({ id: 'route.option.info.protocol-fee' })}
            value={
              estimatedAmount?.['stargate'] && toTokenInfo
                ? `${formatUnits(BigInt(protocolFee), getToDecimals().stargate || 18)} ${
                    toTokenInfo?.symbol
                  }`
                : '-'
            }
          />
        ) : null}
      </AdditionalDetails>
    </Flex>
  );
};
