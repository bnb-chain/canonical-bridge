import { CLIENT_TIME_OUT } from '@/core/constants';
import { BaseBridgeConfig, BaseBridgeConfigOptions } from '@/core/types';
import { STARGATE_POOL } from '@/stargate/abi/stargatePool';
import {
  ISendTokenInput,
  IStarGateBusDriveSettings,
  IStargateOFTQuote,
  IStargateQuoteOFT,
} from '@/stargate/types';
import axios, { AxiosInstance } from 'axios';
import { Hash, pad } from 'viem';

export * from './types';

export function stargateConfig(options: BaseBridgeConfigOptions): BaseBridgeConfig {
  return {
    bridgeType: 'stargate',
    timeout: CLIENT_TIME_OUT,
    ...options,
  };
}

export class Stargate {
  private client?: AxiosInstance;

  constructor(config: BaseBridgeConfig) {
    const { timeout, endpoint } = config;

    this.client = axios.create({
      timeout,
      baseURL: endpoint,
    });
  }

  // https://mainnet.stargate-api.com/v1/swagger
  async getBusQueueTime(fromEndpointId: string, toEndpointId: string) {
    return (await this.client!.get<IStarGateBusDriveSettings>(`${fromEndpointId}/${toEndpointId}`))
      .data;
  }

  // https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/integrate-with-stargate/estimating-fees#quoteoft
  async getQuoteOFT({
    publicClient,
    bridgeAddress,
    endPointId,
    receiver,
    amount,
  }: IStargateQuoteOFT) {
    const sendParams = {
      dstEid: endPointId,
      to: pad(receiver, { size: 32 }) as `0x${string}`,
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: '0x' as `0x${string}`,
      composeMsg: '0x' as `0x${string}`,
      oftCmd: '0x01' as `0x${string}`, // '0x01' for bus, '' for taxi
    };

    try {
      const quoteOFTResponse = await publicClient?.readContract({
        address: bridgeAddress,
        abi: STARGATE_POOL,
        functionName: 'quoteOFT',
        args: [sendParams] as any,
      });
      return quoteOFTResponse;
    } catch (error: any) {
      throw new Error(`Failed to get quote OFT: ${error}`);
    }
  }

  // https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/integrate-with-stargate/estimating-fees#quotesend
  async getQuoteSend({
    publicClient,
    bridgeAddress,
    endPointId,
    receiver,
    amount,
    minAmount,
  }: IStargateOFTQuote) {
    const sendParams = {
      dstEid: endPointId,
      to: pad(receiver, { size: 32 }) as `0x${string}`,
      amountLD: amount,
      minAmountLD: minAmount,
      extraOptions: '0x' as `0x${string}`,
      composeMsg: '0x' as `0x${string}`,
      oftCmd: '0x01' as `0x${string}`, // '0x01' for bus, '' for taxi
    };
    try {
      const quoteSendResponse = await publicClient?.readContract({
        address: bridgeAddress,
        abi: STARGATE_POOL,
        functionName: 'quoteSend',
        args: [sendParams, false] as any, // false for not paying lzToken
      });
      return quoteSendResponse;
    } catch (error: any) {
      throw new Error(`Failed to get quote send: ${error}`);
    }
  }

  /**
   * Send token through Stargate bridge
   * @param {WalletClient} walletClient Wallet client
   * @param {PublicClient} publicClient Public client
   * @param {Address} bridgeAddress Bridge address
   * @param {Address} tokenAddress ERC-20 token address
   * @param {Number} endPointId Stargate end point ID
   * @param {Address} receiver Receiver address
   * @param {BigInt} amount Send amount
   * @returns {Hash} transaction hash
   */
  async sendToken({
    walletClient,
    publicClient,
    bridgeAddress,
    tokenAddress,
    endPointId,
    receiver,
    amount,
  }: ISendTokenInput): Promise<Hash> {
    const sendParams = {
      dstEid: endPointId,
      to: pad(receiver, { size: 32 }) as `0x${string}`,
      amountLD: amount,
      minAmountLD: amount,
      extraOptions: '0x' as `0x${string}`,
      composeMsg: '0x' as `0x${string}`,
      oftCmd: '0x01' as `0x${string}`, // '0x01' for bus, '' for taxi
    };
    try {
      const quoteOFTResponse = await this.getQuoteOFT({
        publicClient,
        bridgeAddress,
        endPointId,
        receiver,
        amount,
      });
      if (quoteOFTResponse?.[2].amountReceivedLD) {
        sendParams.minAmountLD = BigInt(quoteOFTResponse[2].amountReceivedLD);
      }
      const quoteSendResponse = await this.getQuoteSend({
        publicClient,
        bridgeAddress,
        endPointId,
        receiver,
        amount,
        minAmount: sendParams.minAmountLD,
      });
      let nativeFee = quoteSendResponse.nativeFee;
      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        nativeFee += sendParams.amountLD;
      }
      const sendTokenArgs = {
        address: bridgeAddress,
        abi: STARGATE_POOL,
        functionName: 'sendToken',
        args: [sendParams, quoteSendResponse, receiver],
        value: nativeFee,
        account: receiver,
      };
      const hash = await walletClient?.writeContract({
        ...(sendTokenArgs as any),
      });
      await publicClient.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
      });
      return hash;
    } catch (error: any) {
      throw new Error(`Failed to send token: ${error}`);
    }
  }
}
