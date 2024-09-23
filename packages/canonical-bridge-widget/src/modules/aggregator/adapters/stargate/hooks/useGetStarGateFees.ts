import { useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { DEFAULT_ADDRESS } from '@/core/constants';
import { bridgeSDK } from '@/core/constants/bridgeSDK';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { formatNumber } from '@/core/utils/number';
import { useStargateTransferParams } from '@/modules/aggregator/adapters/stargate/hooks/useStargateTransferParams';
import { STARGATE_POOL } from '@/modules/aggregator/adapters/stargate/abi/stargatePool';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { setRouteError } from '@/modules/transfer/action';

export const useGetStargateFees = () => {
  const dispatch = useAppDispatch();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { address } = useAccount();
  const { args } = useStargateTransferParams();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const publicClient = usePublicClient({ chainId: fromChain?.id });
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const [nativeFee, setNativeFee] = useState<bigint>(0n);
  const [allowedSendAmount, setAllowedSendAmount] = useState<{ min: string; max: string } | null>(
    null,
  );
  const [isAllowSendError, setIsAllowSendError] = useState(false);

  useEffect(() => {
    setIsAllowSendError(false);
    if (!sendValue || !selectedToken || !toTokenInfo) {
      return;
    }
    if (allowedSendAmount?.min && allowedSendAmount?.max) {
      if (
        Number(sendValue) < Number(allowedSendAmount.min) ||
        Number(sendValue) > Number(allowedSendAmount.max)
      ) {
        setIsAllowSendError(true);
      }
    }
  }, [allowedSendAmount, sendValue, selectedToken, toTokenInfo]);

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
    if (!mount || !args || !publicClient) {
      return;
    }
    (async () => {
      try {
        const decimal = selectedToken?.stargate?.raw?.decimals ?? (18 as number);
        const amount = parseUnits(sendValue, decimal);
        if (!balance || balance < amount) {
          return;
        }
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
        const gas = await publicClient.estimateContractGas(sendTokenArgs as any);
        const gasPrice = await publicClient.getGasPrice();
        if (gas && gasPrice) {
          setGasInfo({
            gas,
            gasPrice,
          });
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
      return estimatedAmount?.['stargate'] && toTokenInfo && fee
        ? `${formatUnits(BigInt(fee), getToDecimals().stargate || 18)} ${toTokenInfo?.symbol}`
        : null;
      // eslint-disable-next-line
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error, error.message);
      return null;
    }
  }, [estimatedAmount, toTokenInfo, getToDecimals]);

  return {
    protocolFee,
    nativeFee,
    gasInfo,
    allowedSendAmount,
    isAllowSendError,
  };
};
