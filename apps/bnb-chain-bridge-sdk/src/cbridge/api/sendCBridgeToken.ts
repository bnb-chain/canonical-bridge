import { type WalletClient, type PublicClient } from 'viem';

interface ISendCBridgeToken {
  walletClient: WalletClient;
  publicClient: PublicClient;
  bridgeAddress: string;
  bridgeABI: any;
  functionName: string;
  address: `0x${string}`;
  args: any;
}

export const sendCBridgeToken = async ({
  walletClient,
  publicClient,
  bridgeAddress,
  bridgeABI,
  functionName,
  address,
  args,
}: ISendCBridgeToken) => {
  try {
    const cBridgeArgs = {
      address: bridgeAddress,
      abi: bridgeABI,
      functionName,
      account: address,
      args,
    };
    const gas = await publicClient.estimateContractGas(cBridgeArgs as any);
    const gasPrice = await publicClient.getGasPrice();
    const hash = await walletClient.writeContract({
      ...(cBridgeArgs as any),
      gas,
      gasPrice,
    });
    return hash;
  } catch (error) {
    throw new Error(`Failed to send CBridge token: ${error}`);
  }
};
