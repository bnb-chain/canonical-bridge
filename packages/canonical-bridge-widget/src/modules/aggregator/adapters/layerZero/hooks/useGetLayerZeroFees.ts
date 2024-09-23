import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { encodePacked, pad, parseUnits } from 'viem';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { DEFAULT_ADDRESS } from '@/core/constants';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { CAKE_PROXY_OFT_ABI } from '@/modules/aggregator/adapters/layerZero/abi/cakeProxyOFT';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

export const useGetLayerZeroFees = () => {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const { toTokenInfo } = useToTokenInfo();
  const bridgeSDK = useBridgeSDK();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

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
        const gas = await publicClient.estimateContractGas(cakeArgs as any);
        const gasPrice = await publicClient.getGasPrice();
        if (gas && gasPrice) {
          setGasInfo({
            gas,
            gasPrice,
          });
        }
        // eslint-disable-next-line
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message);
        setNativeFee(0n);
        setGasInfo({ gas: 0n, gasPrice: 0n });
      }
    })();
    return () => {
      mount = false;
    };
  }, [publicClient, address, selectedToken, sendValue, toTokenInfo, balance, bridgeSDK.layerZero]);

  return {
    nativeFee,
    gasInfo,
  };
};
