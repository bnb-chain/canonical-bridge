import { useCallback, useEffect, useState } from 'react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useIntl } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { DEFAULT_ADDRESS } from '@/core/constants';
import { formatNumber } from '@/core/utils/number';
import { useStargateTransferParams } from '@/modules/aggregator/adapters/stargate/hooks/useStargateTransferParams';
import { STARGATE_POOL } from '@/modules/aggregator/adapters/stargate/abi/stargatePool';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { setRouteError, setRouteFees } from '@/modules/transfer/action';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { formatFeeAmount } from '@/core/utils/string';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { ERC20_TOKEN } from '@/core/contract/abi';

export const useGetStargateFees = () => {
  const dispatch = useAppDispatch();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { address, chain } = useAccount();
  const { args } = useStargateTransferParams();
  const bridgeSDK = useBridgeSDK();
  const { formatMessage } = useIntl();
  const nativeToken = useGetNativeToken();
  const { data: nativeBalance } = useBalance({ address });

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const [allowedSendAmount, setAllowedSendAmount] = useState<{ min: string; max: string } | null>(
    null,
  );
  const [isAllowSendError, setIsAllowSendError] = useState(false);

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  useEffect(() => {
    if (estimatedAmount?.stargate && estimatedAmount?.stargate?.[0]) {
      const fees = estimatedAmount?.stargate;
      const decimal = selectedToken?.stargate?.raw?.decimals ?? (18 as number);
      const allowedMin = Number(formatUnits(fees[0].minAmountLD, decimal));
      const allowedMax = Number(formatUnits(fees[0].maxAmountLD, decimal));
      setAllowedSendAmount({
        min: formatNumber(allowedMin, 8),
        max: formatNumber(allowedMax, 8),
      });
      if (Number(sendValue) < allowedMin || Number(sendValue) > allowedMax) {
        setIsAllowSendError(true);
      } else {
        setIsAllowSendError(false);
      }
    }
    return () => {
      setAllowedSendAmount(null);
      setIsAllowSendError(false);
    };
  }, [estimatedAmount?.stargate, selectedToken?.stargate?.raw?.decimals, sendValue]);

  const stargateFeeSorting = useCallback(
    // fees are response of quoteOFT
    async (fees: any) => {
      let feeContent = '';
      let nativeTokenFee = null;
      const feeBreakdown = [];
      let isFailedToGetGas = false;

      const receiver = address || DEFAULT_ADDRESS;
      const bridgeAddress = selectedToken?.stargate?.raw?.bridgeAddress as `0x${string}`;
      const decimal = selectedToken?.stargate?.raw?.decimals ?? (18 as number);
      const allowedMin = Number(formatUnits(fees[0].minAmountLD, decimal));
      const allowedMax = Number(formatUnits(fees[0].maxAmountLD, decimal));
      const amount = parseUnits(sendValue, decimal);

      // Can not retrieve other fees if token amount is out of range
      if (Number(sendValue) >= allowedMin && Number(sendValue) <= allowedMax && !!args) {
        if (!!Number(fees?.[2].amountReceivedLD)) {
          if (fees?.[2].amountReceivedLD) {
            args.minAmountLD = BigInt(fees[2].amountReceivedLD);
          }
          // protocol fee
          const protocolFee = formatUnits(
            BigInt(
              Math.abs(
                Number(
                  fees?.[1].filter(
                    (fee: { feeAmountLD: string; description: string }) =>
                      fee.description === 'protocol fee',
                  )[0]?.feeAmountLD,
                ),
              ),
            ),
            getToDecimals().stargate || 18,
          );
          if (!!protocolFee) {
            feeContent +=
              (!!feeContent ? ` + ` : '') +
              `${`${formatFeeAmount(protocolFee)} ${toTokenInfo?.symbol}`}`;
            feeBreakdown.push({
              label: formatMessage({ id: 'route.option.info.protocol-fee' }),
              value: `${formatNumber(Number(protocolFee), 8)} ${toTokenInfo?.symbol}` ?? '',
              name: 'protocolFee',
            });
          }
          // native fee
          const quoteSendResponse = await bridgeSDK.stargate.getQuoteSend({
            publicClient: publicClient,
            bridgeAddress,
            endPointId: args.dstEid,
            amount: args.amountLD,
            minAmount: args.minAmountLD,
            receiver,
          });
          let nativeFee = quoteSendResponse!.nativeFee;
          if (
            selectedToken?.stargate?.raw?.address === '0x0000000000000000000000000000000000000000'
          ) {
            nativeFee += args.amountLD;
          }
          if (nativeFee) {
            const fee = formatUnits(nativeFee, 18);
            nativeTokenFee = !!nativeTokenFee
              ? nativeTokenFee + Number(formatUnits(nativeFee, 18))
              : Number(formatUnits(nativeFee, 18));
            feeBreakdown.push({
              label: formatMessage({ id: 'route.option.info.native-fee' }),
              value: `${formatNumber(Number(fee), 8)} ${nativeToken}`,
              name: 'nativeFee',
            });
            if (nativeBalance?.value && nativeBalance?.value < Number(nativeFee)) {
              dispatch(
                setRouteError({ stargate: `Insufficient ${nativeToken} to cover native fee` }),
              );
            }
          }
          try {
            if (chain && fromChain?.id === chain?.id && address && selectedToken?.address) {
              // gas fee
              const allowance = await publicClient.readContract({
                address: selectedToken?.stargate?.raw?.address
                  ? (selectedToken?.address as `0x${string}`)
                  : ('' as `0x${string}`),
                abi: ERC20_TOKEN,
                functionName: 'allowance',
                args: [address as `0x${string}`, selectedToken?.stargate?.raw?.bridgeAddress],
                chainId: fromChain?.id,
                enabled:
                  !!address &&
                  !!selectedToken?.address &&
                  fromChain &&
                  chain &&
                  fromChain?.id === chain?.id,
              });
              if (
                !!args &&
                !!publicClient &&
                !!args.dstEid &&
                !!Number(sendValue) &&
                !!balance &&
                !!allowance &&
                allowance >= amount
              ) {
                const gas = await publicClient.estimateContractGas({
                  address: bridgeAddress,
                  abi: STARGATE_POOL,
                  functionName: 'sendToken',
                  args: [args, quoteSendResponse, receiver],
                  value: nativeFee,
                  account: receiver,
                });
                const gasPrice = await publicClient.getGasPrice();
                if (gas && gasPrice) {
                  const gasFee = formatUnits(BigInt(gas) * gasPrice, 18);
                  nativeTokenFee = !!nativeTokenFee
                    ? nativeTokenFee + Number(gasFee)
                    : Number(gasFee);
                  feeBreakdown.push({
                    label: formatMessage({ id: 'route.option.info.gas-fee' }),
                    value: `${formatNumber(Number(gasFee), 8)} ${nativeToken}`,
                    name: 'gasFee',
                  });
                }
              }
            }
          } catch (error: any) {
            // eslint-disable-next-line no-console
            console.log(error.message);
            dispatch(setRouteError({ stargate: 'Failed to get gas fee' }));
            isFailedToGetGas = true;
          }

          if (nativeTokenFee !== null) {
            feeContent +=
              (!!feeContent ? ` + ` : '') + `${formatFeeAmount(nativeTokenFee)} ${nativeToken}`;
          }
          dispatch(
            setRouteFees({
              stargate: {
                summary: !!feeContent ? feeContent : '--',
                breakdown: feeBreakdown,
              },
            }),
          );
          return {
            summary: feeContent ? feeContent : '--',
            breakdown: feeBreakdown,
            isFailedToGetGas,
          };
        } else {
          dispatch(
            setRouteError({
              stargate: 'Please increase your send amount',
            }),
          );
        }
      }
    },
    [
      args,
      publicClient,
      address,
      selectedToken,
      sendValue,
      toTokenInfo,
      dispatch,
      bridgeSDK,
      formatMessage,
      nativeToken,
      getToDecimals,
      chain,
      nativeBalance?.value,
      fromChain,
      balance,
    ],
  );

  return {
    allowedSendAmount,
    isAllowSendError,
    stargateFeeSorting,
  };
};
