import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { BaseAdapter, ITransferTokenPair } from '@/modules/aggregator/shared/BaseAdapter';
import { IMesonChain, IMesonToken } from '@/modules/aggregator/adapters/meson/types';

const SUPPORTED_CHAIN_IDS = [56, 97, 3448148188, 728126428];
const SUPPORTED_TOKENS = ['USDT', 'USDC'];

export class MesonAdapter extends BaseAdapter<IMesonChain[], IMesonChain, IMesonToken> {
  public bridgeType: BridgeType = 'meson';

  protected initChains() {
    const chains = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(Number(chain.chainId));
      const isExcludedChain = this.excludedChains.includes(Number(chain.chainId));
      const hasToken = chain.tokens?.length > 0;

      const isSupported = SUPPORTED_CHAIN_IDS.includes(Number(chain.chainId)); // TODO
      return hasChainConfig && !isExcludedChain && hasToken && isSupported;
    });

    const chainMap = new Map<number, IMesonChain>();
    filteredChains.forEach((chain) => {
      chainMap.set(Number(chain.chainId), chain);
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const chains = this.config;

    const tokenMap = new Map<number, IMesonToken[]>();
    const symbolMap = new Map<number, Map<string, IMesonToken>>();

    chains.forEach((chain) => {
      const chainId = Number(chain.chainId);

      const filteredTokens = chain.tokens.filter((token) => {
        const isExcludedToken = this.checkIsExcludedToken({
          excludedList: this.excludedTokens?.[chainId],
          tokenSymbol: token?.id?.toUpperCase(),
          tokenAddress: token.addr,
        });
        const isSupported = SUPPORTED_TOKENS.includes(token.id?.toUpperCase()); // TODO
        return !isExcludedToken && isSupported;
      });

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, IMesonToken>());

        filteredTokens.forEach((token) => {
          symbolMap.get(chainId)?.set(token.id?.toUpperCase(), token);
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
      Map<number, Map<string, ITransferTokenPair<IMesonToken>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain?.chainId !== toChain?.chainId) {
          const fromTokens = this.tokenMap.get(Number(fromChain.chainId)) ?? [];
          const transferableTokenMap = new Map<string, ITransferTokenPair<IMesonToken>>();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId: Number(fromChain.chainId),
              toChainId: Number(toChain.chainId),
              fromTokenSymbol: fromToken.id?.toUpperCase(),
            });

            if (toToken) {
              const tokenPair: ITransferTokenPair<IMesonToken> = {
                fromChainId: Number(fromChain.chainId),
                toChainId: Number(toChain.chainId),
                fromToken,
                toToken,
                fromTokenAddress: fromToken.addr,
                toTokenAddress: toToken.addr,
              };
              transferableTokenMap.set(fromToken.id?.toUpperCase(), tokenPair);
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(Number(fromChain.chainId))) {
              transferMap.set(
                Number(fromChain.chainId),
                new Map<number, Map<string, ITransferTokenPair<IMesonToken>>>(),
              );
            }
            transferMap
              .get(Number(fromChain.chainId))
              ?.set(Number(toChain.chainId), transferableTokenMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: IMesonChain) {
    return Number(chain.chainId);
  }

  protected getChainIdAsObject(chainId: number) {
    return {
      chainId,
    };
  }

  public getTokenInfo({ chainId, token }: { chainId: number; token: IMesonToken }) {
    return {
      name: (token as any).id, // TODO
      symbol: token.id.toUpperCase(),
      address: token.addr ?? '0x0000000000000000000000000000000000000000',
      decimals: token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress: token.addr ?? '0x0000000000000000000000000000000000000000',
        defaultSymbol: token.id.toUpperCase(),
      }),
    };
  }
}
