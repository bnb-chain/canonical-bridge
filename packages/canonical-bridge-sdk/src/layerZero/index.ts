import { CreateAdapterParameters } from '@/core';
import { formatNumber } from '@/core/utils/number';
import { CAKE_PROXY_OFT_ABI } from '@/layerZero/abi/cakeProxyOFT';
import {
  IGetEstimateFeeInput,
  ISendCakeTokenInput,
  LayerZeroTransferConfigs,
} from '@/layerZero/types';
import { createAdapter } from '@/layerZero/utils/createAdapter';
import { encodePacked, formatUnits, Hash, pad, parseUnits } from 'viem';

export * from './types';
export class LayerZero {
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
    airDropGas = 0n,
    dstAddress = '0x',
  }: ISendCakeTokenInput): Promise<Hash> {
    try {
      const address32Bytes = pad(userAddress, { size: 32 });
      // check destination chain gas limit
      const dstGasLimit = await publicClient.readContract({
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'minDstGasLookup',
        args: [dstEndpoint, 0],
      });
      const gasLimit =
        dstGasLimit !== 0n && !!dstGasLimit ? dstGasLimit : gasAmount;
      /* version 1 - send token
       * version 2 - send token and air drop native gas on destination chain
       * https://docs.layerzero.network/v1/developers/evm/evm-guides/advanced/relayer-adapter-parameters#airdrop
       */
      const adapterParams =
        version === 1
          ? encodePacked(['uint16', 'uint256'], [version, gasLimit])
          : encodePacked(
              ['uint16', 'uint', 'uint', 'address'],
              [2, gasLimit, airDropGas, dstAddress]
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
      const minAmount = parseUnits(
        String(formatNumber(Number(formatUnits(amount, 18)), 8)),
        18
      );
      const cakeArgs = {
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'sendFrom',
        args: [
          userAddress,
          dstEndpoint,
          address32Bytes,
          amount,
          minAmount,
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
    airDropGas = 0n,
    dstAddress = '0x',
  }: IGetEstimateFeeInput) {
    try {
      // check destination chain gas limit
      const dstGasLimit = await publicClient.readContract({
        address: bridgeAddress,
        abi: CAKE_PROXY_OFT_ABI,
        functionName: 'minDstGasLookup',
        args: [dstEndpoint, 0],
      });
      const gasLimit =
        dstGasLimit !== 0n && !!dstGasLimit ? dstGasLimit : gasAmount;
      const address32Bytes = pad(userAddress, { size: 32 });
      const adapterParams =
        version === 1
          ? encodePacked(['uint16', 'uint256'], [version, gasLimit])
          : encodePacked(
              ['uint16', 'uint', 'uint', 'address'],
              [2, gasLimit, airDropGas, dstAddress]
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

  /** @see createAdapter for implementation details */
  createAdapter(params: CreateAdapterParameters<LayerZeroTransferConfigs>) {
    return createAdapter(params);
  }
}
