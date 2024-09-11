import { Box, Flex, useColorMode, Image, useIntl } from '@bnb-chain/space';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits, encodePacked, pad } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useGetNativeToken } from '@/modules/transfer/hooks/useGetNativeToken';
import { useGetAllowance } from '@/core/contract/hooks/useGetAllowance';
import { DEFAULT_ADDRESS } from '@/core/constants';
import { bridgeSDK } from '@/core/constants/bridgeSDK';
import { setTransferActionInfo } from '@/modules/transfer/action';
import { AdditionalDetails } from '@/modules/transfer/components/TransferOverview/AdditionalDetails';
import { InfoRow } from '@/modules/transfer/components/InfoRow';
import { formatNumber } from '@/core/utils/number';
import { CAKE_PROXY_OFT_ABI } from '@/modules/bridges/layerZero/abi/cakeProxyOFT';
import { useGetTokenBalance } from '@/core/contract/hooks/useGetTokenBalance';
import { env } from '@/core/configs/env';

export const LayerZeroOption = () => {
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const { toTokenInfo, getToDecimals } = useToTokenInfo();
  const nativeToken = useGetNativeToken();
  const { address } = useAccount();
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const theme = useAppSelector((state) => state.theme.themeConfig);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const publicClient = usePublicClient({ chainId: fromChain?.id });

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
        const receiver = address || DEFAULT_ADDRESS;
        const bridgeAddress = selectedToken?.rawData.layerZero?.bridgeAddress as `0x${string}`;
        const amount = parseUnits(
          sendValue,
          selectedToken?.rawData?.layerZero?.decimals ?? (18 as number),
        );

        const fees = await bridgeSDK.layerZero.getEstimateFee({
          bridgeAddress,
          userAddress: receiver,
          dstEndpoint: toTokenInfo?.rawData.layerZero?.endpointID as number,
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
  }, [allowance, dispatch, publicClient, address, selectedToken, sendValue, toTokenInfo, balance]);

  const onSelectBridge = useCallback(() => {
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
      gap={'4px'}
      border={`1px solid`}
      height={'fit-content'}
      borderColor={
        transferActionInfo?.bridgeType === 'layerZero'
          ? theme.colors[colorMode].border.brand
          : theme.colors[colorMode].button.select.border
      }
      background={
        transferActionInfo?.bridgeType === 'layerZero' ? 'rgba(255, 233, 0, 0.06);' : 'none'
      }
      borderRadius={'16px'}
      padding={'12px'}
      cursor={'pointer'}
      _hover={{
        borderColor: theme.colors[colorMode].border.brand,
      }}
      onClick={onSelectBridge}
      position={'relative'}
    >
      <Flex flexDir={'row'} gap={'8px'}>
        <Image
          src={`${env.ASSET_PREFIX}/images/layerZeroIcon.png`}
          alt="layerZero"
          w={'20px'}
          h={'20px'}
          borderRadius={'100%'}
        />
        <Box fontSize={'14px'} fontWeight={500} lineHeight={'20px'}>
          {'LayerZero'}
        </Box>
      </Flex>

      <Box
        px={'8px'}
        py={'4px'}
        mt={'4px'}
        mb={'8px'}
        width={'fit-content'}
        fontWeight={500}
        background={theme.colors[colorMode].background.tag}
        borderRadius={'100px'}
        fontSize={'14px'}
      >
        {estimatedAmount &&
        estimatedAmount?.['layerZero'] &&
        toTokenInfo &&
        Number(sendValue) > 0 &&
        !!getToDecimals()['layerZero']
          ? `~${formatNumber(
              Number(
                formatUnits(BigInt(estimatedAmount?.['layerZero']), getToDecimals()['layerZero']),
              ),
              8,
            )} ${toTokenInfo.symbol}`
          : '-'}
      </Box>

      {nativeFee ? (
        <InfoRow
          label={formatMessage({ id: 'route.option.info.native-fee' })}
          value={
            toTokenInfo
              ? `${formatNumber(Number(formatUnits(nativeFee, 18)), 8)} ${nativeToken}`
              : '-'
          }
        />
      ) : null}
      {!!gasFee?.gas && !!gasFee?.gasPrice && toTokenInfo ? (
        <AdditionalDetails>
          <InfoRow
            label={formatMessage({ id: 'route.option.info.gas-fee' })}
            value={`${formatNumber(
              Number(formatUnits(gasFee?.gas * gasFee?.gasPrice, toTokenInfo.decimal)),
              8,
            )} ${nativeToken}`}
          />
        </AdditionalDetails>
      ) : null}
    </Flex>
  );
};
