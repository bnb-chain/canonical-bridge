import { POOL_TRANSFER_BRIDGE } from '@/src/cbridge/abi/poolTransferBridge';
import { Address, getContract, type PublicClient } from 'viem';

interface CBridgeSendRangeInput {
  bridgeAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  isPegged?: boolean;
  client: PublicClient;
}

/**
 * Get minimum and maximum token transfer
 * Only get minimum and maximum send amount
 * @param {Address} bridgeAddress - Bridge address
 * @param {Address} tokenAddress - Token address
 * @param {PublicClient} client - Public client
 * @returns {Object} min and max amount
 */
export const getCBridgeSendRange = async ({
  bridgeAddress,
  tokenAddress,
  client,
}: CBridgeSendRangeInput): Promise<{ min: bigint; max: bigint }> => {
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
