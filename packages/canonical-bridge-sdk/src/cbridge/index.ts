import {
  BaseBridgeConfig,
  BaseBridgeConfigOptions,
  CreateAdapterParameters,
} from '@/core/types';
import { CLIENT_TIME_OUT, VALIDATION_API_TIMEOUT } from '@/core/constants';
import axios, { AxiosInstance } from 'axios';
import {
  CBridgeChain,
  CBridgeEstimateAmountRequest,
  CBridgeEstimateAmountResponse,
  CBridgePeggedPairConfig,
  CBridgeSendRangeInput,
  CBridgeTransferConfigs,
  CBridgeTransferEstimatedTime,
  ICBridgeTokenValidateParams,
  ICBridgeTransferConfig,
  IGetCBridgeABI,
  IGetCBridgeTransferAddressInput,
  IGetCBridgeTransferFunction,
  IGetCBridgeTransferParamsInput,
  ISendCBridgeToken,
} from '@/cbridge/types';
import { getContract, Hash } from 'viem';
import { POOL_TRANSFER_BRIDGE } from '@/cbridge/abi/poolTransferBridge';
import { ORIGINAL_TOKEN_VAULT } from '@/cbridge/abi/originalTokenVault';
import { ORIGINAL_TOKEN_VAULT_V2 } from '@/cbridge/abi/originalTokenVaultV2';
import { PEGGED_TOKEN_BRIDGE } from '@/cbridge/abi/peggedTokenBridge';
import { PEGGED_TOKEN_BRIDGE_V2 } from '@/cbridge/abi/peggedTokenBridgeV2';
import { createAdapter } from '@/cbridge/utils/createAdapter';
import { isEvmAddress } from '@/core/utils/address';

export * from './types';

export function cBridgeConfig(
  options: BaseBridgeConfigOptions
): BaseBridgeConfig {
  return {
    bridgeType: 'cBridge',
    timeout: CLIENT_TIME_OUT,
    ...options,
  };
}

export class CBridge {
  private client?: AxiosInstance;

  constructor(config: BaseBridgeConfig) {
    const { timeout, endpoint } = config;

    this.client = axios.create({
      timeout,
      baseURL: endpoint,
    });
  }

  // https://cbridge-docs.celer.network/developer/api-reference/gateway-estimateamt
  async getEstimatedAmount(params: CBridgeEstimateAmountRequest) {
    return (
      await this.client!.get<CBridgeEstimateAmountResponse>(`v2/estimateAmt`, {
        params,
      })
    ).data;
  }

  /**
   * Get estimated waiting time for cross-chain transfer
   *
   * @param number    srcChainId source chain ID
   * @param number    dstChainId destination chain ID
   */
  async getEstimatedWaitingTime({
    srcChainId,
    dstChainId,
  }: {
    srcChainId: number;
    dstChainId: number;
  }) {
    const params = {
      src_chain_id: srcChainId,
      dst_chain_id: dstChainId,
    };
    return (
      await this.client!.get<CBridgeTransferEstimatedTime>(
        `v2/getLatest7DayTransferLatencyForQuery`,
        {
          params,
        }
      )
    ).data;
  }

  /**
   * Get minimum and maximum token transfer
   * Only get minimum and maximum send amount
   * @param {Address} bridgeAddress - Bridge address
   * @param {Address} tokenAddress - Token address
   * @param {PublicClient} client - Public client
   * @returns {Object} min and max amount
   */
  async getSendRange({
    bridgeAddress,
    tokenAddress,
    client,
  }: CBridgeSendRangeInput): Promise<{ min: bigint; max: bigint }> {
    const contract = getContract({
      address: bridgeAddress,
      abi: POOL_TRANSFER_BRIDGE,
      client: client,
    });
    try {
      const minAmount = await contract.read.minSend([tokenAddress]);
      const maxAmount = await contract.read.maxSend([tokenAddress]);
      return {
        min: minAmount,
        max: maxAmount,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to get cBridge minimum and maximum transfer amount: ${error}`
      );
    }
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
  async sendToken({
    walletClient,
    publicClient,
    bridgeAddress,
    fromChainId,
    address,
    isPegged,
    peggedConfig,
    args,
  }: ISendCBridgeToken): Promise<Hash> {
    try {
      const transferType = this.getTransferType({
        peggedConfig,
        fromChainId,
      });
      const ABI = this.getABI({
        isPegged,
        transferType,
        peggedConfig,
      });
      const functionName = this.getTransferFunction({
        isPegged,
        transferType,
      });
      const cBridgeArgs = {
        address: bridgeAddress,
        abi: ABI,
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
  }

  /**
   * Get cBridge contract address from cross chain transfer
   *
   * @param fromChainId Chain ID of the source chain
   * @param isPegged Pool-based transfer(xLiquidity) - false
   *                 Canonical Mapping Transfer(xAsset) - true
   * @param peggedConfig Pegged pair configuration
   * @param chainConfig Chain configuration
   */
  getTransferAddress({
    fromChainId,
    isPegged,
    peggedConfig,
    chainConfig,
  }: IGetCBridgeTransferAddressInput) {
    if (isPegged) {
      if (peggedConfig?.org_chain_id === fromChainId) {
        // cBridge deposit
        return peggedConfig.pegged_deposit_contract_addr;
      } else if (peggedConfig?.pegged_chain_id === fromChainId) {
        // cBridge burn
        return peggedConfig.pegged_burn_contract_addr;
      }
    } else {
      if (chainConfig?.contract_addr) {
        return chainConfig?.contract_addr;
      }
    }
    throw new Error('No cBridge bridge address found');
  }

  /**
   * Get cBridge transfer parameters
   *
   * @param amount Send amount
   * @param isPegged Pool-based transfer(xLiquidity) - false
   *                Canonical Mapping Transfer(xAsset) - true
   * @param toChainId Chain ID of the destination chain
   * @param tokenAddress Address of ERC20 token
   * @param address User address
   * @param maxSlippage Maximum slippage
   * @param transferType Transfer type - deposit | withdraw
   * @param peggedConfig Pegged pair configuration
   * @param nonce Nonce current timestamp
   */
  getTransferParams({
    amount,
    isPegged,
    toChainId,
    tokenAddress,
    address,
    maxSlippage,
    transferType,
    peggedConfig,
    nonce,
  }: IGetCBridgeTransferParamsInput) {
    return isPegged === false
      ? [address, tokenAddress, amount, toChainId, nonce, maxSlippage]
      : transferType === 'deposit'
      ? [tokenAddress, amount, toChainId, address as `0x${string}`, nonce]
      : transferType === 'withdraw'
      ? peggedConfig?.bridge_version === 0
        ? [tokenAddress, amount, address as `0x${string}`, nonce]
        : [tokenAddress, amount, toChainId, address as `0x${string}`, nonce]
      : null;
  }

  /**
   * Get cross chain transfer ABI
   *
   * @param isPegged Pool-based transfer(xLiquidity) - false
   *               Canonical Mapping Transfer(xAsset) - true
   * @param transferType Transfer type - deposit | withdraw
   * @param peggedConfig Pegged pair configuration
   */
  getABI({ isPegged, transferType, peggedConfig }: IGetCBridgeABI) {
    return isPegged === false || !peggedConfig
      ? POOL_TRANSFER_BRIDGE
      : transferType === 'deposit'
      ? peggedConfig?.vault_version === 0
        ? ORIGINAL_TOKEN_VAULT
        : ORIGINAL_TOKEN_VAULT_V2
      : transferType === 'withdraw'
      ? peggedConfig?.bridge_version === 0
        ? PEGGED_TOKEN_BRIDGE
        : PEGGED_TOKEN_BRIDGE_V2
      : (undefined as any);
  }

  /**
   * Get cross chain transfer function name
   *
   * @param isPegged
   * @returns string
   */
  getTransferFunction({ isPegged, transferType }: IGetCBridgeTransferFunction) {
    return isPegged === false
      ? 'send'
      : transferType === 'deposit'
      ? 'deposit'
      : transferType === 'withdraw'
      ? 'burn'
      : '';
  }

  /** @see createAdapter for implementation details */
  createAdapter(params: CreateAdapterParameters<CBridgeTransferConfigs>) {
    return createAdapter(params);
  }

  /**
   * Get transfer type
   */
  getTransferType({
    peggedConfig,
    fromChainId,
  }: {
    fromChainId: number;
    peggedConfig?: CBridgePeggedPairConfig;
  }) {
    if (peggedConfig?.org_chain_id === fromChainId) {
      return 'deposit';
    }
    if (peggedConfig?.pegged_chain_id === fromChainId) {
      return 'withdraw';
    }
    return undefined;
  }

  /**
   * Generate cBridge transfer arguments
   */
  getArguments({
    isPegged,
    peggedConfig,
    chainConfig,
    amount,
    fromChainId,
    toChainId,
    tokenAddress,
    userAddress,
    maxSlippage,
    nonce,
  }: {
    isPegged: boolean;
    peggedConfig?: CBridgePeggedPairConfig;
    chainConfig?: CBridgeChain;
    amount: bigint;
    fromChainId: number;
    toChainId: number;
    tokenAddress: `0x${string}`;
    userAddress: `0x${string}`;
    maxSlippage: number;
    nonce: number;
  }) {
    const transferType = this.getTransferType({
      peggedConfig,
      fromChainId,
    });
    const functionName = this.getTransferFunction({ isPegged });
    const bridgeABI = this.getABI({
      isPegged,
      transferType: transferType,
      peggedConfig,
    });
    const bridgeAddress = this.getTransferAddress({
      fromChainId: toChainId,
      isPegged,
      peggedConfig,
      chainConfig,
    });
    const args = this.getTransferParams({
      amount,
      isPegged,
      toChainId,
      tokenAddress,
      address: userAddress,
      maxSlippage,
      transferType,
      peggedConfig,
      nonce,
    });
    return {
      address: bridgeAddress as `0x${string}`,
      abi: bridgeABI,
      functionName: functionName,
      account: userAddress as `0x${string}`,
      args: args,
    };
  }

  /**
   * validate token and contract information
   */
  validateCBridgeToken = async ({
    isPegged,
    fromChainId,
    fromTokenAddress,
    fromTokenSymbol,
    fromTokenDecimals,
    bridgeAddress,
    toChainId,
    toTokenAddress,
    toTokenSymbol,
    toTokenDecimals,
    amount,
    cBridgeEndpoint,
  }: ICBridgeTokenValidateParams) => {
    try {
      if (
        !fromChainId ||
        !toChainId ||
        !fromTokenAddress ||
        !bridgeAddress ||
        !fromTokenSymbol ||
        !fromTokenDecimals ||
        !toTokenAddress ||
        !toTokenSymbol ||
        !toTokenDecimals ||
        !amount ||
        !cBridgeEndpoint
      ) {
        console.log('Failed to get cBridge token address validation params');
        console.log('isPegged', isPegged);
        console.log('fromChainId', fromChainId);
        console.log('fromTokenAddress', fromTokenAddress);
        console.log('fromTokenSymbol', fromTokenSymbol);
        console.log('bridgeAddress', bridgeAddress);
        console.log('toChainId', toChainId);
        console.log('toTokenAddress', toTokenAddress);
        console.log('toTokenSymbol', toTokenSymbol);
        console.log('amount', amount);
        console.log('fromTokenDecimals', fromTokenDecimals);
        console.log('toTokenDecimals', toTokenDecimals);
        console.log('cBridgeEndpoint', cBridgeEndpoint);
        return false;
      }
      if (!isEvmAddress(fromTokenAddress) || !isEvmAddress(bridgeAddress)) {
        console.log('Invalid evm address', fromTokenAddress, bridgeAddress);
        return false;
      }
      const { data: cBridgeConfig } = await axios.get<ICBridgeTransferConfig>(
        `${cBridgeEndpoint}`,
        { timeout: VALIDATION_API_TIMEOUT }
      );
      if (!cBridgeConfig) {
        console.log('failed to get cBridge API config');
        return false;
      }
      if (isPegged === true) {
        // pegged token
        const peggedToken = cBridgeConfig.pegged_pair_configs.filter((pair) => {
          const orgToken = pair.org_token.token;
          const peggedToken = pair.pegged_token.token;
          return (
            (pair.pegged_deposit_contract_addr === bridgeAddress &&
              pair.org_chain_id === fromChainId &&
              orgToken.address === fromTokenAddress &&
              orgToken.symbol === fromTokenSymbol &&
              orgToken.decimal === fromTokenDecimals &&
              peggedToken.address === toTokenAddress &&
              peggedToken.symbol === toTokenSymbol &&
              peggedToken.decimal === toTokenDecimals &&
              pair.pegged_chain_id === toChainId) ||
            (pair.pegged_burn_contract_addr === bridgeAddress &&
              pair.pegged_chain_id === fromChainId &&
              peggedToken.address === fromTokenAddress &&
              peggedToken.symbol === fromTokenSymbol &&
              peggedToken.decimal === fromTokenDecimals &&
              orgToken.address === toTokenAddress &&
              orgToken.symbol === toTokenSymbol &&
              orgToken.decimal === toTokenDecimals &&
              pair.org_chain_id === toChainId)
          );
        });
        if (!!peggedToken && peggedToken.length > 0) {
          console.log('cBridge pegged token info matched', peggedToken);
          return true;
        }
        console.log('Can not find cBridge pegged info');
        console.log('-- isPegged', isPegged);
        console.log('-- fromChainId', fromChainId);
        console.log('-- fromTokenAddress', fromTokenAddress);
        console.log('-- fromTokenSymbol', fromTokenSymbol);
        console.log('-- toChainId', toChainId);
        console.log('-- toTokenAddress', toTokenAddress);
        console.log('-- toTokenSymbol', toTokenSymbol);
        console.log('-- bridgeAddress', bridgeAddress);
        return false;
      } else {
        // bridge contract address
        const addressInfo = cBridgeConfig.chains.filter((chain) => {
          return (
            chain.id === fromChainId &&
            chain.contract_addr.toLowerCase() === bridgeAddress.toLowerCase()
          );
        });
        // token info
        const fromTokenInfo = cBridgeConfig.chain_token[
          fromChainId
        ].token.filter((t) => {
          return (
            t.token.address.toLowerCase() === fromTokenAddress.toLowerCase() &&
            t.token.decimal === fromTokenDecimals &&
            t.token.symbol === fromTokenSymbol
          );
        });
        const toTokenInfo = cBridgeConfig.chain_token[toChainId].token.filter(
          (t) => {
            return (
              t.token.address.toLowerCase() === toTokenAddress.toLowerCase() &&
              t.token.decimal === toTokenDecimals &&
              t.token.symbol === toTokenSymbol
            );
          }
        );
        if (
          addressInfo?.length > 0 &&
          fromTokenInfo?.length > 0 &&
          toTokenInfo?.length > 0
        ) {
          console.log('cBridge pool info matched');
          console.log('bridge contract address info', addressInfo);
          console.log('bridge from token info', fromTokenInfo);
          console.log('bridge to token info', toTokenInfo);
          return true;
        } else {
          console.log('Can not find cBridge pool info');
          console.log('-- isPegged', isPegged);
          console.log('-- fromChainId', fromChainId);
          console.log('-- fromTokenAddress', fromTokenAddress);
          console.log('-- fromTokenSymbol', fromTokenSymbol);
          console.log('-- toChainId', toChainId);
          console.log('-- toTokenAddress', toTokenAddress);
          console.log('-- toTokenSymbol', toTokenSymbol);
          console.log('-- bridgeAddress', bridgeAddress);
          return false;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('cBridge token address validation error', error);
      return false;
    }
  };
}
