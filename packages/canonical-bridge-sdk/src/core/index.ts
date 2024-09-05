import { LayerZero } from '@/layerZero';
import { CBridge, CBridgePeggedPairConfig } from '@/cbridge';
import { ERC20_TOKEN } from '@/core/abi/erc20Token';
import {
  BaseBridgeConfig,
  BridgeAddress,
  BridgeEndpointId,
  BridgeType,
  IApproveTokenInput,
  IGetAllowanceInput,
  IGetTokenBalanceInput,
} from '@/core/types';
import { DeBridge, DeBridgeConfig } from '@/debridge';
import { Stargate } from '@/stargate';
import { Hash, type PublicClient, type WalletClient } from 'viem';

export * from './types';

export interface CanonicalBridgeSDKOptions<T extends BaseBridgeConfig> {
  bridgeConfigs: T[];
}

export class CanonicalBridgeSDK {
  cBridge!: CBridge;
  deBridge!: DeBridge;
  stargate!: Stargate;
  layerZero!: LayerZero;

  constructor(
    options: CanonicalBridgeSDKOptions<BaseBridgeConfig | DeBridgeConfig>
  ) {
    const cBridgeConfig = options.bridgeConfigs.find(
      (item) => item.bridgeType === 'cBridge'
    );

    const deBridgeConfig = options.bridgeConfigs.find(
      (item) => item.bridgeType === 'deBridge'
    );

    const stargateConfig = options.bridgeConfigs.find(
      (item) => item.bridgeType === 'stargate'
    );

    const layerZeroConfig = options.bridgeConfigs.find(
      (item) => item.bridgeType === 'layerZero'
    );

    if (cBridgeConfig) {
      this.cBridge = new CBridge(cBridgeConfig);
    }
    if (deBridgeConfig) {
      this.deBridge = new DeBridge(deBridgeConfig as DeBridgeConfig);
    }
    if (stargateConfig) {
      this.stargate = new Stargate(stargateConfig);
    }
    if (layerZeroConfig) {
      this.layerZero = new LayerZero();
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

  /**
   * To load all bridge fees at once and return the fee information in the specified order
   * [deBridge, cBridge, stargate, layerZero]
   */
  async loadBridgeFees({
    bridgeType,
    fromChainId,
    fromTokenAddress,
    fromAccount,
    toChainId,
    sendValue,
    fromTokenSymbol,
    publicClient,
    endPointId,
    bridgeAddress,
    toTokenAddress,
    toAccount,
    isPegged,
    slippage,
  }: {
    bridgeType: BridgeType[];
    fromChainId: number;
    fromTokenAddress: `0x${string}`;
    fromAccount: `0x${string}`;
    toChainId: number;
    sendValue: bigint;
    fromTokenSymbol: string;
    publicClient: PublicClient;
    endPointId?: BridgeEndpointId;
    bridgeAddress?: BridgeAddress;
    toTokenAddress?: `0x${string}`;
    toAccount?: `0x${string}`;
    isPegged?: boolean;
    slippage?: number;
  }) {
    const promiseArr = [];
    if (
      this.deBridge &&
      toAccount &&
      toTokenAddress &&
      bridgeType.includes('deBridge')
    ) {
      const debridgeFeeAPICall = this.deBridge.getEstimatedFees({
        fromChainId,
        fromTokenAddress,
        amount: sendValue,
        toChainId,
        toTokenAddress,
        userAddress: toAccount,
      });
      promiseArr.push(debridgeFeeAPICall);
    } else {
      promiseArr.push(new Promise((reject) => reject(null)));
    }
    if (this.cBridge && slippage && bridgeType.includes('cBridge')) {
      const cBridgeFeeAPICall = this.cBridge.getEstimatedAmount({
        src_chain_id: fromChainId,
        dst_chain_id: toChainId,
        token_symbol: fromTokenSymbol,
        amt: String(sendValue),
        user_addr: fromAccount,
        slippage_tolerance: slippage,
        is_pegged: isPegged,
      });
      promiseArr.push(cBridgeFeeAPICall);
    } else {
      promiseArr.push(new Promise((reject) => reject(null)));
    }
    if (
      this.stargate &&
      bridgeAddress?.stargate &&
      endPointId?.layerZeroV2 &&
      bridgeType.includes('stargate')
    ) {
      const stargateFeeAPICall = this.stargate.getQuoteOFT({
        publicClient: publicClient,
        bridgeAddress: bridgeAddress.stargate,
        endPointId: endPointId.layerZeroV2,
        receiver: fromAccount,
        amount: sendValue,
      });
      promiseArr.push(stargateFeeAPICall);
    } else {
      promiseArr.push(new Promise((reject) => reject(null)));
    }
    if (
      this.layerZero &&
      bridgeAddress?.layerZero &&
      endPointId?.layerZeroV1 &&
      bridgeType.includes('layerZero')
    ) {
      const layerZeroFeeAPICall = this.layerZero.getEstimateFee({
        bridgeAddress: bridgeAddress.layerZero,
        amount: sendValue,
        dstEndpoint: endPointId.layerZeroV1,
        userAddress: fromAccount,
        publicClient,
      });
      promiseArr.push(layerZeroFeeAPICall);
    } else {
      promiseArr.push(new Promise((reject) => reject(null)));
    }
    return await Promise.allSettled<any>(promiseArr);
  }

  /**
   * Send token through different bridge mode
   */
  async sendToken({
    bridgeType,
    fromChainId,
    amount,
    userAddress,
    tokenAddress,
    toChainId,
    bridgeAddress,
    walletClient,
    publicClient,
    slippage,
    peggedConfig,
    bridgeEndPointId,
    debridgeOpts,
    cBridgeOpts,
  }: {
    bridgeType: BridgeType;
    fromChainId: number;
    amount: bigint;
    userAddress: `0x${string}`;
    tokenAddress: `0x${string}`;
    toChainId: number;
    bridgeAddress: `0x${string}`;
    walletClient: WalletClient;
    publicClient: PublicClient;
    slippage?: number;
    peggedConfig?: CBridgePeggedPairConfig;
    deBridgeData?: `0x${string}`;
    bridgeEndPointId?: BridgeEndpointId;
    debridgeOpts?: {
      data?: `0x${string}`;
    };
    cBridgeOpts?: {
      isPegged?: boolean;
    };
  }) {
    // deBridge
    if (
      this.deBridge &&
      bridgeType === 'deBridge' &&
      debridgeOpts &&
      debridgeOpts?.data
    ) {
      if (!debridgeOpts?.data) {
        throw new Error('Invalid deBridge data');
      }
      return await this.deBridge.sendToken({
        walletClient,
        bridgeAddress,
        data: debridgeOpts?.data,
        amount,
        address: userAddress,
      });
    }
    // cBridge
    else if (
      this.cBridge &&
      bridgeType === 'cBridge' &&
      cBridgeOpts &&
      cBridgeOpts?.isPegged &&
      slippage
    ) {
      const transferType = this.cBridge.getTransferType({
        peggedConfig,
        fromChainId,
      });
      const nonce = new Date().getTime();
      const transferArgs = this.cBridge.getTransferParams({
        amount,
        isPegged: cBridgeOpts.isPegged,
        toChainId,
        tokenAddress,
        address: userAddress,
        maxSlippage: slippage,
        transferType: transferType,
        peggedConfig: peggedConfig,
        nonce,
      });
      return await this.cBridge.sendToken({
        walletClient,
        publicClient,
        bridgeAddress,
        fromChainId,
        address: userAddress,
        isPegged: cBridgeOpts.isPegged,
        peggedConfig,
        args: transferArgs,
      });
    }
    // stargate
    else if (
      this.stargate &&
      bridgeType === 'stargate' &&
      bridgeEndPointId?.layerZeroV2
    ) {
      return await this.stargate.sendToken({
        walletClient,
        publicClient,
        bridgeAddress,
        tokenAddress,
        endPointId: bridgeEndPointId?.layerZeroV2,
        receiver: userAddress,
        amount,
      });
    }
    // May implement LayerZero v2 in the future
    else if (
      this.layerZero &&
      bridgeType === 'layerZero' &&
      bridgeEndPointId?.layerZeroV1
    ) {
      return await this.layerZero.sendToken({
        userAddress,
        bridgeAddress,
        amount,
        dstEndpoint: bridgeEndPointId?.layerZeroV1 as number,
        publicClient,
        walletClient,
      });
    } else {
      throw new Error('Invalid bridge inputs');
    }
  }
}
