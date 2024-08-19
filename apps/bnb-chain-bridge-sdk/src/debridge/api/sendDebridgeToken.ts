import { type WalletClient, type PublicClient } from 'viem';

interface ISendDebridgeTokenInput {
  walletClient: WalletClient;
  publicClient: PublicClient;
  bridgeAddress: string;
  data: `0x${string}`;
  amount: bigint;
  address: `0x${string}`;
}

export const sendDebridgeToken = async ({
  walletClient,
  publicClient,
  bridgeAddress,
  data,
  amount,
  address,
}: ISendDebridgeTokenInput) => {
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
