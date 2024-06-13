import { useApprove } from '@/contract/hooks';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@node-real/uikit';
// import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

export const ApproveButton = () => {
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const { address } = useAccount();
  const { approveErc20Token, isLoadingApprove } = useApprove();

  return (
    <Button
      onClick={() => {
        // approveErc20Token(
        //   selectedToken.address as `0x${string}`,
        //   fromTokenInfo.bridgeAddress as `0x${string}`,
        //   parseUnits(sendValue, selectedToken.decimal)
        // );
      }}
      color="light.readable.normal"
      w="100%"
      disabled={
        // !selectedToken.bridgeAddress ||
        !sendValue || !selectedToken || !address || isLoadingApprove
      }
    >
      Approve
    </Button>
  );
};
