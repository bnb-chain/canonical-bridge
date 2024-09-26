import { useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';
import { useIntl } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { DEFAULT_ADDRESS } from '@/core/constants';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { formatNumber } from '@/core/utils/number';
import { useStargateTransferParams } from '@/modules/aggregator/adapters/stargate/hooks/useStargateTransferParams';
import { STARGATE_POOL } from '@/modules/aggregator/adapters/stargate/abi/stargatePool';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { setRouteError } from '@/modules/transfer/action';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { formatFeeAmount } from '@/core/utils/string';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';

export const useGetStargateFees = () => {
  const dispatch = useAppDispatch();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { address } = useAccount();
  const { args } = useStargateTransferParams();
  const bridgeSDK = useBridgeSDK();
  const { formatMessage } = useIntl();
  const nativeToken = useGetNativeToken();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const [nativeFee, setNativeFee] = useState<bigint>(0n);
  const [allowedSendAmount, setAllowedSendAmount] = useState<{ min: string; max: string } | null>(
    null,
  );
  const [isAllowSendError, setIsAllowSendError] = useState(false);

  const [gasInfo, setGasInfo] = useState<{
    gas: bigint;
    gasPrice: bigint;
  }>({ gas: 0n, gasPrice: 0n });

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.stargate?.raw?.address
      ? (selectedToken?.address as `0x${string}`)
      : ('' as `0x${string}`),
    sender: selectedToken?.stargate?.raw?.bridgeAddress as `0x${string}`,
  });

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  useEffect(() => {
    let mount = true;
    setIsAllowSendError(false);
    if (!mount || !args || !publicClient || !args.dstEid || !Number(sendValue)) {
      return;
    }
    (async () => {
      try {
        const decimal = selectedToken?.stargate?.raw?.decimals ?? (18 as number);
        const receiver = address || DEFAULT_ADDRESS;
        const bridgeAddress = selectedToken?.stargate?.raw?.bridgeAddress as `0x${string}`;
        const quoteOFTResponse = await bridgeSDK.stargate.getQuoteOFT({
          publicClient: publicClient,
          bridgeAddress,
          endPointId: args.dstEid,
          receiver: receiver,
          amount: args.amountLD,
        });
        const allowedMin = Number(formatUnits(quoteOFTResponse[0].minAmountLD, decimal));
        const allowedMax = Number(formatUnits(quoteOFTResponse[0].maxAmountLD, decimal));
        if (quoteOFTResponse[0]) {
          setAllowedSendAmount({
            min: formatNumber(allowedMin, 8),
            max: formatNumber(allowedMax, 8),
          });
        }
        // Can not retrieve other fees if token amount is out of range
        if (Number(sendValue) < allowedMin || Number(sendValue) > allowedMax) {
          setIsAllowSendError(true);
          return;
        }
        if (!Number(quoteOFTResponse?.[2].amountReceivedLD)) {
          dispatch(
            setRouteError({
              stargate: 'Given amount of input asset is too small to cover operational costs',
            }),
          );
          return;
        }

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

        setNativeFee(quoteSendResponse!.nativeFee);
        if (!allowance) return;
        let nativeFee = quoteSendResponse!.nativeFee;
        if (
          selectedToken?.stargate?.raw?.address === '0x0000000000000000000000000000000000000000'
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
        try {
          const gas = await publicClient.estimateContractGas(sendTokenArgs as any);
          const gasPrice = await publicClient.getGasPrice();
          if (gas && gasPrice) {
            setGasInfo({
              gas,
              gasPrice,
            });
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          dispatch(setRouteError({ stargate: 'Failed to get gas fee' }));
        }
        // eslint-disable-next-line
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message);
      }
    })();
    return () => {
      mount = false;
    };
  }, [
    allowance,
    dispatch,
    publicClient,
    address,
    selectedToken,
    sendValue,
    toTokenInfo,
    args,
    balance,
    bridgeSDK?.stargate,
  ]);

  const protocolFee = useMemo(() => {
    try {
      if (estimatedAmount?.['stargate'] === 'error') return null;
      const fee = Math.abs(
        Number(
          estimatedAmount?.['stargate']?.[1].filter(
            (fee: { feeAmountLD: string; description: string }) =>
              fee.description === 'protocol fee',
          )[0]?.feeAmountLD,
        ),
      );
      return {
        shorten:
          estimatedAmount?.['stargate'] && toTokenInfo && fee
            ? `${formatFeeAmount(formatUnits(BigInt(fee), getToDecimals().stargate || 18))} ${
                toTokenInfo?.symbol
              }`
            : null,
        formatted:
          estimatedAmount?.['stargate'] && toTokenInfo && fee
            ? `${formatNumber(
                Number(formatUnits(BigInt(fee), getToDecimals().stargate || 18)),
                8,
              )} ${toTokenInfo?.symbol}`
            : null,
      };
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error, error.message);
      return null;
    }
  }, [estimatedAmount, toTokenInfo, getToDecimals]);

  const feeDetails = useMemo(() => {
    let feeContent = '';
    let nativeTokenFee = null;
    const feeBreakdown = [];
    if (gasInfo?.gas && gasInfo?.gasPrice) {
      const gas = formatUnits(gasInfo.gas * gasInfo.gasPrice, 18);
      nativeTokenFee = Number(gas);
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.gas-fee' }),
        value: `${formatNumber(Number(gas), 8)} ${nativeToken}`,
      });
    }
    if (nativeFee) {
      const fee = formatUnits(nativeFee, 18);
      nativeTokenFee = nativeTokenFee
        ? nativeTokenFee + Number(formatUnits(nativeFee, 18))
        : Number(formatUnits(nativeFee, 18));
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.native-fee' }),
        value: `${formatNumber(Number(fee), 8)} ${nativeToken}`,
      });
    }
    if (nativeTokenFee !== null) {
      feeContent += `${formatFeeAmount(nativeTokenFee)} ${nativeToken}`;
    }
    if (protocolFee?.shorten) {
      feeContent += (!!feeContent ? ` + ` : '') + `${protocolFee.shorten}`;
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.protocol-fee' }),
        value: protocolFee.formatted ?? '',
      });
    }

    return { summary: feeContent ? feeContent : '--', breakdown: feeBreakdown };
  }, [gasInfo, nativeToken, protocolFee, nativeFee, formatMessage]);

  return {
    protocolFee,
    nativeFee,
    gasInfo,
    allowedSendAmount,
    isAllowSendError,
    feeDetails,
  };
};
