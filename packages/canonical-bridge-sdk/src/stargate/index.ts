import { CLIENT_TIME_OUT, VALIDATION_API_TIMEOUT } from '@/core/constants';
import {
  BaseBridgeConfig,
  BaseBridgeConfigOptions,
  CreateAdapterParameters,
} from '@/core/types';
import { isEvmAddress } from '@/core/utils/address';
import { STARGATE_POOL } from '@/stargate/abi/stargatePool';
import { stargateChainKey } from '@/stargate/const';
import {
  ISendTokenInput,
  IStarGateBusDriveSettings,
  IStargateOFTQuote,
  IStargateQuoteOFT,
  IStargateTokenList,
  IStargateTokenValidateParams,
  StarGateTransferConfigs,
} from '@/stargate/types';
import { createAdapter } from '@/stargate/utils/createAdapter';
import axios, { AxiosInstance } from 'axios';
import { Hash, pad } from 'viem';

export * from './types';

export function stargateConfig(
  options: BaseBridgeConfigOptions
): BaseBridgeConfig {
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
  async getBusQueueTime({
    fromEndpointId,
    toEndpointId,
  }: {
    fromEndpointId: string;
    toEndpointId: string;
  }) {
    return (
      await this.client!.get<IStarGateBusDriveSettings>(
        `${fromEndpointId}/${toEndpointId}`
      )
    ).data;
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
      return hash;
    } catch (error: any) {
      throw new Error(`Failed to send token: ${error}`);
    }
  }

  /**
   * Validate token information
   * @param {fromBridgeAddress} from chain bridge contract address
   * @param {fromTokenAddress}  from token address
   * @param {fromTokenSymbol}   from token symbol
   * @param {fromChainId}       from chain id
   * @param {toTokenAddress}    to token address
   * @param {toTokenSymbol}     to token symbol
   * @param {toChainId}         to chain id
   * @param {toBridgeAddress}   to chain bridge contract address
   * @param {amount}            send token amount
   * @param {toPublicClient}    to chain public client
   * @param {fromPublicClient}  from chain public client
   * @param {dstEndpointId}     Stargate destination endpoint id
   * @param {stargateEndpoint}  Stargate API endpoint
   * @returns {boolean}         is token information valid or not
   */
  async validateStargateToken({
    fromBridgeAddress,
    fromTokenAddress,
    fromTokenDecimals,
    fromTokenSymbol,
    fromChainId,
    toTokenAddress,
    toTokenSymbol,
    toTokenDecimals,
    toChainId,
    toBridgeAddress,
    amount,
    toPublicClient,
    fromPublicClient,
    dstEndpointId,
    stargateEndpoint,
  }: IStargateTokenValidateParams) {
    try {
      // Check params exist
      if (
        !fromChainId ||
        !fromTokenAddress ||
        !fromTokenSymbol ||
        !fromTokenDecimals ||
        !fromBridgeAddress ||
        !toBridgeAddress ||
        !toTokenAddress ||
        !toTokenSymbol ||
        !toTokenDecimals ||
        !toChainId ||
        !amount ||
        !toPublicClient ||
        !fromPublicClient ||
        !dstEndpointId
      ) {
        console.log('Missing Stargate params');
        console.log('-- from ChainId', fromChainId);
        console.log('-- from TokenAddress', fromTokenAddress);
        console.log('-- from TokenSymbol', fromTokenSymbol);
        console.log('-- from TokenDecimals', fromTokenDecimals);
        console.log('-- from bridgeAddress', fromBridgeAddress);
        console.log('-- to ChainId', toChainId);
        console.log('-- to TokenAddress', toTokenAddress);
        console.log('-- to bridgeAddress', toBridgeAddress);
        console.log('-- to TokenSymbol', toTokenSymbol);
        console.log('-- to TokenDecimals', toTokenDecimals);
        console.log('-- amount', amount);
        console.log('-- to PublicClient', toPublicClient);
        console.log('-- from PublicClient', fromPublicClient);
        console.log('-- dstEndpointId', dstEndpointId);
        console.log('-- stargateEndpoint', stargateEndpoint);
        return false;
      }
      // Check token address and bridge address
      if (
        !isEvmAddress(fromTokenAddress) ||
        !isEvmAddress(fromBridgeAddress) ||
        !isEvmAddress(toBridgeAddress) ||
        !isEvmAddress(toTokenAddress)
      ) {
        console.log(
          'Invalid Stargate Evm Address',
          fromTokenAddress,
          fromBridgeAddress,
          toBridgeAddress,
          toTokenAddress
        );
        return false;
      }
      const fromChainKey = stargateChainKey[fromChainId] ?? '';
      const toChainKey = stargateChainKey[toChainId] ?? '';

      if (!fromChainKey || !toChainKey) {
        console.log('Failed to get chain key');
        console.log('From chain key', fromChainKey, fromChainId);
        console.log('To chain key', toChainKey, toChainId);
        return false;
      }
      // Check Stargate from chain information
      const fromApiTokenAddr = await fromPublicClient.readContract({
        address: fromBridgeAddress as `0x${string}`,
        abi: STARGATE_POOL,
        functionName: 'token',
      });
      if (fromApiTokenAddr.toLowerCase() !== fromTokenAddress.toLowerCase()) {
        console.log('Stargate from token address not matched');
        console.log('fromBridgeAddress', fromBridgeAddress);
        console.log('from token address in API', fromApiTokenAddr);
        return false;
      }
      // Check Stargate to chain information
      const dstId = await toPublicClient.readContract({
        address: toBridgeAddress as `0x${string}`,
        abi: STARGATE_POOL,
        functionName: 'localEid',
      });
      if (dstId !== dstEndpointId) {
        console.log('Stargate endpoint Id not matched', dstId, dstEndpointId);
        return false;
      }
      const toApiTokenAddr = await toPublicClient.readContract({
        address: toBridgeAddress as `0x${string}`,
        abi: STARGATE_POOL,
        functionName: 'token',
      });
      if (toApiTokenAddr.toLowerCase() !== toTokenAddress.toLowerCase()) {
        console.log(
          'Stargate to token address not matched',
          toApiTokenAddr,
          toTokenAddress
        );
        return false;
      }
      // Check token information from API
      const { data: stargateConfig } = await axios.get<{
        data: IStargateTokenList;
      }>(`${stargateEndpoint}`, { timeout: VALIDATION_API_TIMEOUT });
      if (!stargateConfig) {
        console.log('Failed to get Stargate API config');
        return false;
      }
      // From token info
      const fromTokenInfo = stargateConfig.data?.v2?.filter((fromToken) => {
        return (
          fromToken.chainKey.toLowerCase() === fromChainKey.toLowerCase() &&
          fromToken.address.toLowerCase() === fromBridgeAddress.toLowerCase() && // bridge contract address
          fromToken.token.decimals === fromTokenDecimals &&
          fromToken.token.symbol.toLowerCase() ===
            fromTokenSymbol.toLowerCase() &&
          fromToken.token.address.toLowerCase() ===
            fromTokenAddress.toLowerCase()
        );
      });
      // To token info
      const toTokenInfo = stargateConfig.data?.v2?.filter((toToken) => {
        return (
          toToken.chainKey.toLowerCase() === toChainKey.toLowerCase() &&
          toToken.address.toLowerCase() === toBridgeAddress.toLowerCase() &&
          toToken.token.symbol.toLowerCase() === toTokenSymbol.toLowerCase() &&
          toToken.token.decimals === toTokenDecimals &&
          toToken.token.address.toLowerCase() === toTokenAddress.toLowerCase()
        );
      });

      if (
        !!fromTokenInfo &&
        fromTokenInfo.length > 0 &&
        !!toTokenInfo &&
        toTokenInfo.length > 0
      ) {
        console.log('Stargate token info matched');
        console.log('fromTokenInfo', fromTokenInfo);
        console.log('toTokenInfo', toTokenInfo);
        return true;
      }
      console.log('Could not find Stargate token info');
      console.log('-- from ChainId', fromChainId);
      console.log('-- from TokenAddress', fromTokenAddress);
      console.log('-- from TokenSymbol', fromTokenSymbol);
      console.log('-- from bridgeAddress', fromBridgeAddress);
      console.log('-- to ChainId', toChainId);
      console.log('-- to TokenAddress', toTokenAddress);
      console.log('-- to TokenSymbol', toTokenSymbol);
      console.log('-- to PublicClient', toPublicClient);
      console.log('-- to bridgeAddress', toBridgeAddress);
      console.log('-- amount', amount);
      console.log('-- dstEndpointId', dstEndpointId);
      return false;
      // eslint-disable-next-line
    } catch (error: any) {
      console.log('Stargate token validation error', error);
      return false;
    }
  }

  /** @see createAdapter for implementation details */
  createAdapter(params: CreateAdapterParameters<StarGateTransferConfigs>) {
    return createAdapter(params);
  }
}
