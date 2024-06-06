'use client';
import { CBRIDGE } from '@/bridges/cbridge/abi/bridge';
import { useContractReads } from 'wagmi';

export const useCBridgeSendMaxMin = ({
  bridgeAddress,
  tokenAddress,
}: {
  bridgeAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
}) => {
  const {
    data: minMaxSendAmt,
    isError,
    error,
  } = useContractReads({
    contracts: [
      {
        address: bridgeAddress,
        abi: CBRIDGE,
        functionName: 'minSend',
        args: [tokenAddress],
      },
      {
        address: bridgeAddress,
        abi: CBRIDGE,
        functionName: 'maxSend',
        args: [tokenAddress],
      },
    ],
  });

  return {
    minMaxSendAmt,
    isError,
    error,
  };
};
