'use client';

import { usePublicClient } from 'wagmi';

export const useGetEstimatedGas = () => {
  const publicClient = usePublicClient();
  const getEstimatedGas = async (args: {
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args?: any;
  }) => {
    const gas = await publicClient.estimateContractGas(args as any);
    const gasPrice = await publicClient.getGasPrice();
    return { gas, gasPrice };
  };
  return { getEstimatedGas };
};
