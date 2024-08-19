import { ERC20_TOKEN } from '@/src/core/abi/erc20Token';
import { Hash, type WalletClient } from 'viem';
interface IApproveTokenInput {
  walletClient: WalletClient;
  tokenAddress: `0x${string}`;
  amount: bigint;
  address: `0x${string}`;
  spender: `0x${string}`;
}
/**
 * Approve ERC-20 token
 * @param {WalletClient} walletClient Wallet client
 * @param {Address} tokenAddress ERC-20 token address
 * @param {BigInt} amount approve amount
 * @param {Address} address wallet/account address
 * @param {Address} spender spender address
 * @returns {Hash} transaction hash
 */
export const approveToken = async ({
  walletClient,
  tokenAddress,
  amount,
  address,
  spender,
}: IApproveTokenInput): Promise<Hash> => {
  try {
    const hash = await walletClient?.writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_TOKEN,
      functionName: 'approve',
      args: [spender, amount as bigint],
      chain: walletClient.chain,
      account: address,
    });
    return hash;
  } catch (error: any) {
    throw new Error(`Failed to approve token:`, error);
  }
};
