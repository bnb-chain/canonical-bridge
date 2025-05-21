import { LayerZero } from '@/adapters/layerZero';
import { CBridge } from '@/adapters/cBridge';
import { ERC20_TOKEN } from '@/abi/erc20Token';
import {
  IBaseBridgeConfig,
  IBridgeAddress,
  IBridgeEndpointId,
  IApproveTokenInput,
  IGetAllowanceInput,
  IGetTokenBalanceInput,
} from '@/core/types';
import { DeBridge, IDeBridgeConfig } from '@/adapters/deBridge';
import { Stargate } from '@/adapters/stargate';
import { Hash, type PublicClient, type WalletClient } from 'viem';
import { Meson } from '@/adapters/meson';
import { IGetMesonEstimateFeeInput } from '@/adapters/meson/types';
import { BridgeType, IBridgeToken } from '@/shared/types';
import { IDeBridgeEstimatedFeesInput } from '@/adapters/deBridge/types';
import { ICBridgePeggedPairConfig } from '@/adapters/cBridge/types';
import { Mayan } from '@/adapters/mayan';
import { IMayanQuotaInput } from '@/adapters/mayan/types';

export * from './types';

export interface CanonicalBridgeSDKOptions<T extends IBaseBridgeConfig> {
  bridgeConfigs: T[];
}

export class CanonicalBridgeSDK {
  cBridge!: CBridge;
  deBridge!: DeBridge;
  stargate!: Stargate;
  layerZero!: LayerZero;
  meson!: Meson;
  mayan!: Mayan;

  private options: CanonicalBridgeSDKOptions<
    IBaseBridgeConfig | IDeBridgeConfig
  >;

  constructor(
    options: CanonicalBridgeSDKOptions<IBaseBridgeConfig | IDeBridgeConfig>
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

    const mesonConfig = options.bridgeConfigs.find(
      (item) => item.bridgeType === 'meson'
    );

    const mayanConfig = options.bridgeConfigs.find(
      (item) => item.bridgeType === 'mayan'
    )

    if (cBridgeConfig) {
      this.cBridge = new CBridge(cBridgeConfig);
    }
    if (deBridgeConfig) {
      this.deBridge = new DeBridge(deBridgeConfig as IDeBridgeConfig);
    }
    if (stargateConfig) {
      this.stargate = new Stargate(stargateConfig);
    }
    if (layerZeroConfig) {
      this.layerZero = new LayerZero();
    }
    if (mesonConfig) {
      this.meson = new Meson(mesonConfig);
    }
    if (mayanConfig) {
      this.mayan = new Mayan(mayanConfig);
    }

    this.options = options;
  }

  /**
   * Get sdk options
   * @returns {CanonicalBridgeSDKOptions<BaseBridgeConfig | DeBridgeConfig>} sdk options
   */
  public getSDKOptions() {
    return this.options;
  }

  /**
   * Get supported bridges
   * @returns {BridgeType[]} A string list of supported bridges
   */
  public getSupportedBridges() {
    return this.options.bridgeConfigs.map((item) => item.bridgeType);
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
   * Load bridge fees and return fee information in the following order
   * [deBridge, cBridge, stargate, layerZero, meson, mayan]
   */
  async loadBridgeFees({
    bridgeType,
    fromChainId,
    fromAccount,
    toChainId,
    sendValue,
    fromTokenSymbol,
    publicClient,
    endPointId,
    bridgeAddress,
    isPegged,
    slippage,
    mesonOpts,
    deBridgeOpts,
    toToken,
    mayanOpts,
  }: {
    bridgeType: BridgeType[];
    fromChainId: number;
    fromAccount: `0x${string}`;
    toChainId: number;
    sendValue: bigint;
    fromTokenSymbol: string;
    publicClient?: PublicClient;
    endPointId?: IBridgeEndpointId;
    bridgeAddress?: IBridgeAddress;
    isPegged?: boolean;
    slippage?: number;
    mesonOpts?: IGetMesonEstimateFeeInput;
    deBridgeOpts?: IDeBridgeEstimatedFeesInput;
    toToken?: IBridgeToken;
    mayanOpts: IMayanQuotaInput;
  }) {
    // deBridge
    const promiseArr = [];
    if (
      this.deBridge &&
      deBridgeOpts &&
      bridgeType.includes('deBridge') &&
      toToken?.deBridge
    ) {
      const debridgeFeeAPICall = this.deBridge.getEstimatedFees(deBridgeOpts);
      promiseArr.push(debridgeFeeAPICall);
    } else {
      promiseArr.push(new Promise((reject) => reject(null)));
    }
    // cBridge
    if (
      this.cBridge &&
      slippage &&
      bridgeType.includes('cBridge') &&
      toToken?.cBridge
    ) {
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
    // stargate
    if (
      this.stargate &&
      bridgeAddress?.stargate &&
      endPointId?.layerZeroV2 &&
      bridgeType.includes('stargate') &&
      !!publicClient &&
      toToken?.stargate
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
    // layerZero
    if (
      this.layerZero &&
      bridgeAddress?.layerZero &&
      endPointId?.layerZeroV1 &&
      bridgeType.includes('layerZero') &&
      !!publicClient &&
      toToken?.layerZero
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
    // meson
    if (
      this.meson &&
      mesonOpts &&
      bridgeType.includes('meson') &&
      toToken?.meson
    ) {
      const mesonFeeAPICall = this.meson.getEstimatedFees(mesonOpts);
      promiseArr.push(mesonFeeAPICall);
    } else {
      promiseArr.push(new Promise((reject) => reject(null)));
    }
    // mayan
    if (this.mayan && mayanOpts && bridgeType.includes('mayan') && toToken?.mayan) {
      const mayanFeeAPICall = this.mayan.getEstimatedFees(mayanOpts);
      promiseArr.push(mayanFeeAPICall);
    } else {
      promiseArr.push(new Promise((reject) => reject(null)));
    }
    return await Promise.allSettled(promiseArr);
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
    peggedConfig?: ICBridgePeggedPairConfig;
    deBridgeData?: `0x${string}`;
    bridgeEndPointId?: IBridgeEndpointId;
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

    // todo add mayan
  }
}
