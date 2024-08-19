import { createDeBridgeTxQuote } from '@/src/debridge/api/createDeBridgeTxQuote';
import { DeBridgeCreateQuoteResponse } from '@/src/debridge/types';

interface IDeBridgeEstimatedFeesInput {
  fromChainId: number;
  fromTokenAddress: `0x${string}`;
  amount: bigint;
  toChainId: number;
  toTokenAddress: `0x${string}`;
  userAddress: `0x${string}`;
  affiliateFeePercent?: number;
  prependOperatingExpenses?: boolean;
}

/**
 * Get estimated fees from transaction quote API
 * @param fromChainId - Chain ID of the source chain
 * @param fromTokenAddress - Address of ERC20 token on the source chain
 * @param amount - Send amount
 * @param toChainId - Chain ID of the destination chain
 * @param toTokenAddress - Address of ERC20 token on the destination chain
 * @param userAddress - user address
 */
export const getDeBridgeEstimatedFees = async ({
  fromChainId,
  fromTokenAddress,
  amount,
  toChainId,
  toTokenAddress,
  userAddress,
  affiliateFeePercent = 0,
  prependOperatingExpenses = false,
}: IDeBridgeEstimatedFeesInput): Promise<DeBridgeCreateQuoteResponse | null> => {
  try {
    const deBridgeParams = {
      srcChainId: fromChainId,
      srcChainTokenIn: fromTokenAddress,
      srcChainTokenInAmount: amount,
      dstChainId: toChainId,
      dstChainTokenOut: toTokenAddress,
      prependOperatingExpenses,
      affiliateFeePercent,
      dstChainTokenOutRecipient: userAddress,
      dstChainOrderAuthorityAddress: userAddress,
      srcChainOrderAuthorityAddress: userAddress,
    } as any;
    const urlParams = new URLSearchParams(deBridgeParams as any);
    const deBridgeQuote = await createDeBridgeTxQuote(urlParams);
    return deBridgeQuote;
  } catch (error: any) {
    throw new Error('Failed to get DeBridge Estimated Fees', error);
  }
};
