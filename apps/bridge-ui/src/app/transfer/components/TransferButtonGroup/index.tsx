import { ApproveButton } from '@/app/transfer/components/Button/ApproveButton';
import { TransferButton } from '@/app/transfer/components/Button/TransferButton';
// import { useGetAllowance } from '@/contract/hooks/useGetAllowance';
import { useAppSelector } from '@/store/hooks';
import { Flex } from '@node-real/uikit';
import { useMemo } from 'react';
import { parseUnits } from 'viem';

export const TransferButtonGroup = ({ onSend }: { onSend: () => void }) => {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  // const { allowance } = useGetAllowance({
  //   tokenAddress: selectedToken.address as `0x${string}`,
  //   sender: fromTokenInfo.bridgeAddress as `0x${string}`,
  // });
  const parsedAmount = useMemo(() => {
    return parseUnits(sendValue, selectedToken.decimal);
  }, [sendValue, selectedToken.decimal]);
  // console.log('allowance', allowance, parsedAmount, allowance > parsedAmount);
  return (
    <Flex gap={'4px'}>
      <TransferButton onSubmit={onSend} />
      <ApproveButton />
    </Flex>
  );
};
