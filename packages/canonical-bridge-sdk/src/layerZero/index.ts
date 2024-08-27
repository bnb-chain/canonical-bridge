import { CAKE_PROXY_OFT_ABI } from '@/layerZero/abi/cakeProxyOFT';
import { IGetEstimateFeeInput, ISendCakeTokenInput } from '@/layerZero/types';
import { encodePacked, Hash, pad } from 'viem';

// LayerZero V1
export class LayerZeroV1 {
  /**
   * Send token through layerZero V1 OFT
   * https://docs.layerzero.network/v1/developers/evm/evm-guides/advanced/relayer-adapter-parameters
   *
   * @param userAddress User address
   * @param bridgeAddress Bridge address
   * @param amount Send amount
   * @param dstEndpoint Destination endpoint
   * @param publicClient Public client
   * @param walletClient Wallet client
   * @param gasAmount Gas amount
   * @param version Relayer adapter parameters version
   */
  async sendToken({
    userAddress,
    bridgeAddress,
    amount,
    dstEndpoint,
    publicClient,
    walletClient,
    gasAmount = 200000n,
    version = 1,
  }: ISendCakeTokenInput): Promise<Hash> {
    try {
      const address32Bytes = pad(userAddress, { size: 32 });
      const adapterParams = encodePacked(
        ['uint16', 'uint256'],
        [version, gasAmount]
      );
      const fees = await publicClient.readContract({
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'estimateSendFee',
        args: [
          dstEndpoint,
          address32Bytes,
          amount,
          false,
          adapterParams as `0x${string}`,
        ],
      });
      const callParams = [
        userAddress,
        '0x0000000000000000000000000000000000000000', // zroPaymentAddress
        adapterParams,
      ];
      const nativeFee = fees[0];
      const cakeArgs = {
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'sendFrom',
        args: [
          userAddress,
          dstEndpoint,
          address32Bytes,
          amount,
          amount,
          callParams,
        ],
        value: nativeFee,
        account: userAddress,
      };
      const gas = await publicClient.estimateContractGas(cakeArgs as any);
      const gasPrice = await publicClient.getGasPrice();
      const hash = await walletClient.writeContract({
        ...(cakeArgs as any),
        gas,
        gasPrice,
      });
      return hash;
    } catch (error: any) {
      throw new Error(`Failed to send CAKE token ${error}`);
    }
  }

  /**
   * Get estimate fee
   * @param bridgeAddress Bridge address
   * @param amount Send amount
   * @param dstEndpoint Destination endpoint
   * @param userAddress User address
   * @param publicClient Public client
   * @param gasAmount Gas amount
   * @param version Relayer adapter parameters version
   * @returns Estimate fee
   */
  async getEstimateFee({
    bridgeAddress,
    amount,
    dstEndpoint,
    userAddress,
    publicClient,
    gasAmount = 200000n,
    version = 1,
  }: IGetEstimateFeeInput) {
    try {
      const address32Bytes = pad(userAddress, { size: 32 });
      const adapterParams = encodePacked(
        ['uint16', 'uint256'],
        [version, gasAmount]
      );
      const fees = await publicClient.readContract({
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'estimateSendFee',
        args: [
          dstEndpoint,
          address32Bytes,
          amount,
          false,
          adapterParams as `0x${string}`,
        ],
      });
      return fees;
    } catch (error: any) {
      throw new Error(`Failed to get estimate fee ${error}`);
    }
  }
}
