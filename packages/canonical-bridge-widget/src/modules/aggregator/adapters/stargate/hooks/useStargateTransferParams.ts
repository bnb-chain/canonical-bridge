import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import { parseUnits } from 'viem';
import { ethers } from 'ethers';
import { IStargateParams } from '@bnb-chain/canonical-bridge-sdk';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useDebounce } from '@/core/hooks/useDebounce';
import { DEBOUNCE_DELAY, DEFAULT_ADDRESS } from '@/core/constants';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';

export const useStargateTransferParams = (): { args: IStargateParams | null } => {
  const { address } = useAccount();
  const { toTokenInfo } = useToTokenInfo();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);

  const args = useMemo(() => {
    if (!debouncedSendValue || !toTokenInfo || !selectedToken) {
      return null;
    }
    const amount = parseUnits(
      debouncedSendValue,
      selectedToken?.stargate?.raw?.token?.decimals || 18,
    );
    // random address for getting fee details without connecting to wallet
    const receiver = address || DEFAULT_ADDRESS;
    return {
      dstEid: toTokenInfo?.stargate?.raw?.endpointID as number,
      to: ethers.utils.hexZeroPad(receiver, 32) as `0x${string}`,
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: '0x' as `0x${string}`,
      composeMsg: '0x' as `0x${string}`,
      oftCmd: '0x01' as `0x${string}`, // '0x01' for bus, '' for taxi
    };
  }, [selectedToken, address, debouncedSendValue, toTokenInfo]);

  return { args };
};
