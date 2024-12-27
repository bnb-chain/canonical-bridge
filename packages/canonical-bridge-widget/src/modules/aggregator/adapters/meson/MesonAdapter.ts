import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { BaseAdapter, ITransferTokenPair } from '@/modules/aggregator/shared/BaseAdapter';
import { IMesonChain, IMesonToken } from '@/modules/aggregator/adapters/meson/types';
import { isNativeToken } from '@/core/utils/address';
import { TRON_CHAIN_ID } from '@/core/constants';

// const SUPPORTED_CHAIN_IDS = [56, 97, 3448148188, 728126428];
// const SUPPORTED_TOKENS = ['USDT', 'USDC'];

export class MesonAdapter extends BaseAdapter<IMesonChain[], IMesonChain, IMesonToken> {
  public bridgeType: BridgeType = 'meson';

  protected initChains() {
    const chains = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(this.getChainId(chain));
      const isExcludedChain = this.excludedChains.includes(this.getChainId(chain));
      const hasToken = chain.tokens?.length > 0;

      // const isSupported = SUPPORTED_CHAIN_IDS.includes(Number(chain.chainId)); // TODO
      return hasChainConfig && !isExcludedChain && hasToken;
    });

    const chainMap = new Map<number, IMesonChain>();
    filteredChains.forEach((chain) => {
      const chainId = this.getChainId(chain);
      if (!!Number(chainId)) {
        chainMap.set(chainId, chain);
      }
    });

    this.chains = filteredChains;
    this.chainMap = chainMap;
  }

  protected initTokens() {
    const chains = this.config;

    const tokenMap = new Map<number, IMesonToken[]>();
    const symbolMap = new Map<number, Map<string, IMesonToken>>();

    chains.forEach((chain) => {
      const chainId = this.getChainId(chain);

      const filteredTokens = chain.tokens.filter((token, tokenIndex) => {
        const tokenAddress = token.addr ?? '0x0000000000000000000000000000000000000000';

        const isExcludedToken = this.checkIsExcludedToken({
          excludedList: this.excludedTokens?.[chainId],
          tokenSymbol: token?.symbol?.toUpperCase(),
          tokenAddress,
        });

        const anotherTokenIndex = chain.tokens.findIndex(
          (e, eIndex) =>
            e.symbol.toUpperCase() === token.symbol.toUpperCase() && eIndex !== tokenIndex,
        );
        const isDuplicatedToken = anotherTokenIndex > -1 && anotherTokenIndex !== tokenIndex;

        if (isDuplicatedToken) {
          // eslint-disable-next-line no-console
          console.log(`Duplicate Meson token ${token.symbol} symbol in ${chain.name}`);
        }

        // native token transfer requires smart contract deployment. Ignore it for now.
        return !isExcludedToken && !isDuplicatedToken && !isNativeToken(tokenAddress);
      });

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, IMesonToken>());

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
      Map<number, Map<string, ITransferTokenPair<IMesonToken>>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain?.chainId !== toChain?.chainId) {
          const fromChainId = this.getChainId(fromChain);
          const toChainId = this.getChainId(toChain);

          const fromTokens = this.tokenMap.get(fromChainId) ?? [];
          const transferableTokenMap = new Map<string, ITransferTokenPair<IMesonToken>>();

          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId,
              toChainId,
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
            });

            if (toToken) {
              const tokenPair: ITransferTokenPair<IMesonToken> = {
                fromChainId,
                toChainId,
                fromToken,
                toToken,
                fromTokenAddress: fromToken.addr,
                toTokenAddress: toToken.addr,
              };
              transferableTokenMap.set(fromToken.symbol?.toUpperCase(), tokenPair);
            }
          });

          if (transferableTokenMap.size > 0) {
            if (!transferMap.has(fromChainId)) {
              transferMap.set(
                fromChainId,
                new Map<number, Map<string, ITransferTokenPair<IMesonToken>>>(),
              );
            }
            transferMap.get(fromChainId)?.set(toChainId, transferableTokenMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: IMesonChain) {
    return chain.chainId === 'tron' ? TRON_CHAIN_ID : Number(chain.chainId);
  }

  protected getChainIdAsObject(chainId: number) {
    return {
      chainId,
    };
  }

  public getTokenInfo({ chainId, token }: { chainId: number; token: IMesonToken }) {
    return {
      name: token.name?.toUpperCase(), // TODO
      symbol: token.symbol.toUpperCase(),
      address: token.addr ?? '0x0000000000000000000000000000000000000000',
      decimals: token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress: token.addr ?? '0x0000000000000000000000000000000000000000',
        defaultSymbol: token.symbol,
      }),
    };
  }
}
