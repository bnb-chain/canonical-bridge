import { ERC20_TOKEN } from '@/abi/erc20Token';
import { ITransferTokenPair } from '@/adapters/base/types';
import { CBridgeAdapter } from '@/adapters/cBridge';
import { ICBridgePeggedPairConfig } from '@/adapters/cBridge/types';
import { DeBridgeAdapter } from '@/adapters/deBridge';
import { IDeBridgeEstimatedFeesInput } from '@/adapters/deBridge/types';
import { LayerZeroAdapter } from '@/adapters/layerZero';
import { MesonAdapter } from '@/adapters/meson';
import { IGetMesonEstimateFeeInput } from '@/adapters/meson/types';
import { StargateAdapter } from '@/adapters/stargate';
import {
  IBridgeChain,
  BridgeType,
  IChainConfig,
  IExternalChain,
  INativeCurrency,
  IBridgeToken,
  IApproveTokenInput,
  IGetAllowanceInput,
  IGetTokenBalanceInput,
  IBridgeEndpointId,
  IBridgeAddress,
} from '@/aggregator/types';
import { Hash, PublicClient, WalletClient } from 'viem';

export interface CanonicalBridgeSDKOptions {
  chains: IChainConfig[];
  assetPrefix?: string;
  brandChains?: number[];
  externalChains?: IExternalChain[];
  displayTokenSymbols?: Record<number, Record<string, string>>;
  chainOrder?: number[];
  tokenOrder?: string[];
  adapters: Array<
    | CBridgeAdapter
    | DeBridgeAdapter
    | LayerZeroAdapter
    | StargateAdapter
    | MesonAdapter
  >;
}

export class CanonicalBridgeSDK {
  public cBridge?: CBridgeAdapter;
  public deBridge?: DeBridgeAdapter;
  public layerZero?: LayerZeroAdapter;
  public stargate?: StargateAdapter;
  public meson?: MesonAdapter;

  private supportedBridges: BridgeType[] = [
    'cBridge',
    'deBridge',
    'layerZero',
    'meson',
    'stargate',
  ];

  private options: CanonicalBridgeSDKOptions = {} as CanonicalBridgeSDKOptions;

  constructor(options?: CanonicalBridgeSDKOptions) {
    this.setSDKOptions(options);
  }

  public setSDKOptions(options?: CanonicalBridgeSDKOptions) {
    const { chains, ...restOptions } = options ?? {};

    const finalChains =
      options?.chains.map((item) => ({
        ...item,
        chainType: item.chainType ? item.chainType : 'evm',
      })) ?? [];

    this.options = {
      chains: finalChains,
      assetPrefix: '',
      brandChains: [],
      externalChains: [],
      displayTokenSymbols: {},
      adapters: [],
      chainOrder: [],
      tokenOrder: [],
      ...restOptions,
    };

    this.options.adapters.forEach((adapter) => {
      adapter.init({
        nativeCurrencies: this.getNativeCurrencies(),
        includedChains: this.options.chains.map((item) => item.id),
        brandChains: this.options.brandChains,
        externalChains: this.options.externalChains,
        displayTokenSymbols: this.options.displayTokenSymbols,
        assetPrefix: this.options.assetPrefix,
      });
    });

    this.supportedBridges.forEach((bridgeType) => {
      Object.defineProperty(this, bridgeType, {
        get: () => {
          const adapter = this.options.adapters.find(
            (e) => e.bridgeType === bridgeType
          );
          if (adapter) {
            return adapter;
          } else {
            console.warn(
              `${bridgeType} adapter is not found, you should initialize an adapter before using`
            );
          }
        },
      });
    });
  }

  public getSDKOptions() {
    return this.options;
  }

  public getNativeCurrencies() {
    const nativeCurrencies: Record<string, INativeCurrency> = {};

    this.options.chains.forEach((chain) => {
      if (chain.id && chain.nativeCurrency) {
        nativeCurrencies[chain.id] = chain.nativeCurrency;
      }
    });

    return nativeCurrencies;
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
   * [deBridge, cBridge, stargate, layerZero, meson]
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
  }) {
    // deBridge
    const promiseArr = [];
    if (this.deBridge && deBridgeOpts && bridgeType.includes('deBridge')) {
      const debridgeFeeAPICall = this.deBridge.getEstimatedFees(deBridgeOpts);
      promiseArr.push(debridgeFeeAPICall);
    } else {
      promiseArr.push(new Promise((reject) => reject(null)));
    }
    // cBridge
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
    // stargate
    if (
      this.stargate &&
      bridgeAddress?.stargate &&
      endPointId?.layerZeroV2 &&
      bridgeType.includes('stargate') &&
      !!publicClient
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
      !!publicClient
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
    if (this.meson && mesonOpts && bridgeType.includes('meson')) {
      const mesonFeeAPICall = this.meson.getEstimatedFees(mesonOpts);
      promiseArr.push(mesonFeeAPICall);
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
  }

  public getFromChains() {
    const chainMap = new Map<number, IBridgeChain>();

    this.options.adapters.forEach((adapter) => {
      const fromChains = adapter.getFromChains();

      fromChains.forEach((item: any) => {
        const chainId = adapter.getChainId(item);
        const chainConfig = this.options.chains.find((e) => e.id === chainId);

        if (chainConfig) {
          let bridgeChain = chainMap.get(chainId);
          if (!bridgeChain) {
            bridgeChain = {
              isCompatible: true,
              ...adapter.getChainInfo({
                chainId,
                chainConfig,
              }),
            };
            chainMap.set(chainId, bridgeChain);
          }
        }
      });
    });

    return Array.from(chainMap.values());
  }

  public getToChains({ fromChainId }: { fromChainId: number }) {
    const chainMap = new Map<number, IBridgeChain>();

    this.options.adapters.forEach((adapter) => {
      const toChains = adapter.getToChains({
        fromChainId,
      });

      toChains.forEach((item: any) => {
        const chainId = adapter.getChainId(item);
        const chainConfig = this.options.chains.find((e) => e.id === chainId);

        if (chainConfig) {
          const isCompatible = adapter.isToChainCompatible({
            fromChainId,
            toChainId: chainId,
          });

          let bridgeChain = chainMap.get(chainId);
          if (!bridgeChain) {
            bridgeChain = {
              isCompatible,
              ...adapter.getChainInfo({
                chainId,
                chainConfig,
              }),
            };
          } else {
            bridgeChain = {
              ...bridgeChain,
              isCompatible: bridgeChain.isCompatible || isCompatible,
            };
          }

          chainMap.set(chainId, bridgeChain);
        }
      });
    });

    return Array.from(chainMap.values());
  }

  public getTokens({
    fromChainId,
    toChainId,
  }: {
    fromChainId: number;
    toChainId: number;
  }) {
    const tokenMap = new Map<string, IBridgeToken>();

    this.options.adapters.forEach((adapter) => {
      const tokenPairs = adapter.getTokenPairs({
        fromChainId,
        toChainId,
      });

      tokenPairs.forEach((item: ITransferTokenPair<any>) => {
        const { fromToken, fromChainId, toChainId } = item;

        const baseInfo = adapter.getTokenInfo({
          chainId: fromChainId,
          token: fromToken,
        });

        const isCompatible = adapter.isTokenCompatible({
          fromChainId,
          toChainId,
          tokenSymbol: baseInfo.displaySymbol,
        });

        let bridgeToken = tokenMap.get(baseInfo.displaySymbol.toUpperCase());

        if (!bridgeToken) {
          bridgeToken = {
            ...baseInfo,
            isPegged: !!item.isPegged,
            isCompatible,
          };
        } else {
          bridgeToken = {
            ...bridgeToken,
            isCompatible: bridgeToken.isCompatible || isCompatible,
          };
        }
        tokenMap.set(baseInfo.displaySymbol.toUpperCase(), bridgeToken);
      });
    });

    return Array.from(tokenMap.values());
  }

  public getChainDetail() {}

  public getTokenDetail() {}
}
