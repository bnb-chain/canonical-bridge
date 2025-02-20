import { useCallback } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { IDeBridgeCreateQuoteResponse } from '@bnb-chain/canonical-bridge-sdk';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { useIntl } from '@bnb-chain/space';

import { formatNumber } from '@/core/utils/number';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { formatRouteFees } from '@/core/utils/string';
import { setRouteError, setRouteFees } from '@/modules/transfer/action';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { ERC20_TOKEN } from '@/core/contract/abi';
import { useSolanaBalance } from '@/modules/wallet/hooks/useSolanaBalance';
import { useAggregator } from '@/modules/aggregator/providers/AggregatorProvider';
import { IFeeDetails } from '@/modules/aggregator/types';

export const useGetDeBridgeFees = () => {
  const dispatch = useAppDispatch();

  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const aggregator = useAggregator();
  const deBridgeAdapter = aggregator.getAdapter('deBridge');
  const nativeCurrency = aggregator.getNativeCurrency(fromChain?.id);

  const { address, chain } = useAccount();
  const { data: nativeEvmBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: fromChain?.id,
  });

  const { toTokenInfo } = useToTokenInfo();
  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  const { data: nativeSolanaBalance } = useSolanaBalance();

  const nativeTokenBalance =
    fromChain?.chainType === 'solana' ? nativeSolanaBalance : nativeEvmBalance;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;

  const deBridgeFeeSorting = useCallback(
    async (fees: IDeBridgeCreateQuoteResponse) => {
      const nativeToken = nativeCurrency?.symbol;
      const nativeDecimals = nativeCurrency?.decimals ?? 18;

      const feeList: IFeeDetails[] = [];
      const feeBreakdown = [];
      let isFailedToGetGas = false;
      let isDisplayError = false;

      // protocol fee
      if (fees?.fixFee && nativeToken) {
        const protocolFee = formatUnits(BigInt(fees?.fixFee), nativeDecimals);
        feeList.push({
          symbol: nativeToken,
          value: protocolFee,
        });
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.protocol-fee' }),
          value: `${formatNumber(Number(protocolFee), 8)} ${nativeToken}`,
        });
        // Make sure native token can cover the protocol fee
        const totalNativeAmount =
          selectedToken?.deBridge?.raw?.address === '0x0000000000000000000000000000000000000000'
            ? BigInt(fees?.fixFee) + parseUnits(sendValue, 18)
            : BigInt(fees?.fixFee);
        if (nativeTokenBalance && nativeTokenBalance?.value < totalNativeAmount) {
          dispatch(
            setRouteError({
              deBridge: `Insufficient ${nativeToken} to cover protocol fee`,
            }),
          );
          isDisplayError = true;
        }
      }
      if (fees?.estimation) {
        // deBridge fee
        const srcReserveTokenInfo =
          fees?.estimation.srcChainTokenOut || fees?.estimation.srcChainTokenIn;
        const dlnFees =
          fees?.estimation.costsDetails?.filter((cost) => cost.type === 'DlnProtocolFee')?.[0]
            ?.payload.feeAmount || null;
        const debridgeFee = formatUnits(BigInt(dlnFees), srcReserveTokenInfo?.decimals);
        feeList.push({
          symbol: srcReserveTokenInfo?.symbol,
          value: debridgeFee,
        });
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.debridge-fee' }),
          value: `${formatNumber(Number(debridgeFee), 8)} ${srcReserveTokenInfo?.symbol}`,
          name: 'debridgeFee',
        });

        // Market Maker Fee
        const estimatedOperatingExpenses = fees?.estimation?.costsDetails?.filter(
          (cost) => cost.type === 'EstimatedOperatingExpenses',
        )?.[0];
        const srcChainInTokenIn = fees?.estimation?.srcChainTokenIn;
        if (srcChainInTokenIn) {
          const makerFees = formatUnits(
            BigInt(srcChainInTokenIn.approximateOperatingExpense),
            srcChainInTokenIn.decimals,
          );
          feeList.push({
            symbol: srcChainInTokenIn?.symbol,
            value: makerFees,
          });
          feeBreakdown.push({
            label: formatMessage({ id: 'route.option.info.market-maker-fee' }),
            value: `${formatNumber(Number(makerFees), 8)} ${srcChainInTokenIn?.symbol}`,
            name: 'marketMakerFee',
          });
        } else if (estimatedOperatingExpenses) {
          const { chain, tokenIn } = estimatedOperatingExpenses ?? {};
          const token = deBridgeAdapter?.getTokenByAddress({
            chainId: chain,
            address: tokenIn,
          });
          if (token) {
            const makerFees = formatUnits(
              BigInt(estimatedOperatingExpenses.payload.feeAmount),
              token.decimals,
            );
            feeList.push({
              symbol: token.symbol,
              value: makerFees,
            });
            feeBreakdown.push({
              label: formatMessage({ id: 'route.option.info.market-maker-fee' }),
              value: `${formatNumber(Number(makerFees), 8)} ${token.symbol}`,
              name: 'marketMakerFee',
            });
          }
        }
      }

      const decimals = selectedToken?.deBridge?.raw?.decimals ?? (18 as number);
      const amount = parseUnits(sendValue, decimals);
      try {
        if (
          chain &&
          fromChain?.id === chain?.id &&
          address &&
          selectedToken?.address &&
          fromChain.chainType !== 'solana'
        ) {
          let allowance = null;
          if (selectedToken?.address !== '0x0000000000000000000000000000000000000000') {
            allowance = await publicClient.readContract({
              address: selectedToken?.address,
              abi: ERC20_TOKEN,
              functionName: 'allowance',
              args: [address as `0x${string}`, fees?.tx.to],
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
            fromChain &&
            toChain &&
            !!Number(sendValue) &&
            toTokenInfo &&
            chain?.id === fromChain.id &&
            !!balance &&
            balance >= amount &&
            !!allowance &&
            allowance >= amount
          ) {
            // Get gas fee
            const gasPrice = await publicClient.getGasPrice();
            const gas = await publicClient.estimateGas({
              account: address as `0x${string}`,
              to: fees?.tx.to,
              value: BigInt(fees.tx.value),
              data: fees?.tx.data,
            });
            if (gas && gasPrice && nativeToken) {
              const gasFee = `${formatUnits(BigInt(gas) * gasPrice, 18)}`;
              feeList.push({
                symbol: nativeToken,
                value: gasFee,
              });
              feeBreakdown.push({
                label: formatMessage({ id: 'route.option.info.gas-fee' }),
                value: `${formatNumber(Number(gasFee), 8)} ${nativeToken}`,
                name: 'gasFee',
              });
            }
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        dispatch(setRouteError({ deBridge: 'Failed to get gas fee' }));
        isFailedToGetGas = true;
      }
      const resultString = formatRouteFees(feeList);

      dispatch(
        setRouteFees({
          deBridge: {
            summary: resultString ? resultString : '--',
            breakdown: feeBreakdown,
          },
        }),
      );
      return {
        summary: resultString ? resultString : '--',
        breakdown: feeBreakdown,
        isFailedToGetGas,
        isDisplayError,
      };
    },
    [
      nativeCurrency?.symbol,
      nativeCurrency?.decimals,
      selectedToken?.deBridge?.raw?.decimals,
      selectedToken?.deBridge?.raw?.address,
      selectedToken?.address,
      sendValue,
      dispatch,
      formatMessage,
      nativeTokenBalance,
      deBridgeAdapter,
      chain,
      fromChain,
      address,
      toChain,
      toTokenInfo,
      balance,
      publicClient,
    ],
  );

  return {
    deBridgeFeeSorting,
  };
};
