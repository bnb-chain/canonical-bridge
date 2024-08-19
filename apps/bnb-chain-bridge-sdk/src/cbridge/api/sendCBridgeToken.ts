import { type WalletClient, type PublicClient, Hash } from 'viem';

interface ISendCBridgeToken {
  walletClient: WalletClient;
  publicClient: PublicClient;
  bridgeAddress: string;
  bridgeABI: any;
  functionName: string;
  address: `0x${string}`;
  args: any;
}

/**
 * Send token through CBridge
 * @param {WalletClient} walletClient Wallet client
 * @param {PublicClient} publicClient Wallet client
 * @param {Address} bridgeAddress Bridge address
 * @param {Object[]} bridgeABI Bridge ABI
 * @param {String} functionName Function name
 * @param {Address} address wallet/account address
 * @param {Object[]} args Function arguments
 * @returns
 */
export const sendCBridgeToken = async ({
  walletClient,
  publicClient,
  bridgeAddress,
  bridgeABI,
  functionName,
  address,
  args,
}: ISendCBridgeToken): Promise<Hash> => {
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
