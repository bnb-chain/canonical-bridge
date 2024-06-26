import { BnbChainButton } from '@/app/transfer/components/BNBChain/BnbChainButton';
import { useApprove } from '@/contract/hooks';
import { useAppSelector } from '@/store/hooks';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

export const ApproveButton = () => {
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const transferActionInfo = useAppSelector(
    (state) => state.transfer.transferActionInfo
  );
  const { address } = useAccount();
  const { approveErc20Token, isLoadingApprove } = useApprove();

  return transferActionInfo?.bridgeAddress && selectedToken?.address ? (
    <BnbChainButton
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
    </BnbChainButton>
  ) : null;
};
