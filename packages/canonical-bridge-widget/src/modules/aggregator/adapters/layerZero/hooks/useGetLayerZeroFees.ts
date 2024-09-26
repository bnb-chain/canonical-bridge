import { useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { encodePacked, formatUnits, pad, parseUnits } from 'viem';
import { useIntl } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { DEFAULT_ADDRESS } from '@/core/constants';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { CAKE_PROXY_OFT_ABI } from '@/modules/aggregator/adapters/layerZero/abi/cakeProxyOFT';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';
import { setRouteError } from '@/modules/transfer/action';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { formatNumber } from '@/core/utils/number';
import { formatFeeAmount } from '@/core/utils/string';

export const useGetLayerZeroFees = () => {
  const { address } = useAccount();
  const { toTokenInfo } = useToTokenInfo();
  const bridgeSDK = useBridgeSDK();
  const dispatch = useAppDispatch();
  const { data: nativeBalance } = useBalance({ address });
  const nativeToken = useGetNativeToken();
  const { formatMessage } = useIntl();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const [nativeFee, setNativeFee] = useState<bigint>(0n);

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  const [gasInfo, setGasInfo] = useState<{
    gas: bigint;
    gasPrice: bigint;
  }>({ gas: 0n, gasPrice: 0n });

  useEffect(() => {
    let mount = true;
    if (!mount || !publicClient || !toTokenInfo?.layerZero?.raw?.endpointID) {
      return;
    }
    (async () => {
      try {
        const receiver = address || DEFAULT_ADDRESS;
        const bridgeAddress = selectedToken?.layerZero?.raw?.bridgeAddress as `0x${string}`;
        const amount = parseUnits(
          sendValue,
          selectedToken?.layerZero?.raw?.decimals ?? (18 as number),
        );

        const fees = await bridgeSDK.layerZero.getEstimateFee({
          bridgeAddress,
          userAddress: receiver,
          dstEndpoint: toTokenInfo?.layerZero?.raw?.endpointID as number,
          amount,
          publicClient: publicClient,
        });

        setNativeFee(fees?.[0] ?? 0n);

        const address32Bytes = pad(address || DEFAULT_ADDRESS, { size: 32 });
        const adapterParams = encodePacked(['uint16', 'uint256'], [1, 200000n]);
        const callParams = [
          address,
          '0x0000000000000000000000000000000000000000', // zroPaymentAddress
          adapterParams,
        ];
        const nativeFee = fees[0];
        const cakeArgs = {
          address: bridgeAddress,
          abi: CAKE_PROXY_OFT_ABI,
          functionName: 'sendFrom',
          args: [
            address,
            toTokenInfo?.layerZero?.raw?.endpointID,
            address32Bytes,
            amount,
            amount,
            callParams,
          ],
          value: nativeFee,
          account: address,
        };

        if (!balance || balance < amount) {
          return;
        }
        if (
          nativeBalance?.value &&
          (!nativeBalance?.value || nativeBalance?.value < Number(nativeFee))
        ) {
          dispatch(setRouteError({ layerZero: 'Insufficient funds to cover native fees' }));
          return;
        }
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const gas = await publicClient.estimateContractGas(cakeArgs as any);
          const gasPrice = await publicClient.getGasPrice();
          if (gas && gasPrice) {
            setGasInfo({
              gas,
              gasPrice,
            });
          }
        } catch (error) {
          dispatch(setRouteError({ layerZero: 'Failed to get gas fee' }));
        }
        // eslint-disable-next-line
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error.message);
        setGasInfo({ gas: 0n, gasPrice: 0n });
        dispatch(setRouteError({ layerZero: error.message }));
      }
    })();
    return () => {
      mount = false;
    };
  }, [
    publicClient,
    address,
    selectedToken,
    sendValue,
    toTokenInfo,
    balance,
    bridgeSDK.layerZero,
    dispatch,
    nativeBalance?.value,
  ]);

  const feeDetails = useMemo(() => {
    let feeContent = '';
    let totalFee = null;
    const feeBreakdown = [];
    if (gasInfo?.gas && gasInfo?.gasPrice) {
      const gas = formatUnits(gasInfo.gas * gasInfo.gasPrice, 18);
      totalFee = Number(gas);
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.gas-fee' }),
        value: `${formatNumber(Number(gas), 8)} ${nativeToken}`,
      });
    }
    if (nativeFee) {
      const fee = formatUnits(nativeFee, 18);
      totalFee = totalFee ? totalFee + Number(fee) : Number(fee);
      feeBreakdown.push({
        label: formatMessage({ id: 'route.option.info.native-fee' }),
        value: `${formatNumber(Number(fee), 8)} ${nativeToken}`,
      });
    }
    feeContent = totalFee !== null ? `${formatFeeAmount(totalFee)} ${nativeToken}` : '';
    return { summary: feeContent ? feeContent : '--', breakdown: feeBreakdown };
  }, [gasInfo, nativeToken, nativeFee, formatMessage]);

  return {
    nativeFee,
    gasInfo,
    feeDetails,
  };
};
