import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { BaseAdapter, ITransferTokenPair } from '@/modules/aggregator/shared/BaseAdapter';
import { IMesonChain, IMesonToken } from '@/modules/aggregator/adapters/meson/types';
import { isNativeToken } from '@/core/utils/address';
import { NON_EVM_CHAIN_ID_MAP } from '@/core/constants';

// const SUPPORTED_CHAIN_IDS = [56, 97, 3448148188, 728126428];
// const SUPPORTED_TOKENS = ['USDT', 'USDC'];

export class MesonAdapter extends BaseAdapter<IMesonChain[], IMesonChain, IMesonToken> {
  public bridgeType: BridgeType = 'meson';

  protected initChains() {
    const chains = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = this.includedChains.includes(Number(chain.chainId));
      const isExcludedChain = this.excludedChains.includes(Number(chain.chainId));
      const hasToken = chain.tokens?.length > 0;

      // const isSupported = SUPPORTED_CHAIN_IDS.includes(Number(chain.chainId)); // TODO
      return hasChainConfig && !isExcludedChain && hasToken;
    });

    const chainMap = new Map<number, IMesonChain>();
    filteredChains.forEach((chain) => {
      const chainId =
        chain.chainId === 'tron' ? NON_EVM_CHAIN_ID_MAP['tron'] : Number(chain.chainId);
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
      const chainId = chain.chainId === 'tron' ? 728126428 : Number(chain.chainId);

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
          const fromTokens = this.tokenMap.get(Number(fromChain.chainId)) ?? [];
          const transferableTokenMap = new Map<string, ITransferTokenPair<IMesonToken>>();
          fromTokens.forEach((fromToken) => {
            const toToken = this.getToToken({
              fromChainId: Number(fromChain.chainId),
              toChainId: Number(toChain.chainId),
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
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
              transferableTokenMap.set(fromToken.symbol?.toUpperCase(), tokenPair);
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
      name: token.name?.toUpperCase(), // TODO
      symbol: token.symbol.toUpperCase(),
      address: token.addr ?? '0x0000000000000000000000000000000000000000',
      decimals: token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress: token.addr ?? '0x0000000000000000000000000000000000000000',
        defaultSymbol: token.symbol.toUpperCase(),
      }),
    };
  }
}
