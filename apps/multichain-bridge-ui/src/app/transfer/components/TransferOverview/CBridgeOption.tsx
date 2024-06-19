import { setReceiveValue, setTransferActionInfo } from '@/app/transfer/action';
import { InfoRow } from '@/app/transfer/components/InfoRow';
import { AllowAmountRange } from '@/app/transfer/components/TransferOverview/cbridge/AllowedAmountRange';
import { EstimatedArrivalTime } from '@/app/transfer/components/TransferOverview/cbridge/EstimatedArrivalTime';
import { useToTokenInfo } from '@/app/transfer/hooks/useToTokenInfo';
import { getCBridgeEstimateAmount } from '@/bridges/cbridge/api/getCBridgeEstimateAmount';
import { useCBridgeTransferParams } from '@/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useTransferConfigs } from '@/bridges/index';
import { useGetAllowance } from '@/contract/hooks/useGetAllowance';
import { useGetEstimatedGas } from '@/contract/hooks/useGetEstimatedGas';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAccount } from '@bridge/wallet';
import { Box, Flex } from '@node-real/uikit';
import { useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useNetwork } from 'wagmi';

export const CBridgeOption = () => {
  const dispatch = useAppDispatch();
  const { chains } = useTransferConfigs();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const toTokenInfo = useToTokenInfo();
  const { getEstimatedGas } = useGetEstimatedGas();
  const { args, bridgeAddress } = useCBridgeTransferParams();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const slippage = useAppSelector((state) => state.transfer.slippage);
  const transferActionInfo = useAppSelector(
    (state) => state.transfer.transferActionInfo
  );

  const [isLoading, setIsLoading] = useState(false);
  const [cBridgeGasFee, setCBridgeGasFee] = useState<{
    gas: bigint;
    gasPrice: bigint;
  }>({ gas: 0n, gasPrice: 0n });
  const [cBridgeEstimatedAmt, setCBridgeEstimatedAmt] = useState<any>(null);

  const isPegged = useMemo(
    () => selectedToken?.isPegged || false,
    [selectedToken]
  );
  const { allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: bridgeAddress as `0x${string}`,
  });

  const debouncedArguments = useDebounce(args, 1000);
  const debouncedTransferValue = useDebounce(sendValue, 1000);

  useEffect(() => {
    let mount = true;
    if (
      !selectedToken?.address ||
      !selectedToken ||
      !mount ||
      !debouncedArguments ||
      allowance === 0n
    ) {
      return;
    }
    (async () => {
      try {
        const { gas, gasPrice } = await getEstimatedGas(
          debouncedArguments as any
        );
        if (gas && gasPrice) {
          setCBridgeGasFee({
            gas,
            gasPrice,
          });
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error, error.message, debouncedArguments);
      }
    })();
    return () => {
      mount = false;
    };
  }, [selectedToken, debouncedArguments, getEstimatedGas, allowance]);

  useEffect(() => {
    let mount = true;
    if (
      !fromChain ||
      !toChain ||
      !selectedToken ||
      !mount ||
      !chain ||
      chain.id !== fromChain.id ||
      !debouncedTransferValue ||
      debouncedTransferValue === '0'
    ) {
      return;
    }
    const params = {
      src_chain_id: fromChain?.id,
      dst_chain_id: toChain?.id,
      token_symbol: selectedToken?.symbol,
      amt: String(parseUnits(debouncedTransferValue, selectedToken?.decimal)),
      usr_addr: address,
      slippage_tolerance: slippage,
      is_pegged: isPegged,
    };
    try {
      setIsLoading(true);
      (async () => {
        setCBridgeEstimatedAmt(null);
        const estimated = await getCBridgeEstimateAmount(params);
        setCBridgeEstimatedAmt(estimated);
        if (selectedToken.tags.length === 1)
          dispatch(setReceiveValue(estimated.estimated_receive_amt));
      })();
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error, error.message);
    } finally {
      setIsLoading(false);
    }
    return () => {
      mount = false;
    };
  }, [
    selectedToken,
    fromChain,
    toChain,
    dispatch,
    debouncedTransferValue,
    address,
    chain,
    isPegged,
    slippage,
  ]);
  return (
    <Flex
      flexDir={'column'}
      gap={'4px'}
      border={`2px solid`}
      borderColor={
        transferActionInfo?.bridgeType === 'cbridge'
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
        dispatch(
          setTransferActionInfo({
            bridgeType: 'cbridge',
            bridgeAddress: bridgeAddress as `0x${string}`,
          })
        );
        if (cBridgeEstimatedAmt) {
          dispatch(setReceiveValue(cBridgeEstimatedAmt.estimated_receive_amt));
        }
      }}
    >
      <Box fontSize={'20px'} fontWeight={700}>
        CBridge:
      </Box>
      {!!cBridgeGasFee?.gas && !!cBridgeGasFee?.gasPrice ? (
        <InfoRow
          label={'Gas Fee:'}
          value={`${formatUnits(
            cBridgeGasFee?.gas * cBridgeGasFee?.gasPrice,
            18
          )} ${
            chains.find((chain) => chain.id === fromChain?.id)?.rawData.cbridge
              ?.gas_token_symbol
          }`}
        />
      ) : null}
      <InfoRow
        label={'Base Fee:'}
        value={
          cBridgeEstimatedAmt &&
          toTokenInfo &&
          Number(debouncedTransferValue) > 0
            ? `${formatUnits(
                cBridgeEstimatedAmt?.base_fee,
                toTokenInfo.decimal
              )} ${toTokenInfo?.symbol}`
            : '-'
        }
      />
      <InfoRow
        label="Protocol Fee:"
        value={
          cBridgeEstimatedAmt && toTokenInfo
            ? `${formatUnits(
                cBridgeEstimatedAmt?.perc_fee,
                toTokenInfo?.decimal
              )} ${toTokenInfo?.symbol}`
            : '-'
        }
      />
      <AllowAmountRange />
      <EstimatedArrivalTime />
    </Flex>
  );
};
