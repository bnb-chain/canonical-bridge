import { useApprove } from '@/contract/hooks';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@node-real/uikit';
import { parseUnits } from 'viem';
import { useAccount, useNetwork } from 'wagmi';

export const ApproveButton = () => {
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const transferActionInfo = useAppSelector(
    (state) => state.transfer.transferActionInfo
  );
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { approveErc20Token, isLoadingApprove } = useApprove();

  return transferActionInfo?.bridgeAddress && selectedToken?.address ? (
    <Button
      onClick={() => {
        approveErc20Token(
          selectedToken.address as `0x${string}`,
          transferActionInfo?.bridgeAddress as `0x${string}`,
          parseUnits(sendValue, selectedToken.decimal)
        );
      }}
      color="light.readable.normal"
      w="100%"
      disabled={!sendValue || !selectedToken || !address || isLoadingApprove}
    >
      Approve
    </Button>
  ) : null;
};
