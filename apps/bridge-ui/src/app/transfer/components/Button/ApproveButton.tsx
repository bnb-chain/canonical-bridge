import { useApprove } from '@/contract/hooks';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { Button } from '@node-real/uikit';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

export const ApproveButton = () => {
  const { fromTokenInfo, transferValue } = useStore();
  const { address } = useAccount();
  const { approveErc20Token, isLoadingApprove } = useApprove();
  return (
    <Button
      onClick={() => {
        approveErc20Token(
          fromTokenInfo.fromTokenAddress as `0x${string}`,
          fromTokenInfo.bridgeAddress as `0x${string}`,
          parseUnits(transferValue, fromTokenInfo.fromTokenDecimal)
        );
      }}
      color="light.readable.normal"
      w="100%"
      disabled={
        !fromTokenInfo.bridgeAddress ||
        !transferValue ||
        !fromTokenInfo.fromTokenDecimal ||
        !address ||
        isLoadingApprove
      }
    >
      Approve
    </Button>
  );
};
