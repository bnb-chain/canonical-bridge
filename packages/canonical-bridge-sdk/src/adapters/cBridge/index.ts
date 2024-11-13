import { getContract, Hash, isAddress } from 'viem';
import { BaseAdapter } from '@/adapters/base';
import { IInitialOptions, ITransferTokenPair } from '@/adapters/base/types';
import {
  ICBridgeAdapterOptions,
  ICBridgeBurnPairConfig,
  ICBridgeChain,
  ICBridgeEstimateAmountRequest,
  ICBridgeEstimateAmountResponse,
  ICBridgePeggedPairConfig,
  ICBridgeSendRangeInput,
  ICBridgeToken,
  ICBridgeTransferConfig,
  ICBridgeTransferEstimatedTime,
  IGetCBridgeABI,
  IGetCBridgeTransferAddressInput,
  IGetCBridgeTransferFunction,
  IGetCBridgeTransferParamsInput,
  ISendCBridgeToken,
} from '@/adapters/cBridge/types';
import { BridgeType } from '@/aggregator/types';
import axios, { AxiosInstance } from 'axios';
import { CLIENT_TIME_OUT, env } from '@/constants';
import {
  POOL_TRANSFER_BRIDGE,
  ORIGINAL_TOKEN_VAULT,
  ORIGINAL_TOKEN_VAULT_V2,
  PEGGED_TOKEN_BRIDGE,
  PEGGED_TOKEN_BRIDGE_V2,
} from '@/adapters/cBridge/exports';

export class CBridgeAdapter extends BaseAdapter<
  ICBridgeTransferConfig,
  ICBridgeChain,
  ICBridgeToken
> {
  private client: AxiosInstance;
  public bridgeType: BridgeType = 'cBridge';

  private peggedPairConfigs: ICBridgePeggedPairConfig[] = [];
  private burnPairConfigs: ICBridgeBurnPairConfig[] = [];

  constructor(options: ICBridgeAdapterOptions) {
    const {
      timeout = CLIENT_TIME_OUT,
      endpoint = env.CBRIDGE_ENDPOINT,
      ...baseOptions
    } = options;

    super(baseOptions);

    this.client = axios.create({
      timeout,
      baseURL: endpoint,
    });
  }

  // https://cbridge-docs.celer.network/developer/api-reference/gateway-estimateamt
  async getEstimatedAmount(params: ICBridgeEstimateAmountRequest) {
    return (
      await this.client.get<ICBridgeEstimateAmountResponse>(`v2/estimateAmt`, {
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
      await this.client.get<ICBridgeTransferEstimatedTime>(
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
  }: ICBridgeSendRangeInput): Promise<{ min: bigint; max: bigint }> {
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
    isNativeToken,
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
        isNativeToken,
        transferType,
      });
      let cBridgeArgs = null;
      if (isNativeToken) {
        cBridgeArgs = {
          address: bridgeAddress,
          abi: ABI,
          functionName,
          account: address,
          args,
          value: args[1],
        };
      } else {
        cBridgeArgs = {
          address: bridgeAddress,
          abi: ABI,
          functionName,
          account: address,
          args,
        };
      }
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
    isNativeToken = false,
    toChainId,
    tokenAddress,
    address,
    maxSlippage,
    transferType,
    peggedConfig,
    nonce,
  }: IGetCBridgeTransferParamsInput) {
    return isPegged === false
      ? isNativeToken
        ? [address, amount, toChainId, nonce, maxSlippage]
        : [address, tokenAddress, amount, toChainId, nonce, maxSlippage]
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
  getTransferFunction({
    isPegged,
    transferType,
    isNativeToken = false,
  }: IGetCBridgeTransferFunction) {
    return isPegged === false
      ? isNativeToken
        ? 'sendNative'
        : 'send'
      : transferType === 'deposit'
      ? 'deposit'
      : transferType === 'withdraw'
      ? 'burn'
      : '';
  }

  /**
   * Get transfer type
   */
  getTransferType({
    peggedConfig,
    fromChainId,
  }: {
    fromChainId: number;
    peggedConfig?: ICBridgePeggedPairConfig;
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
    isNativeToken = false,
  }: {
    isPegged: boolean;
    peggedConfig?: ICBridgePeggedPairConfig;
    chainConfig?: ICBridgeChain;
    amount: bigint;
    fromChainId: number;
    toChainId: number;
    tokenAddress: `0x${string}`;
    userAddress: `0x${string}`;
    maxSlippage: number;
    nonce: number;
    isNativeToken?: boolean;
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
      isNativeToken,
    });
    return {
      address: bridgeAddress as `0x${string}`,
      abi: bridgeABI,
      functionName: functionName,
      account: userAddress as `0x${string}`,
      args: args,
    };
  }

  public init(initialOptions?: IInitialOptions) {
    this.initOptions(initialOptions);

    this.initChains();
    this.initTokens();

    this.initPeggedPairConfigs();
    this.initBurnPairConfigs();

    this.initTransferMap();
    this.filterTransferMap();
  }

  protected initChains() {
    const { chains, chain_token, pegged_pair_configs } = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(chain.id);
      const isExcludedChain = this.excludedChains.includes(chain.id);
      const hasEnabledToken = chain_token[chain.id]?.token?.some(
        (e) => !e.token.xfer_disabled
      );
      const hasPeggedToken = pegged_pair_configs.some(
        (e) =>
          (e.org_chain_id === chain.id || e.pegged_chain_id === chain.id) &&
          !e.org_token.token.xfer_disabled &&
          !e.pegged_token.token.xfer_disabled
      );
      return (
        hasChainConfig &&
        !isExcludedChain &&
        (hasEnabledToken || hasPeggedToken)
      );
    });

    const chainMap = new Map<number, ICBridgeChain>();
    filteredChains.forEach((chain) => {
      chainMap.set(chain.id, chain);
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const { chain_token, chains } = this.config;

    const tokenMap = new Map<number, ICBridgeToken[]>();
    const symbolMap = new Map<number, Map<string, ICBridgeToken>>();
    Object.entries(chain_token).forEach(([id, { token: chainTokens }]) => {
      const chainId = Number(id);
      const nativeChain = chains.find(
        (chain) => Number(chain.id) === Number(id)
      );

      const filteredTokens = chainTokens.filter((token) => {
        const isEnabledToken = !token.token.xfer_disabled;
        const isExcludedToken = this.checkIsExcludedToken({
          excludedList: this.excludedTokens?.[chainId],
          tokenSymbol: token.token.symbol?.toUpperCase(),
          tokenAddress: token.token.address,
        });
        return isEnabledToken && !isExcludedToken;
      });

      // Add native token info.
      if (nativeChain) {
        const weth_token = chainTokens.find(
          (token) => token.token.symbol === 'WETH'
        );
        const nativeTokenObj = {
          token: {
            symbol: nativeChain?.gas_token_symbol ?? '',
            address: '0x0000000000000000000000000000000000000000',
            decimal: 18,
            xfer_disabled: false,
          },
          weth_address: weth_token?.token.address,
          name: nativeChain?.gas_token_symbol,
          icon: nativeChain?.icon,
          inbound_lmt: '',
          inbound_epoch_cap: '',
          transfer_disabled: false,
          liq_add_disabled: false,
          liq_rm_disabled: false,
          liq_agg_rm_src_disabled: false,
          delay_threshold: '',
          delay_period: 0,
        };
        // The address of WETH (weth_address) is required for retrieving native token min/ max send amount
        // https://cbridge-docs.celer.network/developer/cbridge-limit-parameters#id-1.-minsend-maxsend
        if (
          nativeChain?.gas_token_symbol === 'ETH' &&
          isAddress(weth_token?.token?.address ?? '')
        ) {
          nativeTokenObj.weth_address = weth_token?.token.address;
        }
        filteredTokens.push(nativeTokenObj);
      }

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, ICBridgeToken>());

        filteredTokens.forEach((token) => {
          symbolMap.get(chainId)?.set(token.token.symbol?.toUpperCase(), token);
        });

        tokenMap.set(chainId, filteredTokens);
      }
    });

    this.tokenMap = tokenMap;
    this.symbolMap = symbolMap;
  }

  protected initTransferMap() {
    const transferMap = new Map<
      number,
      Map<number, Map<string, ITransferTokenPair<ICBridgeToken>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain.id !== toChain.id) {
          const fromTokens = this.tokenMap.get(fromChain.id) ?? [];

          const transferableTokenMap = new Map<
            string,
            ITransferTokenPair<ICBridgeToken>
          >();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId: fromChain.id,
              toChainId: toChain.id,
              fromTokenSymbol: fromToken.token.symbol?.toUpperCase(),
            });
            if (toToken) {
              const tokenPair: ITransferTokenPair<ICBridgeToken> = {
                fromChainId: fromChain.id,
                toChainId: toChain.id,
                fromTokenAddress: fromToken.token.address,
                toTokenAddress: toToken.token.address,
                fromToken,
                toToken,
              };
              transferableTokenMap.set(
                fromToken.token.symbol?.toUpperCase(),
                tokenPair
              );
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(fromChain.id)) {
              transferMap.set(
                fromChain.id,
                new Map<
                  number,
                  Map<string, ITransferTokenPair<ICBridgeToken>>
                >()
              );
            }
            transferMap
              .get(fromChain.id)
              ?.set(toChain.id, transferableTokenMap);
          }
        }
      });
    });

    const addPeggedTokenPair = (
      fromChainId: number,
      fromToken: ICBridgeToken,
      toChainId: number,
      toToken: ICBridgeToken,
      item: ICBridgePeggedPairConfig
    ) => {
      if (
        !transferMap
          .get(fromChainId)
          ?.get(toChainId)
          ?.get(fromToken.token.symbol?.toUpperCase())
      ) {
        if (!transferMap.has(fromChainId)) {
          transferMap.set(
            fromChainId,
            new Map<number, Map<string, ITransferTokenPair<ICBridgeToken>>>()
          );
        }

        const peggedTokenPair: ITransferTokenPair<ICBridgeToken> = {
          fromChainId,
          toChainId,
          fromTokenAddress: fromToken.token.address,
          toTokenAddress: toToken.token.address,
          fromToken,
          toToken,
          isPegged: true,
          peggedConfig: item,
        };

        if (transferMap.get(fromChainId)?.get(toChainId)) {
          transferMap
            .get(fromChainId)
            ?.get(toChainId)
            ?.set(fromToken.token.symbol?.toUpperCase(), peggedTokenPair);
        } else {
          const transferableTokenMap = new Map<
            string,
            ITransferTokenPair<ICBridgeToken>
          >();
          transferableTokenMap.set(
            fromToken.token.symbol?.toUpperCase(),
            peggedTokenPair
          );
          transferMap.get(fromChainId)?.set(toChainId, transferableTokenMap);
        }
      }
    };

    this.peggedPairConfigs.forEach((item) => {
      const fromChainId = item.org_chain_id;
      const fromToken = item.org_token;

      const toChainId = item.pegged_chain_id;
      const toToken = item.pegged_token;

      addPeggedTokenPair(fromChainId, fromToken, toChainId, toToken, item);
      addPeggedTokenPair(toChainId, toToken, fromChainId, fromToken, item);
    });

    this.transferMap = transferMap;
  }

  private initPeggedPairConfigs() {
    const peggedPairConfigs = this.config.pegged_pair_configs;

    const isAvailablePair = (chainId: number, token: ICBridgeToken) => {
      const hasChain = this.chainMap.has(chainId);
      const isEnabledToken = !token.token.xfer_disabled;

      const isExcludedToken = this.checkIsExcludedToken({
        excludedList: this.excludedTokens?.[chainId],
        tokenSymbol: token.token.symbol,
        tokenAddress: token.token.address,
      });

      return hasChain && isEnabledToken && !isExcludedToken;
    };

    const filteredPeggedPairConfigs = peggedPairConfigs.filter(
      (item) =>
        isAvailablePair(item.org_chain_id, item.org_token) &&
        isAvailablePair(item.pegged_chain_id, item.pegged_token)
    );

    this.peggedPairConfigs = filteredPeggedPairConfigs;
  }

  private initBurnPairConfigs() {
    const burnPairConfigs: ICBridgeBurnPairConfig[] = [];

    for (let i = 0; i < this.peggedPairConfigs.length; i++) {
      for (let j = i + 1; j < this.peggedPairConfigs.length; j++) {
        const A = this.peggedPairConfigs[i];
        const B = this.peggedPairConfigs[j];
        if (
          A.org_chain_id === B.org_chain_id &&
          A.org_token.token.symbol === B.org_token.token.symbol
        ) {
          /// Only upgraded PegBridge can support multi burn to other pegged chain
          if (A.bridge_version === 2 && B.bridge_version === 2) {
            burnPairConfigs.push({
              burn_config_as_org: {
                chain_id: A.pegged_chain_id,
                token: A.pegged_token,
                burn_contract_addr: A.pegged_burn_contract_addr,
                canonical_token_contract_addr: A.canonical_token_contract_addr,
                burn_contract_version: A.bridge_version,
              },
              burn_config_as_dst: {
                chain_id: B.pegged_chain_id,
                token: B.pegged_token,
                burn_contract_addr: B.pegged_burn_contract_addr,
                canonical_token_contract_addr: B.canonical_token_contract_addr,
                burn_contract_version: B.bridge_version,
              },
            });
            burnPairConfigs.push({
              burn_config_as_org: {
                chain_id: B.pegged_chain_id,
                token: B.pegged_token,
                burn_contract_addr: B.pegged_burn_contract_addr,
                canonical_token_contract_addr: B.canonical_token_contract_addr,
                burn_contract_version: B.bridge_version,
              },
              burn_config_as_dst: {
                chain_id: A.pegged_chain_id,
                token: A.pegged_token,
                burn_contract_addr: A.pegged_burn_contract_addr,
                canonical_token_contract_addr: A.canonical_token_contract_addr,
                burn_contract_version: A.bridge_version,
              },
            });
          }
        }
      }
    }

    this.burnPairConfigs = burnPairConfigs;
  }

  public getChainId(chain: ICBridgeChain) {
    return chain.id;
  }

  public getTokenInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: ICBridgeToken;
  }) {
    return {
      name: token.name,
      symbol: token.token.symbol,
      address: token.token.address,
      decimals: token.token.decimal,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress: token.token.address,
        defaultSymbol: token.token.symbol,
      }),
    };
  }

  public getPeggedPairConfigs() {
    return this.burnPairConfigs;
  }

  public getBurnPairConfigs() {
    return this.peggedPairConfigs;
  }
}
