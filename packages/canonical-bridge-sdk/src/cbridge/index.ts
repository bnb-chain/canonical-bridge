import { BaseBridgeConfig, BaseBridgeConfigOptions } from '@/core/types';
import { CLIENT_TIME_OUT } from '@/core/constants';
import axios, { AxiosInstance } from 'axios';
import {
  CBridgeEstimateAmountRequest,
  CBridgeEstimateAmountResponse,
  CBridgeSendRangeInput,
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
    bridgeABI,
    functionName,
    address,
    args,
  }: ISendCBridgeToken): Promise<Hash> {
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
  }

  /**
   * Get cBridge contract address from cross chain transfer
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
      } else {
        throw new Error('No cBridge bridge address found');
      }
    }
  }

  /**
   * Get cBridge transfer parameters
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
}
