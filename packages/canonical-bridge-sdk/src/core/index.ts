import { CBridge } from '@/cbridge';
import { ERC20_TOKEN } from '@/core/abi/erc20Token';
import {
  BaseBridgeConfig,
  IApproveTokenInput,
  IGetAllowanceInput,
  IGetTokenBalanceInput,
} from '@/core/types';
import { DeBridge, DeBridgeConfig } from '@/debridge';
import { Stargate } from '@/stargate';
import { Hash } from 'viem';

export interface CanonicalBridgeSDKOptions<T extends BaseBridgeConfig> {
  bridgeConfigs: T[];
}

export class CanonicalBridgeSDK {
  cBridge!: CBridge;
  deBridge!: DeBridge;
  stargate!: Stargate;

  constructor(options: CanonicalBridgeSDKOptions<BaseBridgeConfig>) {
    const cBridgeConfig = options.bridgeConfigs.find((item) => item.bridgeType === 'cBridge');

    const deBridgeConfig = options.bridgeConfigs.find((item) => item.bridgeType === 'deBridge');

    const stargateConfig = options.bridgeConfigs.find((item) => item.bridgeType === 'stargate');

    if (cBridgeConfig) {
      this.cBridge = new CBridge(cBridgeConfig);
    }
    if (deBridgeConfig) {
      this.deBridge = new DeBridge(deBridgeConfig as DeBridgeConfig);
    }
    if (stargateConfig) {
      this.stargate = new Stargate(stargateConfig);
    }
  }

  /**
   * Approve ERC-20 token
   * @param {WalletClient} walletClient Wallet client
   * @param {Address} tokenAddress ERC-20 token address
   * @param {BigInt} amount approve amount
   * @param {Address} address wallet/account address
   * @param {Address} spender spender address
   * @returns {Hash} transaction hash
   */
  async approveToken({
    walletClient,
    tokenAddress,
    amount,
    address,
    spender,
  }: IApproveTokenInput): Promise<Hash> {
    try {
      const hash = await walletClient?.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_TOKEN,
        functionName: 'approve',
        args: [spender, amount as bigint],
        chain: walletClient.chain,
        account: address,
      });
      return hash;
    } catch (error: any) {
      throw new Error(`Failed to approve token:: ${error}`);
    }
  }

  /**
   * Get token allowance
   * @param {PublicClient} publicClient Public client
   * @param {Address} tokenAddress ERC-20 token address
   * @param {Address} owner owner/account address
   * @param {Address} spender spender address
   * @returns {BigInt} token allowance amount
   */
  async getTokenAllowance({
    publicClient,
    tokenAddress,
    owner,
    spender,
  }: IGetAllowanceInput): Promise<bigint> {
    try {
      const allowance = await publicClient?.readContract({
        abi: ERC20_TOKEN,
        address: tokenAddress,
        functionName: 'allowance',
        args: [owner, spender],
      });
      return allowance;
    } catch (error: any) {
      throw new Error(`Failed to get token allowance: ${error}`);
    }
  }

  /**
   * Get token balance
   * @param {PublicClient} publicClient Public client
   * @param {Address} tokenAddress ERC-20 token address
   * @param {Address} owner owner/account address
   * @returns {BigInt} token balance amount
   */
  async getTokenBalance({
    publicClient,
    tokenAddress,
    owner,
  }: IGetTokenBalanceInput): Promise<bigint> {
    try {
      const balance = await publicClient?.readContract({
        abi: ERC20_TOKEN,
        address: tokenAddress,
        functionName: 'balanceOf',
        args: [owner],
      });
      return balance;
    } catch (error: any) {
      throw new Error(`Failed to get token balance: ${error}`);
    }
  }
}
