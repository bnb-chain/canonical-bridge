import { ApproveButton } from '@/app/transfer/components/Button/ApproveButton';
import { TransferButton } from '@/app/transfer/components/Button/TransferButton';
import { useGetAllowance } from '@/contract/hooks/useGetAllowance';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { Flex } from '@node-real/uikit';
import { useMemo } from 'react';
import { parseUnits } from 'viem';

export const TransferButtonGroup = ({ onSend }: { onSend: () => void }) => {
  const { fromTokenInfo, transferValue } = useStore();
  const { allowance } = useGetAllowance({
    tokenAddress: fromTokenInfo.fromTokenAddress as `0x${string}`,
    sender: fromTokenInfo.bridgeAddress as `0x${string}`,
  });
  const parsedAmount = useMemo(() => {
    return parseUnits(transferValue, fromTokenInfo.fromTokenDecimal);
  }, [transferValue, fromTokenInfo.fromTokenDecimal]);
  // console.log('allowance', allowance, parsedAmount, allowance > parsedAmount);
  return (
    <Flex gap={'4px'}>
      <TransferButton onSubmit={onSend} />
      {!allowance &&
        allowance !== undefined &&
        transferValue !== '0' &&
        parsedAmount > allowance && <ApproveButton />}
    </Flex>
  );
};
