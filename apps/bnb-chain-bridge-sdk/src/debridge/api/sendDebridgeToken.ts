import { type WalletClient, type PublicClient, Hash } from 'viem';

interface ISendDebridgeTokenInput {
  walletClient: WalletClient;
  publicClient: PublicClient;
  bridgeAddress: string;
  data: `0x${string}`;
  amount: bigint;
  address: `0x${string}`;
}

/**
 * Send token via DeBridge
 * @param {WalletClient} walletClient Wallet client
 * @param {PublicClient} publicClient Wallet client
 * @param {Address} bridgeAddress Bridge address
 * @param {String} data Transaction data
 * @param {BigInt} amount Send amount
 * @param {Address} address wallet/account address
 * @returns {Hash} transaction hash
 */
export const sendDebridgeToken = async ({
  walletClient,
  publicClient,
  bridgeAddress,
  data,
  amount,
  address,
}: ISendDebridgeTokenInput): Promise<Hash> => {
  try {
    const hash = await walletClient.sendTransaction({
      to: bridgeAddress as `0x${string}`,
      data: data,
      value: amount,
      account: address,
      chain: walletClient.chain,
    });
    await publicClient.waitForTransactionReceipt({
      hash: hash,
    });
    return hash;
  } catch (error) {
    throw new Error(`Failed to send DeBridge token: ${error}`);
  }
};
