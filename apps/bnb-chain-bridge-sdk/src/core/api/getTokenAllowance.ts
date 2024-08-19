import { ERC20_TOKEN } from '@/src/core/abi/erc20Token';
import { type PublicClient } from 'viem';
interface IGetAllowanceInput {
  publicClient: PublicClient;
  tokenAddress: `0x${string}`;
  owner: `0x${string}`;
  spender: `0x${string}`;
}
/**
 * Get token allowance
 * @param {PublicClient} publicClient Public client
 * @param {Address} tokenAddress ERC-20 token address
 * @param {Address} owner owner/account address
 * @param {Address} spender spender address
 * @returns {BigInt} token allowance amount
 */
export const getTokenAllowance = async ({
  publicClient,
  tokenAddress,
  owner,
  spender,
}: IGetAllowanceInput): Promise<bigint> => {
  try {
    const allowance = await publicClient?.readContract({
      abi: ERC20_TOKEN,
      address: tokenAddress,
      functionName: 'allowance',
      args: [owner, spender],
    });
    return allowance;
  } catch (error: any) {
    throw new Error(`Failed to get token allowance:`, error);
  }
};
