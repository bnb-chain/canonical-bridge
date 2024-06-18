import { ApproveButton } from '@/app/transfer/components/Button/ApproveButton';
import { SwitchNetworkButton } from '@/app/transfer/components/Button/SwitchNetworkButton';
import { TransferButton } from '@/app/transfer/components/Button/TransferButton';
import { useGetAllowance } from '@/contract/hooks/useGetAllowance';
import { useAppSelector } from '@/store/hooks';
import { Flex } from '@node-real/uikit';
import { useMemo } from 'react';
import { parseUnits } from 'viem';
import { useNetwork } from 'wagmi';

export const TransferButtonGroup = () => {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { chain } = useNetwork();
  const transferSendInfo = useAppSelector(
    (state) => state.transfer.transferActionInfo
  );
  const { isAllowanceLow, allowance } = useGetAllowance({
    tokenAddress: selectedToken?.address as `0x${string}`,
    sender: transferSendInfo?.bridgeAddress as `0x${string}`,
  });
  // console.log('is allowance low', isAllowanceLow, allowance);
  if (!transferSendInfo) {
    return null;
  }

  return (
    <Flex gap={'4px'}>
      {chain && fromChain && chain.id !== fromChain?.id ? (
        <SwitchNetworkButton />
      ) : isAllowanceLow ? (
        <ApproveButton />
      ) : (
        <TransferButton />
      )}
    </Flex>
  );
};
