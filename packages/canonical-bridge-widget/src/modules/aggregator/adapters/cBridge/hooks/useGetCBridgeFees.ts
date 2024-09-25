import { useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { usePublicClient } from 'wagmi';
import { useIntl } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { useCBridgeSendMaxMin } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeSendMaxMin';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { formatNumber } from '@/core/utils/number';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';

export const useGetCBridgeFees = () => {
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { args, bridgeAddress } = useCBridgeTransferParams();
  const { minMaxSendAmt: cBridgeAllowedAmt } = useCBridgeSendMaxMin();
  const nativeToken = useGetNativeToken();
  const { formatMessage } = useIntl();

  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const [isAllowSendError, setIsAllowSendError] = useState(false);
  const [gasInfo, setGasInfo] = useState<{
    gas: bigint;
    gasPrice: bigint;
  }>({ gas: 0n, gasPrice: 0n });

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  useEffect(() => {
    setIsAllowSendError(false);
    if (!sendValue || !selectedToken || !toTokenInfo) {
      return;
    }
    if (!!Number(cBridgeAllowedAmt?.min) && !!Number(cBridgeAllowedAmt?.max)) {
      if (Number(sendValue) < Number(cBridgeAllowedAmt.min)) {
        setIsAllowSendError(true);
      } else if (Number(sendValue) > Number(cBridgeAllowedAmt.max)) {
        setIsAllowSendError(true);
      }
    }
  }, [cBridgeAllowedAmt, sendValue, selectedToken, toTokenInfo]);

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: bridgeAddress as `0x${string}`,
  });
  const debouncedArguments = useDebounce(args, DEBOUNCE_DELAY);

  useEffect(() => {
    let mount = true;
    if (!mount || !debouncedArguments || allowance === 0n || !publicClient || isAllowSendError) {
      return;
    }
    (async () => {
      try {
        const amount = parseUnits(
          sendValue,
          selectedToken?.cBridge?.raw?.token?.decimal ?? (18 as number),
        );
        if (!balance || Number(balance) < Number(amount)) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gas = await publicClient.estimateContractGas(debouncedArguments as any);
        const gasPrice = await publicClient.getGasPrice();
        if (gas && gasPrice) {
          setGasInfo({ gas, gasPrice });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message);
        setGasInfo({ gas: 0n, gasPrice: 0n });
      }
    })();
    return () => {
      mount = false;
    };
  }, [
    debouncedArguments,
    allowance,
    publicClient,
    isAllowSendError,
    balance,
    sendValue,
    selectedToken?.cBridge?.raw?.token?.decimal,
  ]);

  const baseFee = useMemo(() => {
    try {
      return estimatedAmount?.['cBridge'] &&
        Number(sendValue) > 0 &&
        !!estimatedAmount?.['cBridge']?.base_fee
        ? {
            shorten: `${formatUnits(
              estimatedAmount?.['cBridge']?.base_fee,
              getToDecimals().cBridge || 18,
            )}`,
            formatted: `${formatNumber(
              Number(
                formatUnits(estimatedAmount?.['cBridge']?.base_fee, getToDecimals().cBridge || 18),
              ),
              8,
            )} ${toTokenInfo?.symbol}`,
          }
        : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return null;
    }
  }, [estimatedAmount, toTokenInfo, sendValue, getToDecimals]);

  const protocolFee = useMemo(() => {
    try {
      return estimatedAmount?.['cBridge'] &&
        Number(sendValue) > 0 &&
        !!estimatedAmount?.['cBridge']?.perc_fee
        ? {
            shorten: `${formatUnits(
              estimatedAmount?.['cBridge']?.perc_fee,
              getToDecimals().cBridge || 18,
            )}`,
            formatted: `${formatNumber(
              Number(
                formatUnits(estimatedAmount?.['cBridge']?.perc_fee, getToDecimals().cBridge || 18),
              ),
              8,
            )} ${toTokenInfo?.symbol}`,
          }
        : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [estimatedAmount, toTokenInfo, getToDecimals, sendValue]);

  const feeDetails = useMemo(() => {
    let feeContent = '';
    let totalFee = null;
    const feeBreakdown = [];
    if (gasInfo?.gas && gasInfo?.gasPrice) {
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
    if (baseFee) {
      totalFee = Number(baseFee.shorten);
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.base-fee' }),
        value: baseFee.formatted,
      });
    }
    if (protocolFee) {
      totalFee = totalFee ? totalFee + Number(protocolFee.shorten) : Number(protocolFee.shorten);
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.protocol-fee' }),
        value: protocolFee.formatted,
      });
    }
    if (totalFee !== null) {
      feeContent += `${totalFee.toString()} ${toTokenInfo?.symbol}`;
    }
    return { summary: !!feeContent ? feeContent : '--', breakdown: feeBreakdown };
  }, [gasInfo, nativeToken, protocolFee, baseFee, formatMessage, toTokenInfo?.symbol]);

  return {
    baseFee,
    protocolFee,
    gasInfo,
    isAllowSendError,
    bridgeAddress,
    cBridgeAllowedAmt,
    feeDetails,
  };
};
