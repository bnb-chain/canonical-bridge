import { useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { usePublicClient } from 'wagmi';

import { formatNumber } from '@/core/utils/number';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useCBridgeTransferParams } from '@/modules/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { useCBridgeSendMaxMin } from '@/modules/bridges/cbridge/hooks/useCBridgeSendMaxMin';

export const useGetCBridgeFees = () => {
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const { args, bridgeAddress } = useCBridgeTransferParams();
  const publicClient = usePublicClient();
  const { minMaxSendAmt: cBridgeAllowedAmt } = useCBridgeSendMaxMin();

  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const [isAllowSendError, setIsAllowSendError] = useState(false);
  const [gasInfo, setGasInfo] = useState<{
    gas: bigint;
    gasPrice: bigint;
  }>({ gas: 0n, gasPrice: 0n });

  useEffect(() => {
    setIsAllowSendError(false);
    if (!sendValue || !selectedToken || !toTokenInfo) {
      return;
    }
    if (cBridgeAllowedAmt?.min && cBridgeAllowedAmt?.max) {
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
  }, [debouncedArguments, allowance, publicClient, isAllowSendError]);

  const baseFee = useMemo(() => {
    return estimatedAmount?.['cBridge'] && toTokenInfo && Number(sendValue) > 0
      ? `${formatNumber(
          Number(
            formatUnits(estimatedAmount?.['cBridge']?.base_fee, getToDecimals().cBridge || 18),
          ),
          8,
        )} ${toTokenInfo?.symbol}`
      : null;
  }, [estimatedAmount, toTokenInfo, sendValue, getToDecimals]);

  const protocolFee = useMemo(() => {
    return estimatedAmount?.['cBridge'] && toTokenInfo
      ? `${formatUnits(estimatedAmount?.['cBridge']?.perc_fee, getToDecimals().cBridge || 18)} ${
          toTokenInfo?.symbol
        }`
      : null;
  }, [estimatedAmount, toTokenInfo, getToDecimals]);

  return { baseFee, protocolFee, gasInfo, isAllowSendError, bridgeAddress, cBridgeAllowedAmt };
};
