import { Box, Flex, theme, useColorMode } from '@bnb-chain/space';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits, encodePacked, pad } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { DEFAULT_ADDRESS } from '@/core/constants';
import { setTransferActionInfo } from '@/modules/transfer/action';
import { AdditionalDetails } from '@/modules/transfer/components/TransferOverview/AdditionalDetails';
import { InfoRow } from '@/modules/transfer/components/InfoRow';
import { formatNumber } from '@/core/utils/number';
import { CAKE_PROXY_OFT_ABI } from '@/modules/bridges/layerZero/abi/cakeProxyOFT';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';

export const LayerZeroOption = () => {
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { toTokenInfo } = useToTokenInfo();
  const nativeToken = useGetNativeToken();
  const { address } = useAccount();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const receiveValue = useAppSelector((state) => state.transfer.receiveValue);
  const publicClient = usePublicClient({ chainId: fromChain?.id });
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);

  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.rawData.layerZero?.address
      ? (selectedToken?.address as `0x${string}`)
      : ('' as `0x${string}`),
    sender: selectedToken?.rawData.layerZero?.bridgeAddress as `0x${string}`,
  });

  const { balance } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });

  const [gasFee, setGasFee] = useState<{
    gas: bigint;
    gasPrice: bigint;
  }>({ gas: 0n, gasPrice: 0n });
  const [nativeFee, setNativeFee] = useState<bigint>(0n);

  useEffect(() => {
    let mount = true;
    if (!mount || !publicClient || !toTokenInfo?.rawData?.layerZero?.endpointID) {
      return;
    }
    (async () => {
      try {
        const bridgeAddress = selectedToken?.rawData.layerZero?.bridgeAddress as `0x${string}`;
        const amount = parseUnits(
          sendValue,
          selectedToken?.rawData?.layerZero?.decimals ?? (18 as number),
        );
        const nativeFee = BigInt(estimatedAmount?.layerZero);
        setNativeFee(nativeFee ?? 0n);

        const address32Bytes = pad(address || DEFAULT_ADDRESS, { size: 32 });
        const adapterParams = encodePacked(['uint16', 'uint256'], [1, 200000n]);
        const callParams = [
          address,
          '0x0000000000000000000000000000000000000000', // zroPaymentAddress
          adapterParams,
        ];
        const cakeArgs = {
          address: bridgeAddress,
          abi: CAKE_PROXY_OFT_ABI,
          functionName: 'sendFrom',
          args: [
            address,
            toTokenInfo?.rawData.layerZero?.endpointID,
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
          setGasFee({
            gas,
            gasPrice,
          });
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message);
        setNativeFee(0n);
        setGasFee({ gas: 0n, gasPrice: 0n });
      }
    })();
    return () => {
      mount = false;
    };
  }, [
    allowance,
    dispatch,
    publicClient,
    address,
    selectedToken,
    sendValue,
    toTokenInfo,
    balance,
    estimatedAmount,
  ]);

  const setSelectBridge = useCallback(() => {
    if (!selectedToken?.rawData.layerZero?.bridgeAddress) return;
    const bridgeAddress = selectedToken.rawData.layerZero.bridgeAddress;
    dispatch(
      setTransferActionInfo({
        bridgeType: 'layerZero',
        bridgeAddress: bridgeAddress as `0x${string}`,
      }),
    );
  }, [selectedToken, dispatch]);

  return (
    <Flex
      flex={1}
      flexDir={'column'}
      gap={theme.sizes['1']}
      border={`1px solid`}
      height={'fit-content'}
      borderColor={
        transferActionInfo?.bridgeType === 'layerZero'
          ? theme.colors[colorMode].support.brand['3']
          : theme.colors[colorMode].border['3']
      }
      background={
        transferActionInfo?.bridgeType === 'layerZero' ? 'rgba(255, 233, 0, 0.06);' : 'none'
      }
      borderRadius={theme.sizes['4']}
      padding={theme.sizes['3']}
      cursor={'pointer'}
      _hover={{
        borderColor: theme.colors[colorMode].support.brand['3'],
      }}
      onClick={setSelectBridge}
      position={'relative'}
    >
      <Flex flexDir={'row'} gap={theme.sizes['2']}>
        <Box fontSize={theme.sizes['3.5']} fontWeight={500} lineHeight={theme.sizes['5']}>
          {'LayerZero'}
        </Box>
      </Flex>

      <Box
        px={theme.sizes['2']}
        py={theme.sizes['1']}
        mt={theme.sizes['1']}
        mb={theme.sizes['2']}
        width={'fit-content'}
        fontWeight={500}
        background={theme.colors[colorMode].layer['4'].default}
        borderRadius={'100px'}
        fontSize={theme.sizes['3.5']}
      >
        {receiveValue && receiveValue?.['layerZero'] && toTokenInfo && Number(sendValue) > 0
          ? `~${formatNumber(Number(receiveValue?.['layerZero']), 8)} ${toTokenInfo.symbol}`
          : '-'}
      </Box>

      {nativeFee ? (
        <InfoRow
          label={'Native Fee'}
          value={
            toTokenInfo
              ? `${formatNumber(Number(formatUnits(nativeFee, 18)), 8)} ${nativeToken}`
              : '-'
          }
        />
      ) : null}
      {!!gasFee?.gas && !!gasFee?.gasPrice ? (
        <AdditionalDetails>
          <InfoRow
            label={'Gas Fee'}
            value={`${formatNumber(
              Number(formatUnits(gasFee?.gas * gasFee?.gasPrice, 18)),
              8,
            )} ${nativeToken}`}
          />
        </AdditionalDetails>
      ) : null}
    </Flex>
  );
};
