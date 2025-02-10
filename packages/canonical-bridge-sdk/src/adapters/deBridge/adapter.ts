import { BaseAdapter } from '@/adapters/base';
import { ITokenPair } from '@/adapters/base/types';
import {
  IDeBridgeChain,
  IDeBridgeToken,
  IDeBridgeTransferConfig,
} from '@/adapters/deBridge/types';
import { isSameAddress } from '@/shared/address';
import { BridgeType } from '@/shared/types';

export class DeBridgeAdapter extends BaseAdapter<
  IDeBridgeTransferConfig,
  IDeBridgeChain,
  IDeBridgeToken
> {
  public id: BridgeType = 'deBridge';

  protected bridgedTokenGroups = [
    ['USDT', 'USDT.e'],
    ['USDC', 'USDC.e'],
    ['WETH', 'WETH.e'],
    ['DAI', 'DAI.e'],
    ['WBTC', 'WBTC.e'],
    ['LINK', 'LINK.e'],
    ['AAVE', 'AAVE.e'],
    ['WOO', 'WOO.e'],
    ['BUSD', 'BUSD.e'],
    ['ALPHA', 'ALPHA.e'],
    ['SUSHI', 'SUSHI.e'],
    ['SWAP', 'SWAP.e'],
  ];

  protected initChains() {
    const { chains, tokens } = this.config;

    const filteredChains = chains.filter((chain) => {
      const hasChainConfig = !!this.chainConfigs.find(
        (e) => e.id === chain.chainId
      );
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
    const symbolMap = new Map<number, Map<string, IDeBridgeToken[]>>();
    Object.entries(tokens).forEach(([id, chainTokens]) => {
      const chainId = Number(id);

      const filteredTokens = chainTokens.filter((token) => {
        const isExcludedToken = this.isExcludedToken({
          chainId,
          tokenSymbol: token.symbol?.toUpperCase(),
          tokenAddress: token.address,
        });
        return !isExcludedToken;
      });

      if (filteredTokens.length > 0 && this.chainMap.has(chainId)) {
        symbolMap.set(chainId, new Map<string, IDeBridgeToken[]>());

        filteredTokens.forEach((token) => {
          const tokenSymbol = token.symbol?.toUpperCase();
          if (!symbolMap.get(chainId)?.get(tokenSymbol)) {
            symbolMap.get(chainId)?.set(tokenSymbol, []);
          }
          symbolMap.get(chainId)?.get(tokenSymbol)?.push(token);
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
      Map<number, Map<string, ITokenPair<IDeBridgeToken>[]>>
    >();

    this.chains.forEach((fromChain) => {
      this.chains.forEach((toChain) => {
        if (fromChain.chainId !== toChain.chainId) {
          const fromTokens = this.tokenMap.get(fromChain.chainId) ?? [];

          const tokenPairsMap = new Map<string, ITokenPair<IDeBridgeToken>[]>();
          fromTokens.forEach((fromToken) => {
            const toTokens = this.getToTokensForPair({
              fromChainId: fromChain.chainId,
              toChainId: toChain.chainId,
              fromTokenSymbol: fromToken.symbol?.toUpperCase(),
            });

            if (toTokens?.length) {
              const tokenPairs: ITokenPair<IDeBridgeToken>[] = [];

              toTokens.forEach((toToken) => {
                tokenPairs.push({
                  fromChainId: fromChain.chainId,
                  toChainId: toChain.chainId,
                  fromTokenAddress: fromToken.address,
                  toTokenAddress: toToken.address,
                  fromToken,
                  toToken,
                });
              });

              tokenPairsMap.set(fromToken.address?.toLowerCase(), tokenPairs);
            }
          });

          if (tokenPairsMap.size > 0) {
            if (!transferMap.has(fromChain.chainId)) {
              transferMap.set(
                fromChain.chainId,
                new Map<number, Map<string, ITokenPair<IDeBridgeToken>[]>>()
              );
            }
            transferMap
              .get(fromChain.chainId)
              ?.set(toChain.chainId, tokenPairsMap);
          }
        }
      });
    });

    this.transferMap = transferMap;
  }

  public getChainId(chain: IDeBridgeChain) {
    return chain.chainId;
  }

  public getTokenBaseInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: IDeBridgeToken;
  }) {
    return {
      name: token.name,
      symbol: token.symbol,
      address: token.address,
      decimals: token.decimals,
      ...this.getTokenDisplaySymbolAndIcon({
        chainId,
        tokenAddress: token.address,
        defaultSymbol: token.symbol,
        icon: token.logoURI,
      }),
    };
  }

  public getTokenByAddress({
    chainId,
    address,
  }: {
    chainId: number;
    address: string;
  }) {
    if (chainId && address) {
      const tokens = this.tokenMap.get(Number(chainId));
      const target = tokens?.find((item) =>
        isSameAddress(item.address, address)
      );
      return target;
    }
  }
}
