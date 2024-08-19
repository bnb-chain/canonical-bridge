import { ERC20_TOKEN } from '@/src/core/abi/erc20Token';
import { type PublicClient } from 'viem';
interface IGetTokenBalanceInput {
  publicClient: PublicClient;
  tokenAddress: `0x${string}`;
  owner: `0x${string}`;
}
/**
 * Get token balance
 * @param {PublicClient} publicClient Public client
 * @param {Address} tokenAddress ERC-20 token address
 * @param {Address} owner owner/account address
 * @returns {BigInt} token balance amount
 */
export const getTokenBalance = async ({
  publicClient,
  tokenAddress,
  owner,
}: IGetTokenBalanceInput): Promise<bigint> => {
  try {
    const balance = await publicClient?.readContract({
      abi: ERC20_TOKEN,
      address: tokenAddress,
      functionName: 'balanceOf',
      args: [owner],
    });
    return balance;
  } catch (error: any) {
    throw new Error(`Failed to get token balance:`, error);
  }
};
