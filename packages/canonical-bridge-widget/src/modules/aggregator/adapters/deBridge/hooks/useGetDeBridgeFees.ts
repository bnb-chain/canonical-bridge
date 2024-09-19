import { useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { DeBridgeCreateQuoteResponse } from '@bnb-chain/canonical-bridge-sdk';
import { useAccount, usePublicClient } from 'wagmi';

import { formatNumber } from '@/core/utils/number';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { bridgeSDK } from '@/core/constants/bridgeSDK';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useDebounce } from '@/core/hooks/useDebounce';
import { setError } from '@/modules/transfer/action';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { useAdapter } from '@/modules/aggregator/components/BridgeConfigProvider';
import { DeBridgeAdapter } from '@/modules/aggregator/adapters/deBridge/DeBridgeAdapter';

export const useGetDeBridgeFees = () => {
  const dispatch = useAppDispatch();
  const deBridgeAdapter = useAdapter<DeBridgeAdapter>('deBridge');
  const nativeToken = useGetNativeToken();
  const { toTokenInfo } = useToTokenInfo();
  const { address, chain } = useAccount();

  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const publicClient = usePublicClient({ chainId: fromChain?.id });
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
          !debouncedSendValue ||
          debouncedSendValue === '0' ||
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
        dispatch(setError(undefined));
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
        }
        // eslint-disable-next-line
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message, error.response);
        if (error?.response?.data?.errorMessage) {
          dispatch(setError({ text: error.response.data.errorMessage, bridgeType: 'deBridge' }));
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
      return `${formatNumber(
        Number(formatUnits(BigInt(debridgeFee), srcReserveTokenInfo?.decimals)),
      )} ${srcReserveTokenInfo?.symbol}`;
    } else {
      return null;
    }
  }, [estimatedAmount]);

  const marketMakerFee = useMemo(() => {
    if (!estimatedAmount?.deBridge?.estimation) return null;
    const response = estimatedAmount?.deBridge as DeBridgeCreateQuoteResponse;
    let marketFeeStr = '';
    const estimatedOperatingExpenses = response?.estimation?.costsDetails?.filter(
      (cost) => cost.type === 'EstimatedOperatingExpenses',
    )?.[0];

    const srcChainInTokenIn = response?.estimation?.srcChainTokenIn;
    if (srcChainInTokenIn) {
      marketFeeStr += `${formatNumber(
        Number(
          formatUnits(
            BigInt(srcChainInTokenIn.approximateOperatingExpense),
            srcChainInTokenIn.decimals,
          ),
        ),
        8,
      )} ${srcChainInTokenIn?.symbol}`;
    } else if (estimatedOperatingExpenses) {
      const { chain, tokenIn } = estimatedOperatingExpenses ?? {};
      const token = deBridgeAdapter.getTokenByAddress({
        chainId: chain,
        address: tokenIn,
      });

      if (token) {
        marketFeeStr += `${formatNumber(
          Number(formatUnits(BigInt(estimatedOperatingExpenses.payload.feeAmount), token.decimals)),
          8,
        )} ${token.symbol}`;
      }
    }
    return marketFeeStr;
  }, [estimatedAmount?.deBridge, deBridgeAdapter]);

  const protocolFee = useMemo(() => {
    if (estimatedAmount?.['deBridge']?.fixFee) {
      return `${formatUnits(BigInt(estimatedAmount?.['deBridge']?.fixFee), 18)} ${nativeToken}`;
    } else {
      return null;
    }
  }, [estimatedAmount, nativeToken]);

  return {
    debridgeFee,
    marketMakerFee,
    protocolFee,
    gasInfo,
  };
};
