import { useCallback, useMemo } from 'react';
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
import { formatRouteFees } from '@/core/utils/string';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { ERC20_TOKEN } from '@/core/contract/abi';
import { useIsWalletCompatible } from '@/modules/wallet/hooks/useIsWalletCompatible';
import { IFeeDetails } from '@/modules/aggregator/types';

export const useGetStargateFees = () => {
  const dispatch = useAppDispatch();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { address, chain } = useAccount();
  const { args } = useStargateTransferParams();
  const bridgeSDK = useBridgeSDK();
  const { formatMessage } = useIntl();
  const nativeToken = useGetNativeToken();
  const isWalletCompatible = useIsWalletCompatible();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { data: nativeBalance } = useBalance({ address, chainId: fromChain?.id });
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  const allowedSendAmount = useMemo(() => {
    if (estimatedAmount?.stargate && estimatedAmount?.stargate?.[0]) {
      const fees = estimatedAmount?.stargate;
      const decimal = selectedToken?.stargate?.raw?.token?.decimals ?? (18 as number);
      const allowedMin = Number(formatUnits(fees[0].minAmountLD, decimal));
      const allowedMax = Number(formatUnits(fees[0].maxAmountLD, decimal));
      return {
        min: formatNumber(allowedMin, 8),
        max: formatNumber(allowedMax, 8),
      };
    }
    return null;
  }, [estimatedAmount?.stargate, selectedToken?.stargate?.raw?.token?.decimals]);

  const isAllowSendError = useMemo(() => {
    if (estimatedAmount?.stargate && estimatedAmount?.stargate?.[0]) {
      const fees = estimatedAmount?.stargate;
      const decimal = selectedToken?.stargate?.raw?.token?.decimals ?? (18 as number);
      const allowedMin = Number(formatUnits(fees[0].minAmountLD, decimal));
      const allowedMax = Number(formatUnits(fees[0].maxAmountLD, decimal));
      return Number(sendValue) < allowedMin || Number(sendValue) > allowedMax;
    }
    return false;
  }, [estimatedAmount?.stargate, selectedToken?.stargate?.raw?.token?.decimals, sendValue]);

  const stargateFeeSorting = useCallback(
    // fees are response of quoteOFT
    async (fees: any) => {
      let nativeTokenFee = null;
      const feeBreakdown = [];
      let isFailedToGetGas = false;
      let isDisplayError = false;
      const feeList: IFeeDetails[] = [];

      const receiver = address || DEFAULT_ADDRESS;
      const bridgeAddress = selectedToken?.stargate?.raw?.address as `0x${string}`;
      const decimal = selectedToken?.stargate?.raw?.token?.decimals ?? (18 as number);
      const maxDecimals = selectedToken?.stargate?.raw?.sharedDecimals ?? 18;
      const allowedMin = Number(formatUnits(fees[0].minAmountLD, decimal));
      const allowedMax = Number(formatUnits(fees[0].maxAmountLD, decimal));
      const amount = parseUnits(sendValue, decimal);

      // Can not retrieve other fees if token amount is out of range
      if (Number(sendValue) >= allowedMin && Number(sendValue) <= allowedMax && !!args) {
        if (sendValue.split('.')[1]?.length > maxDecimals) {
          dispatch(
            setRouteError({
              stargate: `The send amount must be less than ${maxDecimals} digits`,
            }),
          );
          return { isDisplayError: true };
        }
        if (!!Number(fees?.[2].amountReceivedLD)) {
          if (fees?.[2].amountReceivedLD) {
            args.minAmountLD = BigInt(fees[2].amountReceivedLD);
          }
          // protocol fee
          const proFee = fees?.[1].filter(
            (fee: { feeAmountLD: string; description: string }) =>
              fee.description === 'protocol fee',
          )[0]?.feeAmountLD;
          if (!!proFee) {
            const protocolFee = formatUnits(
              BigInt(Math.abs(Number(proFee))),
              getToDecimals().stargate || 18,
            );
            if (!!protocolFee && toTokenInfo?.symbol) {
              feeList.push({
                symbol: toTokenInfo?.symbol,
                value: protocolFee,
              });
              feeBreakdown.push({
                label: formatMessage({ id: 'route.option.info.protocol-fee' }),
                value: `${formatNumber(Number(protocolFee), 8)} ${toTokenInfo?.symbol}` || '',
                name: 'protocolFee',
              });
            }
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
            selectedToken?.stargate?.raw?.token?.address ===
            '0x0000000000000000000000000000000000000000'
          ) {
            nativeFee += args.amountLD;
          }
          if (nativeFee) {
            const fee = formatUnits(quoteSendResponse!.nativeFee, 18);
            nativeTokenFee = !!nativeTokenFee ? nativeTokenFee + Number(fee) : Number(fee);
            feeBreakdown.push({
              label: formatMessage({ id: 'route.option.info.native-fee' }),
              value: `${formatNumber(Number(fee), 8)} ${nativeToken}`,
              name: 'nativeFee',
            });
            if (
              nativeBalance?.value &&
              nativeBalance?.value < Number(nativeFee) &&
              isWalletCompatible
            ) {
              dispatch(
                setRouteError({ stargate: `Insufficient ${nativeToken} to cover native fee` }),
              );
              isDisplayError = true;
            }
          }

          try {
            if (chain && fromChain?.id === chain?.id && address && selectedToken?.address) {
              // gas fee
              let allowance = null;
              if (
                selectedToken?.stargate?.raw?.token?.address !==
                '0x0000000000000000000000000000000000000000'
              ) {
                allowance = await publicClient.readContract({
                  address: selectedToken?.stargate?.raw?.token?.address
                    ? (selectedToken?.address as `0x${string}`)
                    : ('' as `0x${string}`),
                  abi: ERC20_TOKEN,
                  functionName: 'allowance',
                  args: [address as `0x${string}`, selectedToken?.stargate?.raw?.address],
                  chainId: fromChain?.id,
                  enabled:
                    !!address &&
                    !!selectedToken?.address &&
                    fromChain &&
                    chain &&
                    fromChain?.id === chain?.id,
                });
              }
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

          if (nativeTokenFee !== null && nativeToken) {
            feeList.push({
              symbol: nativeToken,
              value: String(nativeTokenFee),
            });
          }
          const feeSummary = formatRouteFees(feeList);
          dispatch(
            setRouteFees({
              stargate: {
                summary: feeSummary,
                breakdown: feeBreakdown,
              },
            }),
          );
          nativeTokenFee = null;
          return {
            summary: feeSummary ? feeSummary : '--',
            breakdown: feeBreakdown,
            isFailedToGetGas,
            isDisplayError,
          };
        } else {
          dispatch(
            setRouteError({
              stargate: 'Please increase your send amount',
            }),
          );
          return { isDisplayError: true };
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
      isWalletCompatible,
    ],
  );

  return {
    allowedSendAmount,
    isAllowSendError,
    stargateFeeSorting,
  };
};
