import { useCBridgePoolBasedTransfer, useCBridgeSendMaxMin } from '@/app/hooks';
import { TransferButtonGroup } from '@/app/transfer/components/TransferButtonGroup';
import { getCBridgeEstimateAmount } from '@/bridges/cbridge/api/getCBridgeEstimateAmount';
import { useDebounce } from '@/bridges/utils';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useAccount } from '@bridge/wallet';
import { Flex } from '@node-real/uikit';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

export function TransferOverview() {
  const { fromChainId, fromTokenInfo, toChainId, toTokenInfo, transferValue } =
    useStore();
  const { address } = useAccount();
  const [feeInfo, setFeeInfo] = useState<any>(null);

  const transaction = useCBridgePoolBasedTransfer({
    tokenAddress: fromTokenInfo.fromTokenAddress as `0x${string}`,
    bridgeAddress: fromTokenInfo.bridgeAddress as `0x${string}`,
    fromChainId,
    toChainId,
    amount: transferValue,
    decimal: fromTokenInfo.fromTokenDecimal,
    enable: fromTokenInfo.fromTokenMethod === 'CB_POOL_BASED',
    max_slippage: 3000, // TODO: Get from user input
  });

  // Min & max input amount
  const res = useCBridgeSendMaxMin({
    bridgeAddress: fromTokenInfo.bridgeAddress as `0x${string}`,
    tokenAddress: fromTokenInfo.fromTokenAddress as `0x${string}`,
  });
  console.log('res', transaction);

  const debouncedTransferValue = useDebounce(transferValue, 1000);

  useEffect(() => {
    let mount = true;
    try {
      if (
        !fromChainId ||
        !toChainId ||
        !fromTokenInfo ||
        !debouncedTransferValue ||
        debouncedTransferValue === '0' ||
        !address
      ) {
        return;
      }
      (async () => {
        if (!mount) return;
        const feeInfo = await getCBridgeEstimateAmount({
          src_chain_id: Number(fromChainId),
          dst_chain_id: Number(toChainId),
          token_symbol: fromTokenInfo.fromTokenSymbol,
          amt: Number(
            parseUnits(debouncedTransferValue, fromTokenInfo.fromTokenDecimal)
          ),
          user_addr: address as `0x${string}`, // Not required for multi-chain token transfer
          slippage_tolerance: 30000, // 0.03%, slippage_tolerance / 1M
          is_pegged: fromTokenInfo.fromTokenMethod !== 'CB_POOL_BASED',
        });
        console.log('feeInfo', feeInfo);
        setFeeInfo(feeInfo);
      })();
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    return () => {
      mount = false;
    };
  }, [address, fromChainId, fromTokenInfo, toChainId, debouncedTransferValue]);

  return (
    <>
      <Flex flexDir="column" mt={32}>
        <TransferButtonGroup onSend={transaction.data?.send ?? (() => {})} />
      </Flex>
      <Flex
        flexDir="column"
        borderBottomRadius={16}
        p={24}
        position="absolute"
        bottom={0}
        left={24}
        transform="translateY(100%)"
        border="1px solid readable.border"
        bg="bg.top.normal"
        w="calc(100% - 48px)"
        gap={8}
      >
        <InfoRow
          label="Bridge Rate"
          value={
            fromTokenInfo.fromTokenMethod?.includes('CB_')
              ? `${feeInfo?.bridge_rate}`
              : '-'
          }
        />
        <InfoRow
          label="Gas Fee"
          value={
            transaction?.data
              ? `${formatUnits(
                  transaction.data.gasFee * transaction.data.gasPrice,
                  fromTokenInfo.fromTokenDecimal
                )} BNB` //TODO: Use native token symbol
              : '-'
          }
        />
        <InfoRow
          label="Other Fee"
          value={
            feeInfo && fromTokenInfo.fromTokenMethod?.includes('CB_')
              ? `${formatUnits(
                  BigInt(feeInfo?.base_fee),
                  toTokenInfo.toTokenDecimal
                )} ${toTokenInfo.toTokenSymbol} + ` +
                `${formatUnits(
                  BigInt(feeInfo?.perc_fee),
                  toTokenInfo.toTokenDecimal
                )} ${toTokenInfo.toTokenSymbol}`
              : '-'
          }
        />
        <InfoRow
          label="Estimated Token Received"
          value={`${
            feeInfo?.estimated_receive_amt
              ? formatUnits(
                  BigInt(feeInfo?.estimated_receive_amt),
                  toTokenInfo.toTokenDecimal
                )
              : '-'
          } ${toTokenInfo.toTokenSymbol}`}
        />
        <InfoRow label="Estimated Time of Arrival" value={'-'} />
      </Flex>
    </>
  );
}

interface InfoRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

function InfoRow(props: InfoRowProps) {
  const { label, value } = props;

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex>{label}</Flex>
      <Flex>{value}</Flex>
    </Flex>
  );
}
