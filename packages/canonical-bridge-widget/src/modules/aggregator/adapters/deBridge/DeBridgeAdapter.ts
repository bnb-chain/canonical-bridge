import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import {
  IDeBridgeTransferConfig,
  IDeBridgeChain,
  IDeBridgeToken,
} from '@/modules/aggregator/adapters/deBridge/types';
import { BaseAdapter, ITransferTokenPair } from '@/modules/aggregator/shared/BaseAdapter';
import { isSameAddress } from '@/core/utils/address';

export class DeBridgeAdapter extends BaseAdapter<
  IDeBridgeTransferConfig,
  IDeBridgeChain,
  IDeBridgeToken
> {
  public bridgeType: BridgeType = 'deBridge';

  protected initChains() {
    const { chains, tokens } = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(chain.chainId);
      const isExcludedChain = this.excludedChains.includes(chain.chainId);
      const hasToken = tokens[chain.chainId]?.length > 0;
      return hasChainConfig && !isExcludedChain && hasToken;
    });

    const chainMap = new Map<number, IDeBridgeChain>();
    filteredChains.forEach((chain) => {
      chainMap.set(chain.chainId, chain);
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const { tokens } = this.config;

    const tokenMap = new Map<number, IDeBridgeToken[]>();
    const symbolMap = new Map<number, Map<string, IDeBridgeToken>>();
    Object.entries(tokens).forEach(([id, chainTokens]) => {
      const chainId = Number(id);

      const filteredTokens = chainTokens.filter((token) => {
        const isExcludedToken = this.checkIsExcludedToken({
          excludedList: this.excludedTokens?.[chainId],
          tokenSymbol: token.symbol?.toUpperCase(),
          tokenAddress: token.address,
        });
        return !isExcludedToken;
      });

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, IDeBridgeToken>());

        filteredTokens.forEach((token) => {
          symbolMap.get(chainId)?.set(token.symbol?.toUpperCase(), token);
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
      Map<number, Map<string, ITransferTokenPair<IDeBridgeToken>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain.chainId !== toChain.chainId) {
          const fromTokens = this.tokenMap.get(fromChain.chainId) ?? [];

          const transferableTokenMap = new Map<string, ITransferTokenPair<IDeBridgeToken>>();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId: fromChain.chainId,
              toChainId: toChain.chainId,
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
            });

            if (toToken) {
              const tokenPair: ITransferTokenPair<IDeBridgeToken> = {
                fromChainId: fromChain.chainId,
                toChainId: toChain.chainId,
                fromTokenAddress: fromToken.address,
                toTokenAddress: toToken.address,
                fromToken,
                toToken,
              };
              transferableTokenMap.set(fromToken.symbol?.toUpperCase(), tokenPair);
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(fromChain.chainId)) {
              transferMap.set(
                fromChain.chainId,
                new Map<number, Map<string, ITransferTokenPair<IDeBridgeToken>>>(),
              );
            }
            transferMap.get(fromChain.chainId)?.set(toChain.chainId, transferableTokenMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: IDeBridgeChain) {
    return chain.chainId;
  }

  protected getChainIdAsObject(chainId: number) {
    return {
      chainId,
    };
  }

  public getTokenInfo(token: IDeBridgeToken) {
    return {
      name: token.name,
      symbol: token.symbol,
      address: token.address,
      decimals: token.decimals,
    };
  }

  public getTokenByAddress({ chainId, address }: { chainId: number; address: string }) {
    if (chainId && address) {
      const tokens = this.tokenMap.get(Number(chainId));
      const target = tokens?.find((item) => isSameAddress(item.address, address));
      return target;
    }
  }
}
