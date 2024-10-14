import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { useIntl } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useCBridgeSendMaxMin } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeSendMaxMin';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { formatNumber } from '@/core/utils/number';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { setRouteError, setRouteFees } from '@/modules/transfer/action';
import { formatFeeAmount } from '@/core/utils/string';
import { ERC20_TOKEN } from '@/core/contract/abi';

export const useGetCBridgeFees = () => {
  const { toTokenInfo } = useToTokenInfo();
  const { args, bridgeAddress } = useCBridgeTransferParams();
  const { minMaxSendAmt: cBridgeAllowedAmt } = useCBridgeSendMaxMin();
  const nativeToken = useGetNativeToken();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { address, chain } = useAccount();

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const [isAllowSendError, setIsAllowSendError] = useState(false);

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  useEffect(() => {
    if (!Number(sendValue) || !selectedToken || !toTokenInfo) {
      setIsAllowSendError(false);
      return;
    }
    if (!!Number(cBridgeAllowedAmt?.min) && !!Number(cBridgeAllowedAmt?.max)) {
      if (Number(sendValue) <= Number(cBridgeAllowedAmt.min)) {
        setIsAllowSendError(true);
      } else if (Number(sendValue) >= Number(cBridgeAllowedAmt.max)) {
        setIsAllowSendError(true);
      }
    }
    return () => {
      setIsAllowSendError(false);
    };
  }, [cBridgeAllowedAmt, sendValue, selectedToken, toTokenInfo]);

  const cBridgeFeeSorting = useCallback(
    async (fees: any) => {
      let feeContent = '';
      let totalFee = null;
      const feeBreakdown = [];
      let isFailedToGetGas = false;
      const decimals = selectedToken?.cBridge?.raw?.token.decimal ?? (18 as number);
      const amount = parseUnits(sendValue, decimals);

      // base fee
      if (!!fees?.base_fee) {
        const baseFee = formatUnits(fees?.base_fee, toTokenInfo?.decimals || 18);
        totalFee = baseFee;
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.base-fee' }),
          value: `${formatNumber(Number(baseFee), 8)} ${toTokenInfo?.symbol}`,
          name: 'baseFee',
        });
      }
      // protocol fee
      if (!!fees?.perc_fee) {
        const protocolFee = formatUnits(fees?.perc_fee, toTokenInfo?.decimals || 18);
        totalFee = !!totalFee ? Number(totalFee) + Number(protocolFee) : Number(protocolFee);
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.protocol-fee' }),
          value: `${formatNumber(Number(protocolFee), 8)} ${toTokenInfo?.symbol}`,
          name: 'protocolFee',
        });
      }
      try {
        if (
          Number(cBridgeAllowedAmt.min) < Number(sendValue) &&
          Number(cBridgeAllowedAmt.max) > Number(sendValue)
        ) {
          if (chain && fromChain?.id === chain?.id && address && selectedToken?.address) {
            // gas fee
            const allowance = await publicClient.readContract({
              address: selectedToken?.address,
              abi: ERC20_TOKEN,
              functionName: 'allowance',
              args: [address as `0x${string}`, bridgeAddress],
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
              !!balance &&
              Number(balance) >= Number(amount) &&
              !!allowance &&
              allowance >= amount
            ) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const gas = await publicClient.estimateContractGas(args as any);
              const gasPrice = await publicClient.getGasPrice();
              if (gas && gasPrice) {
                const gasFee = Number(formatUnits(BigInt(gas) * gasPrice, 18));
                feeContent += `${formatFeeAmount(gasFee)} ${nativeToken}`;
                feeBreakdown.push({
                  label: formatMessage({ id: 'route.option.info.gas-fee' }),
                  value: `${formatNumber(gasFee, 8)} ${nativeToken}`,
                  name: 'gasFee',
                });
              }
            }
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message);
        dispatch(setRouteError({ cBridge: 'Failed to get gas fee' }));
        isFailedToGetGas = true;
      }

      if (totalFee !== null) {
        feeContent = feeContent
          ? feeContent + ` + ${String(formatFeeAmount(totalFee))} ${toTokenInfo?.symbol}`
          : `${String(formatFeeAmount(totalFee))} ${toTokenInfo?.symbol}`;
      }
      dispatch(
        setRouteFees({
          cBridge: {
            summary: !!feeContent ? feeContent : '--',
            breakdown: feeBreakdown,
          },
        }),
      );
      return {
        summary: !!feeContent ? feeContent : '--',
        breakdown: feeBreakdown,
        isFailedToGetGas,
      };
    },
    [
      toTokenInfo,
      formatMessage,
      dispatch,
      nativeToken,
      args,
      publicClient,
      balance,
      address,
      selectedToken,
      chain,
      fromChain,
      sendValue,
      bridgeAddress,
      cBridgeAllowedAmt,
    ],
  );

  return {
    isAllowSendError,
    bridgeAddress,
    cBridgeFeeSorting,
    cBridgeAllowedAmt,
  };
};
