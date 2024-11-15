import { ERC20_TOKEN } from '@/abi/erc20Token';
import { ITransferTokenPair } from '@/adapters/base/types';
import { CBridgeAdapter } from '@/adapters/cBridge';
import {
  ICBridgePeggedPairConfig,
  ICBridgeToken,
} from '@/adapters/cBridge/types';
import { DeBridgeAdapter } from '@/adapters/deBridge';
import { LayerZeroAdapter } from '@/adapters/layerZero';
import { MesonAdapter } from '@/adapters/meson';
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
} from '@/aggregator/types';
import { sortChains } from '@/aggregator/utils/sortChains';
import { sortTokens } from '@/aggregator/utils/sortTokens';
import { DEFAULT_SLIPPAGE } from '@/constants';
import { isNativeToken } from '@/shared/address';
import { utf8ToHex } from '@/shared/string';
import { Hash, parseUnits, PublicClient, WalletClient } from 'viem';
import {
  VersionedTransaction,
  Connection,
  TransactionSignature,
} from '@solana/web3.js';

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
        chainConfigs: this.options.chains,
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
            // TODO
            // console.warn(
            //   `${bridgeType} adapter is not found, you should initialize the adapter before using it`
            // );
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
   * Load bridge fees and return fee information
   */
  async loadBridgeFees({
    publicClient,
    fromChainId,
    toChainId,
    tokenAddress,
    userAddress,
    toUserAddress,
    sendValue,
    slippage = DEFAULT_SLIPPAGE,
  }: {
    publicClient: PublicClient;
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
    userAddress: string;
    toUserAddress?: string;
    sendValue: string;
    slippage?: number;
  }) {
    const { fromChain, toChain, fromToken, toToken } = this.getParamDetails({
      fromChainId,
      toChainId,
      tokenAddress,
    });

    if (!fromChain || !toChain || !fromToken || !toToken) {
      console.log(fromChain, toChain, fromToken, toToken);
      throw new Error('Missing parameters');
    }

    const amount = parseUnits(sendValue, fromToken.decimals);
    const promiseArr: Array<{ bridgeType: BridgeType; apiCall: Promise<any> }> =
      [];

    // deBridge
    if (
      this.deBridge &&
      fromToken?.deBridge?.address &&
      toToken?.deBridge?.address
    ) {
      const debridgeFeeAPICall = this.deBridge.getEstimatedFees({
        fromChainId,
        toChainId,
        fromTokenAddress: fromToken.deBridge.address as `0x${string}`,
        toTokenAddress: toToken.deBridge.address as `0x${string}`,
        amount,
        userAddress,
        toUserAddress: toUserAddress || userAddress,
      });
      promiseArr.push({
        bridgeType: 'deBridge',
        apiCall: debridgeFeeAPICall,
      });
    } else {
      promiseArr.push({
        bridgeType: 'deBridge',
        apiCall: new Promise((reject) => reject(null)),
      });
    }

    // cBridge
    if (this.cBridge && fromToken.cBridge?.raw?.token.symbol) {
      const fromTokenSymbol = fromToken.cBridge?.raw?.token.symbol;
      const tokenSymbol = fromTokenSymbol === 'ETH' ? 'WETH' : fromTokenSymbol;

      const cBridgeFeeAPICall = this.cBridge.getEstimatedAmount({
        src_chain_id: fromChainId,
        dst_chain_id: toChainId,
        token_symbol: tokenSymbol,
        amt: String(amount),
        user_addr: userAddress,
        slippage_tolerance: slippage,
        is_pegged: fromToken.isPegged,
      });
      promiseArr.push({
        bridgeType: 'cBridge',
        apiCall: cBridgeFeeAPICall,
      });
    } else {
      promiseArr.push({
        bridgeType: 'cBridge',
        apiCall: new Promise((reject) => reject(null)),
      });
    }

    // stargate
    if (
      this.stargate &&
      fromToken?.stargate?.raw?.bridgeAddress &&
      toToken?.stargate?.raw?.endpointID
    ) {
      const stargateFeeAPICall = this.stargate.getQuoteOFT({
        publicClient: publicClient,
        bridgeAddress: fromToken.stargate.raw.bridgeAddress as `0x${string}`,
        endPointId: toToken?.stargate?.raw?.endpointID,
        receiver: userAddress as `0x${string}`,
        amount,
      });
      promiseArr.push({
        bridgeType: 'stargate',
        apiCall: stargateFeeAPICall,
      });
    } else {
      promiseArr.push({
        bridgeType: 'stargate',
        apiCall: new Promise((reject) => reject(null)),
      });
    }

    // layerZero
    if (
      this.layerZero &&
      fromToken?.layerZero?.raw?.bridgeAddress &&
      toToken?.layerZero?.raw?.endpointID
    ) {
      const layerZeroFeeAPICall = this.layerZero.getEstimateFee({
        bridgeAddress: fromToken?.layerZero?.raw
          ?.bridgeAddress as `0x${string}`,
        amount,
        dstEndpoint: toToken?.layerZero?.raw?.endpointID,
        userAddress: userAddress as `0x${string}`,
        publicClient,
      });
      promiseArr.push({
        bridgeType: 'layerZero',
        apiCall: layerZeroFeeAPICall,
      });
    } else {
      promiseArr.push({
        bridgeType: 'layerZero',
        apiCall: new Promise((reject) => reject(null)),
      });
    }

    // meson
    if (this.meson && fromToken?.meson?.raw?.id && toToken?.meson?.raw?.id) {
      const mesonFeeAPICall = this.meson.getEstimatedFees({
        fromToken: `${fromChain?.meson?.raw?.id}:${fromToken?.meson?.raw?.id}`,
        toToken: `${toChain?.meson?.raw?.id}:${toToken?.meson?.raw?.id}`,
        amount: sendValue,
        fromAddr: userAddress,
      });
      promiseArr.push({
        bridgeType: 'meson',
        apiCall: mesonFeeAPICall,
      });
    } else {
      promiseArr.push({
        bridgeType: 'meson',
        apiCall: new Promise((reject) => reject(null)),
      });
    }

    const apiCalls = promiseArr.map((e) => e.apiCall);
    const results = await Promise.allSettled(apiCalls);

    return Object.fromEntries(
      promiseArr.map((e, index) => [e.bridgeType, results[index]])
    ) as Record<BridgeType, PromiseSettledResult<any>>;
  }

  async sendToken({
    bridgeType,
    publicClient,
    walletClient,
    fromChainId,
    toChainId,
    tokenAddress,
    userAddress,
    toUserAddress,
    sendValue,
    slippage = DEFAULT_SLIPPAGE,
    solanaOpts,
    mesonOpts,
  }: {
    bridgeType: BridgeType;
    publicClient: PublicClient;
    walletClient: WalletClient;
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
    userAddress: string;
    toUserAddress?: string;
    sendValue: string;
    slippage?: number;
    solanaOpts?: {
      connection: Connection;
      sendTransaction: (
        transaction: VersionedTransaction,
        connection: Connection
      ) => Promise<TransactionSignature>;
    };
    mesonOpts?: {
      signMessage: (message: string) => Promise<string>;
      signTransaction: (message: string) => Promise<string>;
    };
  }) {
    const { fromChain, toChain, fromToken, toToken } = this.getParamDetails({
      fromChainId,
      toChainId,
      tokenAddress,
    });

    if (!fromChain || !toChain || !fromToken || !toToken) {
      console.log(fromChain, toChain, fromToken, toToken);
      throw new Error('Missing parameters');
    }

    const amount = parseUnits(sendValue, fromToken.decimals);

    if (bridgeType === 'cBridge' && this.cBridge) {
      const { args, bridgeAddress } = this.cBridge.getTransactionParams({
        fromChain,
        toChain,
        fromToken,
        userAddress,
        sendValue,
        slippage,
      });

      const hash = await this.cBridge.sendToken({
        walletClient,
        publicClient,
        bridgeAddress: bridgeAddress as string,
        fromChainId,
        isPegged: fromToken.isPegged,
        isNativeToken: isNativeToken(fromToken.address),
        address: userAddress as `0x${string}`,
        peggedConfig: fromToken.cBridge?.peggedConfig,
        args,
      });

      await publicClient.waitForTransactionReceipt({
        hash,
      });

      return {
        hash,
      };
    }

    if (bridgeType === 'deBridge' && this.deBridge) {
      const txQuote = await this.deBridge.getEstimatedFees({
        fromChainId,
        toChainId,
        fromTokenAddress: fromToken.deBridge?.raw?.address as `0x${string}`,
        toTokenAddress: toToken.deBridge?.raw?.address as `0x${string}`,
        amount,
        userAddress,
        toUserAddress: toUserAddress || userAddress,
      });

      if (fromChain.chainType === 'evm') {
        const hash = await this.deBridge?.sendToken({
          walletClient,
          bridgeAddress: txQuote.tx.to as string,
          data: txQuote.tx.data as `0x${string}`,
          amount: BigInt(txQuote.tx.value),
          address: userAddress as `0x${string}`,
        });

        await publicClient.waitForTransactionReceipt({
          hash,
        });

        return {
          hash,
        };
      }

      if (fromChain?.chainType === 'solana') {
        if (solanaOpts) {
          const { connection, sendTransaction } = solanaOpts;

          const { blockhash } = await connection.getLatestBlockhash();
          const data = (txQuote.tx.data as string)?.slice(2);
          const tx = VersionedTransaction.deserialize(Buffer.from(data, 'hex'));

          tx.message.recentBlockhash = blockhash;
          const hash = await sendTransaction(tx, connection);

          return {
            hash,
          };
        } else {
          throw Error('Parameter [solanaOpts] is required');
        }
      }
    }

    if (bridgeType === 'stargate' && this.stargate) {
      const hash = await this.stargate?.sendToken({
        walletClient,
        publicClient,
        bridgeAddress: fromToken.stargate?.raw?.bridgeAddress as `0x${string}`,
        tokenAddress: fromToken.stargate?.raw?.address as `0x${string}`,
        endPointId: toToken.stargate?.raw?.endpointID as number,
        receiver: userAddress as `0x${string}`,
        amount,
      });

      return {
        hash,
      };
    }

    if (bridgeType === 'layerZero' && this.layerZero) {
      const hash = await this.layerZero?.sendToken({
        walletClient,
        publicClient,
        bridgeAddress: fromToken.layerZero?.raw?.bridgeAddress as `0x${string}`,
        dstEndpoint: toToken.layerZero?.raw?.endpointID as number,
        userAddress: userAddress as `0x${string}`,
        amount,
      });

      return {
        hash,
      };
    }

    if (bridgeType === 'meson' && this.meson) {
      if (mesonOpts) {
        const { signMessage, signTransaction } = mesonOpts;

        let message = '';
        let signature = '';

        // get unsigned message
        const unsignedMessage = await this.meson.getUnsignedMessage({
          fromToken: `${fromChain?.meson?.raw?.id}:${fromToken?.meson?.raw?.id}`,
          toToken: `${toChain?.meson?.raw?.id}:${toToken?.meson?.raw?.id}`,
          amount: sendValue,
          fromAddress: userAddress,
          recipient: toUserAddress || userAddress,
        });

        if (unsignedMessage?.result) {
          const result = unsignedMessage.result;
          const encodedData = result.encoded;
          const signingMessage = result.signingRequest.message;

          if (fromChain?.chainType === 'tron') {
            const hexTronHeader = utf8ToHex('\x19TRON Signed Message:\n32');
            message = signingMessage.replace(hexTronHeader, '');
          } else {
            const hexEthHeader = utf8ToHex('\x19Ethereum Signed Message:\n52');
            message = signingMessage.replace(hexEthHeader, '');
          }

          if (fromChain?.chainType != 'tron') {
            signature = await signMessage(message);
          } else {
            // TODO
            signature = await signTransaction(message);
          }

          const swapId = await this.meson?.sendToken({
            fromAddress: userAddress,
            recipient: toUserAddress || userAddress,
            signature: signature,
            encodedData: encodedData,
          });

          return {
            swapId,
          };
        } else {
          throw new Error(unsignedMessage?.error.message);
        }
      } else {
        throw Error('Parameter [mesonOpts] is required');
      }
    }

    return {};
  }

  public getFromChains() {
    const chainMap = new Map<number, IBridgeChain>();

    this.options.adapters.forEach((adapter) => {
      const fromChains = adapter.getFromChains();

      fromChains.forEach((item: any) => {
        const chainId = adapter.getChainId(item);

        let bridgeChain = chainMap.get(chainId);
        if (!bridgeChain) {
          bridgeChain = {
            isCompatible: true,
            ...adapter.getChainBaseInfo({
              chainId,
            }),
          };
          chainMap.set(chainId, bridgeChain);
        }
      });
    });

    const chains = Array.from(chainMap.values());
    return sortChains({
      direction: 'from',
      chains,
      chainOrder: this.options.chainOrder,
    });
  }

  public getToChains({ fromChainId }: { fromChainId: number }) {
    const chainMap = new Map<number, IBridgeChain>();

    this.options.adapters.forEach((adapter) => {
      const toChains = adapter.getToChains({
        fromChainId,
      });

      toChains.forEach((item: any) => {
        const chainId = adapter.getChainId(item);

        const isCompatible = adapter.isToChainCompatible({
          fromChainId,
          toChainId: chainId,
        });

        let bridgeChain = chainMap.get(chainId);
        if (!bridgeChain) {
          bridgeChain = {
            isCompatible,
            ...adapter.getChainBaseInfo({
              chainId,
            }),
          };
        } else {
          bridgeChain = {
            ...bridgeChain,
            isCompatible: bridgeChain.isCompatible || isCompatible,
          };
        }

        chainMap.set(chainId, bridgeChain);
      });
    });

    const chains = Array.from(chainMap.values());
    return sortChains({
      direction: 'to',
      chains,
      chainOrder: this.options.chainOrder,
    });
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
        const baseInfo = adapter.getTokenBaseInfo({
          chainId: fromChainId,
          token: item.fromToken,
        });

        const isCompatible = adapter.isTokenCompatible({
          fromChainId,
          toChainId,
          tokenAddress: baseInfo.address,
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

    const tokens = Array.from(tokenMap.values());
    return sortTokens({
      tokens,
      tokenOrder: this.options.tokenOrder,
    });
  }

  public getFromChainDetail({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    let chainDetail: IBridgeChain | undefined;

    this.options.adapters.forEach((adapter) => {
      const tokenPair = adapter.getTokenPair({
        fromChainId,
        toChainId,
        tokenAddress,
      });

      if (tokenPair) {
        if (!chainDetail) {
          chainDetail = {
            ...adapter.getChainBaseInfo({ chainId: fromChainId }),
            isCompatible: true,
          };
        }
        chainDetail = {
          ...chainDetail,
          [adapter.bridgeType]: {
            raw: adapter.getChainById(fromChainId),
          },
        };
      }
    });

    return chainDetail;
  }

  public getToChainDetail({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    let chainDetail: IBridgeChain | undefined;

    this.options.adapters.forEach((adapter) => {
      const tokenPair = adapter.getTokenPair({
        fromChainId,
        toChainId,
        tokenAddress,
      });

      if (tokenPair) {
        const isCompatible = adapter.isToChainCompatible({
          fromChainId,
          toChainId,
        });

        if (!chainDetail) {
          chainDetail = {
            ...adapter.getChainBaseInfo({ chainId: toChainId }),
            isCompatible,
          };
        }
        chainDetail = {
          ...chainDetail,
          [adapter.bridgeType]: {
            raw: adapter.getChainById(toChainId),
          },
        };
      }
    });

    return chainDetail;
  }

  public getTokenDetail({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    let tokenDetail: IBridgeToken | undefined;

    this.options.adapters.forEach((adapter) => {
      const tokenPair = adapter.getTokenPair({
        fromChainId,
        toChainId,
        tokenAddress,
      });

      if (tokenPair) {
        const isCompatible = adapter.isTokenCompatible({
          fromChainId,
          toChainId,
          tokenAddress,
        });

        const baseInfo = adapter.getTokenBaseInfo({
          chainId: fromChainId,
          token: tokenPair.fromToken as any,
        });

        if (!tokenDetail) {
          tokenDetail = {
            ...baseInfo,
            isPegged: !!tokenPair.isPegged,
            isCompatible,
          };
        }

        if (adapter.bridgeType === 'cBridge' && tokenPair.peggedConfig) {
          tokenDetail.cBridge = {
            ...baseInfo,
            peggedConfig: tokenPair.peggedConfig as ICBridgePeggedPairConfig,
            raw: tokenPair.fromToken as ICBridgeToken,
          };
        } else {
          tokenDetail = {
            ...tokenDetail,
            [adapter.bridgeType]: {
              ...baseInfo,
              raw: tokenPair.fromToken,
            },
          };
        }
      }
    });

    return tokenDetail;
  }

  public getToTokenDetail({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    let tokenDetail: IBridgeToken | undefined;

    this.options.adapters.forEach((adapter) => {
      const tokenPair = adapter.getTokenPair({
        fromChainId,
        toChainId,
        tokenAddress,
      });

      if (tokenPair) {
        const baseInfo = adapter.getTokenBaseInfo({
          chainId: toChainId,
          token: tokenPair.toToken as any,
        });

        if (!tokenDetail) {
          tokenDetail = {
            ...baseInfo,
            isPegged: !!tokenPair.isPegged,
            isCompatible: true,
          };
        }

        if (adapter.bridgeType === 'cBridge' && tokenPair.peggedConfig) {
          tokenDetail.cBridge = {
            ...baseInfo,
            peggedConfig: tokenPair.peggedConfig as ICBridgePeggedPairConfig,
            raw: tokenPair.toToken as ICBridgeToken,
          };
        } else {
          tokenDetail = {
            ...tokenDetail,
            [adapter.bridgeType]: {
              ...baseInfo,
              raw: tokenPair.toToken,
            },
          };
        }
      }
    });

    return tokenDetail;
  }

  private getParamDetails(params: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    return {
      fromChain: this.getFromChainDetail(params),
      toChain: this.getToChainDetail(params),
      fromToken: this.getTokenDetail(params),
      toToken: this.getToTokenDetail(params),
    };
  }
}
