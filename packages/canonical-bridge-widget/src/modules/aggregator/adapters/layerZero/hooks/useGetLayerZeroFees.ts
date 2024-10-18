import { useCallback } from 'react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { encodePacked, formatUnits, pad, parseUnits } from 'viem';
import { useIntl } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { DEFAULT_ADDRESS } from '@/core/constants';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { CAKE_PROXY_OFT_ABI } from '@/modules/aggregator/adapters/layerZero/abi/cakeProxyOFT';
import { setRouteError, setRouteFees } from '@/modules/transfer/action';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { formatNumber } from '@/core/utils/number';
import { formatFeeAmount } from '@/core/utils/string';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';

export const useGetLayerZeroFees = () => {
  const { address, chain } = useAccount();
  const { toTokenInfo } = useToTokenInfo();
  const dispatch = useAppDispatch();
  const nativeToken = useGetNativeToken();
  const { formatMessage } = useIntl();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { data: nativeBalance } = useBalance({ address, chainId: fromChain?.id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: selectedToken?.layerZero?.raw?.bridgeAddress as `0x${string}`,
  });

  const layerZeroFeeSorting = useCallback(
    async (fees: any) => {
      let feeContent = '';
      let totalFee = null;
      let isFailedToGetGas = false;
      let isDisplayError = false;
      const feeBreakdown = [];
      const bridgeAddress = selectedToken?.layerZero?.raw?.bridgeAddress as `0x${string}`;
      const amount = parseUnits(
        sendValue,
        selectedToken?.layerZero?.raw?.decimals ?? (18 as number),
      );

      const address32Bytes = pad(address || DEFAULT_ADDRESS, { size: 32 });
      const adapterParams = encodePacked(['uint16', 'uint256'], [1, 200000n]);
      const callParams = [
        address,
        '0x0000000000000000000000000000000000000000', // zroPaymentAddress
        adapterParams,
      ];
      const nativeFee = fees[0];
      const minAmount = parseUnits(
        String(formatNumber(Number(sendValue), 8)),
        selectedToken?.layerZero?.raw?.decimals ?? (18 as number),
      );
      const cakeArgs = {
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'sendFrom',
        args: [
          address,
          toTokenInfo?.layerZero?.raw?.endpointID,
          address32Bytes,
          amount,
          minAmount,
          callParams,
        ],
        value: nativeFee,
        account: address,
      };

      if (nativeBalance?.value && nativeBalance?.value >= Number(nativeFee)) {
        if (
          chain &&
          fromChain?.id === chain?.id &&
          address &&
          publicClient &&
          toTokenInfo?.layerZero?.raw?.endpointID &&
          Number(sendValue) &&
          !!balance &&
          balance >= amount &&
          !!allowance &&
          allowance >= amount &&
          selectedToken?.address !== bridgeAddress
        ) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const gas = await publicClient.estimateContractGas(cakeArgs as any);
            const gasPrice = await publicClient.getGasPrice();
            if (gas && gasPrice) {
              const gasFee = formatUnits(BigInt(gas) * gasPrice, 18);
              totalFee = Number(gasFee);
              feeBreakdown.push({
                label: formatMessage({ id: 'route.option.info.gas-fee' }),
                value: `${formatNumber(Number(gasFee), 8)} ${nativeToken}`,
              });
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
            dispatch(setRouteError({ layerZero: 'Failed to get gas fee' }));
            isFailedToGetGas = true;
          }
        }
      } else {
        dispatch(setRouteError({ layerZero: `Insufficient ${nativeToken} to cover native fee` }));
        isDisplayError = true;
      }

      if (!!nativeFee) {
        const fee = formatUnits(nativeFee, 18);
        totalFee = totalFee ? totalFee + Number(fee) : Number(fee);
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.native-fee' }),
          value: `${formatNumber(Number(fee), 8)} ${nativeToken}`,
        });
      }
      feeContent = totalFee !== null ? `${formatFeeAmount(totalFee)} ${nativeToken}` : '';
      dispatch(
        setRouteFees({
          layerZero: { summary: feeContent ? feeContent : '--', breakdown: feeBreakdown },
        }),
      );
      return {
        summary: feeContent ? feeContent : '--',
        breakdown: feeBreakdown,
        isFailedToGetGas,
        isDisplayError,
      };
    },
    [
      dispatch,
      publicClient,
      address,
      selectedToken,
      sendValue,
      toTokenInfo,
      nativeBalance?.value,
      nativeToken,
      formatMessage,
      balance,
      chain,
      fromChain?.id,
      allowance,
    ],
  );

  return {
    layerZeroFeeSorting,
  };
};
