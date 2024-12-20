import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import {
  ICBridgeBurnPairConfig,
  ICBridgeChain,
  ICBridgePeggedPairConfig,
  ICBridgeToken,
  ICBridgeTransferConfig,
} from '@/modules/aggregator/adapters/cBridge/types';
import { BaseAdapter, ITransferTokenPair } from '@/modules/aggregator/shared/BaseAdapter';

export class CBridgeAdapter extends BaseAdapter<
  ICBridgeTransferConfig,
  ICBridgeChain,
  ICBridgeToken
> {
  public bridgeType: BridgeType = 'cBridge';

  private peggedPairConfigs: ICBridgePeggedPairConfig[] = [];
  private burnPairConfigs: ICBridgeBurnPairConfig[] = [];

  protected init() {
    this.initChains();
    this.initTokens();

    this.initPeggedPairConfigs();
    this.initBurnPairConfigs();

    this.initTransferMap();
    this.filterTransferMap();

    this.initFromChains();
    this.initToChains();
  }

  protected initChains() {
    const { chains, chain_token, pegged_pair_configs } = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(chain.id);
      const isExcludedChain = this.excludedChains.includes(chain.id);
      const hasEnabledToken = chain_token[chain.id]?.token?.some((e) => !e.token.xfer_disabled);
      const hasPeggedToken = pegged_pair_configs.some(
        (e) =>
          (e.org_chain_id === chain.id || e.pegged_chain_id === chain.id) &&
          !e.org_token.token.xfer_disabled &&
          !e.pegged_token.token.xfer_disabled,
      );
      return hasChainConfig && !isExcludedChain && (hasEnabledToken || hasPeggedToken);
    });

    const chainMap = new Map<number, ICBridgeChain>();
    filteredChains.forEach((chain) => {
      chainMap.set(chain.id, chain);
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const { chain_token } = this.config;

    const tokenMap = new Map<number, ICBridgeToken[]>();
    const symbolMap = new Map<number, Map<string, ICBridgeToken>>();
    Object.entries(chain_token).forEach(([id, { token: chainTokens }]) => {
      const chainId = Number(id);

      const filteredTokens = chainTokens.filter((token) => {
        const isEnabledToken = !token.token.xfer_disabled;
        const isExcludedToken = this.checkIsExcludedToken({
          excludedList: this.excludedTokens?.[chainId],
          tokenSymbol: token.token.symbol?.toUpperCase(),
          tokenAddress: token.token.address,
        });
        return isEnabledToken && !isExcludedToken;
      });

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

  private checkIsBlocked({
    fromChainId,
    toChainId,
    tokenSymbol,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenSymbol: string;
  }) {
    const blockedList = this.config.blocked_bridge_direct ?? [];
    const isBlocked = blockedList.find((e) => {
      return (
        Number(e.src_chain_id) === fromChainId &&
        Number(e.dst_chain_id) === toChainId &&
        e.symbol.toUpperCase() === tokenSymbol.toUpperCase()
      );
    });
    return isBlocked;
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

          const transferableTokenMap = new Map<string, ITransferTokenPair<ICBridgeToken>>();
          fromTokens.forEach((fromToken) => {
            const fromTokenSymbol = fromToken.token.symbol?.toUpperCase();
            const isBlocked = this.checkIsBlocked({
              fromChainId: fromChain.id,
              toChainId: toChain.id,
              tokenSymbol: fromTokenSymbol,
            });
            if (isBlocked) {
              return;
            }

            const toToken = this.getToToken({
              fromChainId: fromChain.id,
              toChainId: toChain.id,
              fromTokenSymbol,
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
              transferableTokenMap.set(fromTokenSymbol, tokenPair);
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(fromChain.id)) {
              transferMap.set(
                fromChain.id,
                new Map<number, Map<string, ITransferTokenPair<ICBridgeToken>>>(),
              );
            }
            transferMap.get(fromChain.id)?.set(toChain.id, transferableTokenMap);
          }
        }
      });
    });

    const addPeggedTokenPair = (
      fromChainId: number,
      fromToken: ICBridgeToken,
      toChainId: number,
      toToken: ICBridgeToken,
      item: ICBridgePeggedPairConfig,
    ) => {
      const isBlocked = this.checkIsBlocked({
        fromChainId,
        toChainId,
        tokenSymbol: fromToken.token.symbol,
      });
      if (isBlocked) {
        return;
      }

      if (
        !transferMap.get(fromChainId)?.get(toChainId)?.get(fromToken.token.symbol?.toUpperCase())
      ) {
        if (!transferMap.has(fromChainId)) {
          transferMap.set(
            fromChainId,
            new Map<number, Map<string, ITransferTokenPair<ICBridgeToken>>>(),
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
          const transferableTokenMap = new Map<string, ITransferTokenPair<ICBridgeToken>>();
          transferableTokenMap.set(fromToken.token.symbol?.toUpperCase(), peggedTokenPair);
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
        isAvailablePair(item.pegged_chain_id, item.pegged_token),
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

  protected getChainIdAsObject(chainId: number) {
    return {
      id: chainId,
    };
  }

  public getTokenInfo({ chainId, token }: { chainId: number; token: ICBridgeToken }) {
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
