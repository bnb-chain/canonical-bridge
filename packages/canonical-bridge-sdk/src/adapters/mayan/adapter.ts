import { BaseAdapter } from '@/adapters/base';
import { IMayanChain, IMayanToken, IMayanTransferConfig } from '@/adapters/mayan/types';
import { BridgeType, IBridgeTokenBaseInfo } from '@/shared/types';
import { SOLANA_CHAIN_ID, SOLANA_NATIVE_TOKEN_ADDRESS } from '@/constants';
import { ITokenPair } from '@/adapters/base/types';

const SOLANA_ID = 'solana';

export class MayanAdapter extends BaseAdapter<IMayanTransferConfig, IMayanChain, IMayanToken> {
  public readonly id: BridgeType = 'mayan';
  protected bridgedTokenGroups: never[] = [];

  public init(): this {
    this.initChains();
    this.initTokens();
    this.initTransferMap();
    this.filterTransferMap();
    return this;
  }

  protected initChains(): void {
    const { chains, tokens } = this.config;

    const filteredChains = chains.filter(chain =>
      this.isValidChain(chain, tokens),
    );

    this.chains = filteredChains;
    this.chainMap = new Map(
      filteredChains.map(chain => [this.getChainId(chain), chain]),
    );
  }

  private isValidChain(chain: IMayanChain, tokens: Record<string, IMayanToken[]>): boolean {
    const chainId = this.getChainId(chain);
    return (
      this.chainConfigs.some(config => config.id === chainId) &&
      !this.excludedChains.includes(chainId) &&
      tokens[chain.nameId]?.length > 0
    );
  }

  protected initTokens(): void {
    const { chains, tokens } = this.config;

    const tokenMap = new Map<number, IMayanToken[]>();
    const symbolMap = new Map<number, Map<string, IMayanToken[]>>();
    const nameChainIdMap = this.createNameChainIdMap(chains);

    Object.entries(tokens).forEach(([nameId, chainTokens]) => {
      const chainId = nameChainIdMap[nameId];
      if (!this.chainMap.has(chainId)) return;

      const filteredTokens = chainTokens.filter(token =>
        !this.isExcludedToken({
          chainId,
          tokenSymbol: token.symbol?.toUpperCase(),
          tokenAddress: this.getTokenAddress(token),
        }),
      );

      if (filteredTokens.length > 0) {
        this.populateTokenMaps(chainId, filteredTokens, tokenMap, symbolMap);
      }
    });

    this.tokenMap = tokenMap;
    this.symbolMap = symbolMap;
  }

  private createNameChainIdMap(chains: IMayanChain[]): Record<string, number> {
    return chains.reduce((map, chain) => ({
      ...map,
      [chain.nameId]: this.getChainId(chain),
    }), {});
  }

  private populateTokenMaps(
    chainId: number,
    tokens: IMayanToken[],
    tokenMap: Map<number, IMayanToken[]>,
    symbolMap: Map<number, Map<string, IMayanToken[]>>,
  ): void {
    tokenMap.set(chainId, tokens);
    const chainSymbolMap = new Map<string, IMayanToken[]>();

    tokens.forEach(token => {
      const symbol = token.symbol?.toUpperCase();
      if (symbol) {
        const symbolTokens = chainSymbolMap.get(symbol) || [];
        symbolTokens.push(token);
        chainSymbolMap.set(symbol, symbolTokens);
      }
    });

    symbolMap.set(chainId, chainSymbolMap);
  }

  public getChainId(chain: IMayanChain): number {
    return chain.nameId === SOLANA_ID ? SOLANA_CHAIN_ID : chain.chainId;
  }

  public getTokenAddress(token: IMayanToken): string {
    return token.coingeckoId === SOLANA_ID
      ? SOLANA_NATIVE_TOKEN_ADDRESS
      : token.contract;
  }

  public getTokenBaseInfo({ chainId, token }: { chainId: number; token: IMayanToken }): IBridgeTokenBaseInfo {
    const tokenAddress = this.getTokenAddress(token);
    return {
      name: token.name,
      symbol: token.symbol,
      address: tokenAddress,
      decimals: token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress,
        defaultSymbol: token.symbol,
        icon: token.logoURI,
      }),
    };
  }

  protected initTransferMap(): void {
    const transferMap = new Map<number, Map<number, Map<string, ITokenPair<IMayanToken>[]>>>();

    for (const fromChain of this.chains) {
      for (const toChain of this.chains) {
        if (fromChain.chainId === toChain.chainId) continue;

        const fromChainId = this.getChainId(fromChain);
        const toChainId = this.getChainId(toChain);
        const tokenPairsMap = this.createTokenPairsMap(fromChainId, toChainId);

        if (tokenPairsMap.size > 0) {
          if (!transferMap.has(fromChainId)) {
            transferMap.set(fromChainId, new Map());
          }
          transferMap.get(fromChainId)!.set(toChainId, tokenPairsMap);
        }
      }
    }

    this.transferMap = transferMap;
  }

  private createTokenPairsMap(
    fromChainId: number,
    toChainId: number,
  ): Map<string, ITokenPair<IMayanToken>[]> {
    const tokenPairsMap = new Map<string, ITokenPair<IMayanToken>[]>();
    const fromTokens = this.tokenMap.get(fromChainId) ?? [];

    for (const fromToken of fromTokens) {
      const toTokens = this.getToTokensForPair({
        fromChainId,
        toChainId,
        fromTokenSymbol: fromToken.symbol?.toUpperCase(),
      });

      if (toTokens?.length) {
        const tokenPairs: ITokenPair<IMayanToken>[] = toTokens.map(toToken => ({
          fromChainId,
          toChainId,
          fromToken,
          toToken,
          fromTokenAddress: this.getTokenAddress(fromToken),
          toTokenAddress: this.getTokenAddress(toToken),
        }));

        tokenPairsMap.set(this.getTokenAddress(fromToken).toLowerCase(), tokenPairs);
      }
    }

    return tokenPairsMap;
  }
}