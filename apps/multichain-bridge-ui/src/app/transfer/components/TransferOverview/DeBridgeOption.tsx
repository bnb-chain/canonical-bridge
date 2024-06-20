import {
  setError,
  setReceiveValue,
  setTransferActionInfo,
} from '@/app/transfer/action';
import { InfoRow } from '@/app/transfer/components/InfoRow';
import { useGetNativeToken } from '@/app/transfer/hooks/useGetNativeToken';
import { useToTokenInfo } from '@/app/transfer/hooks/useToTokenInfo';
import { createDeBridgeTxQuote } from '@/bridges/debridge/api';
import { ERC20_TOKEN } from '@/contract/abi';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAccount } from '@bridge/wallet';
import { Box, Flex } from '@node-real/uikit';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { usePublicClient } from 'wagmi';

type DeBridgeQuoteResponse = {
  estimation: {
    dstChainTokenOut: {
      address: `0x${string}`;
      amount: string;
      chainId: number;
      decimals: number;
      maxTheoreticalAmount: string;
      name: string;
      recommendedAmount: string;
      symbol: string;
    };
    srcChainTokenIn: {
      address: `0x${string}`;
      amount: string;
      approximateOperatingExpense: string;
      chainId: number;
      decimals: number;
      mutatedWithOperatingExpense: boolean;
      name: string;
      symbol: string;
    };
    srcChainTokenOut: {
      address: `0x${string}`;
      amount: string;
      chainId: number;
      decimals: number;
      maxRefundAmount: string;
      name: string;
      symbol: string;
    };
  };
  order: {
    approximateFulfillmentDelay: number;
  };
  tx: {
    data: `0x${string}`;
    to: `0x${string}`; // Bridge address
    value: string;
  };
  fixFee: string;
  orderId: string;
};

export const DeBridgeOption = () => {
  const nativeToken = useGetNativeToken();
  const dispatch = useAppDispatch();
  const publicClient = usePublicClient();
  const transferSendInfo = useAppSelector(
    (state) => state.transfer.transferActionInfo
  );
  const { address } = useAccount();
  const toTokenInfo = useToTokenInfo();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector(
    (state) => state.transfer.transferActionInfo
  );
  const [isLoading, setIsLoading] = useState(false);
  const [deBridgeEstimatedAmt, setDeBridgeEstimatedAmt] =
    useState<DeBridgeQuoteResponse | null>(null);
  const [gasInfo, setGasInfo] = useState<{ gas: bigint; gasPrice: bigint }>({
    gas: 0n,
    gasPrice: 0n,
  });

  const debouncedSendValue = useDebounce(sendValue, 1000);
  useEffect(() => {
    let mount = true;
    (async () => {
      try {
        if (
          !selectedToken?.tags.includes('debridge') ||
          !fromChain ||
          !toChain ||
          !debouncedSendValue ||
          debouncedSendValue === '0' ||
          !toTokenInfo ||
          !mount
        ) {
          return;
        }
        setIsLoading(true);
        // init value
        setGasInfo({
          gas: 0n,
          gasPrice: 0n,
        });
        setDeBridgeEstimatedAmt(null);
        const params = {
          srcChainId: fromChain.id,
          srcChainTokenIn: selectedToken?.address as `0x${string}`,
          srcChainTokenInAmount: parseUnits(
            debouncedSendValue,
            selectedToken.decimal
          ),
          dstChainId: toChain.id,
          dstChainTokenOut: toTokenInfo?.rawData.debridge?.address,
          prependOperatingExpenses: false,
          affiliateFeePercent: 0,
        } as any;
        if (address) {
          params.dstChainTokenOutRecipient = address;
          params.dstChainOrderAuthorityAddress = address;
          params.srcChainOrderAuthorityAddress = address;
        }
        const urlParams = new URLSearchParams(params as any);
        const deBridgeQuote = await createDeBridgeTxQuote(urlParams);
        // console.log('debridge quote', deBridgeQuote);
        setDeBridgeEstimatedAmt(deBridgeQuote);
        if (selectedToken.tags.length === 1) {
          dispatch(
            setReceiveValue(deBridgeQuote?.estimation.dstChainTokenOut.amount)
          );
        }
        dispatch(setError(''));
        if (deBridgeQuote?.tx && address) {
          // Check whether token allowance is enough before getting gas estimation
          const allowance = await publicClient.readContract({
            address: selectedToken?.address as `0x${string}`,
            abi: ERC20_TOKEN,
            functionName: 'allowance',
            args: [address as `0x${string}`, deBridgeQuote.tx.to],
          });

          if (
            allowance < parseUnits(debouncedSendValue, selectedToken.decimal)
          ) {
            console.log(
              `Allowance is not enough: Allowance ${allowance}, send value: ${parseUnits(
                debouncedSendValue,
                selectedToken.decimal
              )}`
            );
            return;
          }
          const response = await Promise.all([
            await publicClient.estimateGas({
              account: address as `0x${string}`,
              to: deBridgeQuote?.tx.to,
              value: deBridgeQuote?.tx.value,
              data: deBridgeQuote?.tx.data,
            }),
            await publicClient.getGasPrice(),
          ]);
          if (response[0] && response[1]) {
            setGasInfo({
              gas: response[0],
              gasPrice: response[1],
            });
          }
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message);
        if (error?.response?.data?.errorMessage) {
          dispatch(setError(error.response.data.errorMessage));
        }
      } finally {
        setIsLoading(false);
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
    publicClient,
  ]);

  return (
    <Flex
      flexDir={'column'}
      gap={'4px'}
      border={`2px solid`}
      borderColor={
        transferActionInfo?.bridgeType === 'debridge'
          ? 'scene.primary.active'
          : 'readable.border'
      }
      borderRadius={'8px'}
      padding={'8px 16px'}
      cursor={'pointer'}
      _hover={{
        borderColor: 'scene.primary.active',
      }}
      onClick={() => {
        if (!deBridgeEstimatedAmt || !deBridgeEstimatedAmt.tx) {
          return;
        }
        dispatch(
          setReceiveValue(
            deBridgeEstimatedAmt?.estimation.dstChainTokenOut.amount
          )
        );
        dispatch(
          setTransferActionInfo({
            bridgeType: 'debridge',
            bridgeAddress: deBridgeEstimatedAmt.tx.to as `0x${string}`,
            data: deBridgeEstimatedAmt.tx.data,
            value: deBridgeEstimatedAmt.tx.value,
            orderId: deBridgeEstimatedAmt.orderId,
          })
        );
      }}
    >
      <Box fontSize={'20px'} fontWeight={700}>
        DeBridge:
      </Box>
      {gasInfo && gasInfo?.gas && gasInfo?.gasPrice ? (
        <InfoRow
          label={'Gas Fee:'}
          value={`${formatUnits(
            gasInfo.gas * gasInfo.gasPrice,
            18
          )} ${nativeToken}`}
          isLoading={isLoading}
        />
      ) : null}
      <InfoRow
        label={'Protocol Fee:'}
        value={
          deBridgeEstimatedAmt?.fixFee && selectedToken
            ? `${formatUnits(
                BigInt(deBridgeEstimatedAmt?.fixFee),
                18
              )} ${nativeToken}`
            : '-'
        }
        isLoading={isLoading}
      />
      <InfoRow
        label="Estimated Arrival Time:"
        value={
          deBridgeEstimatedAmt?.order.approximateFulfillmentDelay
            ? deBridgeEstimatedAmt?.order.approximateFulfillmentDelay + 's'
            : '-'
        }
        isLoading={isLoading}
      />
    </Flex>
  );
};
