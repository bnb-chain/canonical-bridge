import { useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { DeBridgeCreateQuoteResponse } from '@bnb-chain/canonical-bridge-sdk';
import { useAccount, usePublicClient } from 'wagmi';
import { useIntl } from '@bnb-chain/space';

import { formatNumber } from '@/core/utils/number';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useDebounce } from '@/core/hooks/useDebounce';
import { setRouteError } from '@/modules/transfer/action';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { DeBridgeAdapter } from '@/modules/aggregator/adapters/deBridge/DeBridgeAdapter';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { formatFeeAmount } from '@/core/utils/string';
import { useAdapter } from '@/modules/aggregator/hooks/useAdapter';

export interface IFeeDetails {
  value: string;
  symbol: string;
}

export const useGetDeBridgeFees = () => {
  const dispatch = useAppDispatch();
  const deBridgeAdapter = useAdapter<DeBridgeAdapter>('deBridge');
  const nativeToken = useGetNativeToken();
  const { toTokenInfo } = useToTokenInfo();
  const { address, chain } = useAccount();
  const bridgeSDK = useBridgeSDK();
  const { formatMessage } = useIntl();

  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const [gasInfo, setGasInfo] = useState<{ gas: bigint; gasPrice: bigint }>({
    gas: 0n,
    gasPrice: 0n,
  });

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);
  useEffect(() => {
    let mount = true;
    (async () => {
      try {
        const amount = parseUnits(
          sendValue,
          selectedToken?.deBridge?.raw?.decimals ?? (18 as number),
        );
        if (
          !selectedToken?.deBridge?.raw ||
          !fromChain ||
          !toChain ||
          !Number(debouncedSendValue) ||
          !toTokenInfo ||
          !mount ||
          !estimatedAmount ||
          !estimatedAmount['deBridge'] ||
          chain?.id !== fromChain.id ||
          !balance ||
          balance < amount
        ) {
          return;
        }
        // init value
        setGasInfo({
          gas: 0n,
          gasPrice: 0n,
        });
        if (estimatedAmount['deBridge']?.tx && address && publicClient) {
          // Check whether token allowance is enough before getting gas estimation
          const allowance = await bridgeSDK.getTokenAllowance({
            publicClient: publicClient,
            tokenAddress: selectedToken?.address as `0x${string}`,
            owner: address as `0x${string}`,
            spender: estimatedAmount['deBridge'].tx.to,
          });

          if (allowance < parseUnits(debouncedSendValue, selectedToken.decimals)) {
            // eslint-disable-next-line no-console
            console.log(
              `Allowance is not enough: Allowance ${allowance}, send value: ${parseUnits(
                debouncedSendValue,
                selectedToken.decimals,
              )}`,
            );
            return;
          }
          try {
            const gasPrice = await publicClient.getGasPrice();
            const gas = await publicClient.estimateGas({
              account: address as `0x${string}`,
              to: estimatedAmount['deBridge']?.tx.to,
              value: BigInt(estimatedAmount['deBridge']?.tx.value),
              data: estimatedAmount['deBridge']?.tx.data,
            });
            if (gas && gasPrice) {
              setGasInfo({
                gas: gas,
                gasPrice: gasPrice,
              });
            }
          } catch (error) {
            dispatch(setRouteError({ deBridge: 'Failed to get gas fee' }));
          }
        }
        // eslint-disable-next-line
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message, error.response);
        if (error?.response?.data?.errorMessage) {
          dispatch(setRouteError({ deBridge: error.response.data.errorMessage }));
        }
      }
    })();
    return () => {
      mount = false;
    };
  }, [
    debouncedSendValue,
    selectedToken,
    fromChain,
    toChain,
    address,
    toTokenInfo,
    dispatch,
    estimatedAmount,
    publicClient,
    chain?.id,
    balance,
    sendValue,
    bridgeSDK,
  ]);

  const debridgeFee = useMemo(() => {
    if (!estimatedAmount?.deBridge?.estimation) return null;
    const response = estimatedAmount?.deBridge as DeBridgeCreateQuoteResponse;
    const srcReserveTokenInfo =
      response?.estimation.srcChainTokenOut || response?.estimation.srcChainTokenIn;

    const debridgeFee =
      response?.estimation.costsDetails?.filter((cost) => cost.type === 'DlnProtocolFee')?.[0]
        ?.payload.feeAmount || null;
    if (srcReserveTokenInfo?.decimals && srcReserveTokenInfo?.symbol) {
      const fees = formatUnits(BigInt(debridgeFee), srcReserveTokenInfo?.decimals);
      return {
        shorten: {
          value: formatFeeAmount(fees),
          symbol: srcReserveTokenInfo?.symbol,
        },
        formatted: `${formatNumber(Number(fees), 8)} ${srcReserveTokenInfo?.symbol}`,
      };
    } else {
      return null;
    }
  }, [estimatedAmount]);

  const marketMakerFee = useMemo(() => {
    if (!estimatedAmount?.deBridge?.estimation) return null;
    const response = estimatedAmount?.deBridge as DeBridgeCreateQuoteResponse;
    const estimatedOperatingExpenses = response?.estimation?.costsDetails?.filter(
      (cost) => cost.type === 'EstimatedOperatingExpenses',
    )?.[0];
    const srcChainInTokenIn = response?.estimation?.srcChainTokenIn;
    if (srcChainInTokenIn) {
      const fee = formatUnits(
        BigInt(srcChainInTokenIn.approximateOperatingExpense),
        srcChainInTokenIn.decimals,
      );
      return {
        shorten: { value: formatFeeAmount(fee), symbol: srcChainInTokenIn?.symbol },
        formatted: `${formatNumber(Number(fee), 8)} ${srcChainInTokenIn?.symbol}`,
      };
    } else if (estimatedOperatingExpenses) {
      const { chain, tokenIn } = estimatedOperatingExpenses ?? {};
      const token = deBridgeAdapter.getTokenByAddress({
        chainId: chain,
        address: tokenIn,
      });

      if (token) {
        const fee = formatUnits(
          BigInt(estimatedOperatingExpenses.payload.feeAmount),
          token.decimals,
        );
        return {
          shorten: { value: formatFeeAmount(Number(fee)), symbol: token.symbol },
          formatted: `${formatNumber(Number(fee), 8)} ${token.symbol}`,
        };
      }
    }
    return null;
  }, [estimatedAmount?.deBridge, deBridgeAdapter]);

  const protocolFee = useMemo(() => {
    if (estimatedAmount?.['deBridge']?.fixFee) {
      const fee = formatUnits(BigInt(estimatedAmount?.['deBridge']?.fixFee), 18);
      return {
        shorten: `${formatFeeAmount(fee)}`,
        formatted: `${formatNumber(Number(fee), 8)} ${nativeToken}`,
      };
    } else {
      return null;
    }
  }, [estimatedAmount, nativeToken]);

  const feeDetails = useMemo(() => {
    const feePerSymbol: IFeeDetails[] = [];
    const feeBreakdown = [];
    if (gasInfo?.gas && gasInfo?.gasPrice && nativeToken) {
      const gasFee = `${formatUnits(gasInfo.gas * gasInfo.gasPrice, 18)}`;
      feePerSymbol.push({
        symbol: nativeToken,
        value: gasFee,
      });
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.gas-fee' }),
        value: `${formatNumber(Number(gasFee), 8)} ${nativeToken}`,
      });
    }
    if (marketMakerFee) {
      feePerSymbol.push({
        symbol: marketMakerFee.shorten.symbol,
        value: marketMakerFee.shorten.value,
      });
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.market-maker-fee' }),
        value: marketMakerFee.formatted,
      });
    }
    if (debridgeFee) {
      feePerSymbol.push({
        symbol: debridgeFee.shorten.symbol,
        value: debridgeFee.shorten.value,
      });
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.debridge-fee' }),
        value: debridgeFee.formatted,
      });
    }
    if (protocolFee && nativeToken) {
      // native token
      feePerSymbol.push({
        symbol: nativeToken,
        value: protocolFee.shorten,
      });
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.protocol-fee' }),
        value: protocolFee.formatted,
      });
    }
    const result = feePerSymbol.reduce((acc: { [key: string]: number }, item) => {
      const symbol = item.symbol;
      const value = parseFloat(item.value);
      if (symbol && !acc[symbol]) acc[symbol] = 0;
      acc[symbol] += value;
      return acc;
    }, {} as { [key: string]: number });
    const resultString = Object.keys(result)
      .map((symbol) => {
        return `${result[symbol]} ${symbol}`;
      })
      .join(' + ');

    return { summary: resultString ? resultString : '--', breakdown: feeBreakdown };
  }, [debridgeFee, gasInfo, marketMakerFee, nativeToken, protocolFee, formatMessage]);

  return {
    debridgeFee,
    marketMakerFee,
    protocolFee,
    gasInfo,
    feeDetails,
  };
};
