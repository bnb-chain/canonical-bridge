import { POOL_TRANSFER_BRIDGE } from '@/src/cbridge/abi/poolTransferBridge';
import { getContract, type PublicClient } from 'viem';

interface CBridgeSendRangeInput {
  bridgeAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  isPegged?: boolean;
  client: PublicClient;
}

/**
 * Get minimum and maximum token transfer
 * Only get minimum and maximum send amount
 * @param param0
 * @returns
 */
export const getCBridgeSendRange = async ({
  bridgeAddress,
  tokenAddress,
  client,
}: CBridgeSendRangeInput) => {
  const contract = getContract({
    address: bridgeAddress,
    abi: POOL_TRANSFER_BRIDGE,
    client: client,
  });
  try {
    const minAmount = await contract.read.minSend([tokenAddress]);
    const maxAmount = await contract.read.maxSend([tokenAddress]);
    return {
      min: minAmount,
      max: maxAmount,
    };
  } catch (error: any) {
    throw new Error(
      `Failed to get cBridge minimum and maximum transfer amount:`,
      error
    );
  }
};
