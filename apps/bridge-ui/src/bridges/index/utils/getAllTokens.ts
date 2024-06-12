import { TokenInfo } from '@/bridges/index/types';
import { CBRIDGE_TRANSFER_CONFIGS, DEBRIDGE_TOKENS } from '../data/index';

export function getAllTokens() {
  const CBridgeTokenInfos = CBRIDGE_TRANSFER_CONFIGS.chain_token;
  const deBridgeTokens = DEBRIDGE_TOKENS;

  const chainTokenMap = new Map<string, Record<string, TokenInfo>>();
  const supportedTokens: Record<string, TokenInfo[]> = {};

  Object.entries(CBridgeTokenInfos).forEach(([chainId, { token }]) => {
    supportedTokens[chainId] = [];

    const tokenMap: Record<string, TokenInfo> = {};
    chainTokenMap.set(chainId, tokenMap);

    token.forEach((item) => {
      const tokenInfo: TokenInfo = {
        name: item.name,
        icon: item.icon,
        address: item.token.address,
        symbol: item.token.symbol,
        decimal: item.token.decimal,
        tags: ['cbridge'],
        rawData: {
          cbridge: item,
        },
      };
      supportedTokens[chainId].push(tokenInfo);
      tokenMap[item.token.symbol] = tokenInfo;
    });
  });

  const createTokenByDeBridge = (item: any) => {
    return {
      name: item.name,
      icon: item.logoURI,
      address: item.address,
      symbol: item.symbol,
      decimal: item.decimals,
      tags: ['debridge'],
      rawData: {
        debridge: item,
      },
    } as TokenInfo;
  };

  Object.entries(deBridgeTokens).forEach(([chainId, token]) => {
    const tokenMap = chainTokenMap.get(chainId);
    if (tokenMap) {
      token.forEach((item) => {
        const tokenInfo = tokenMap[item.symbol];
        if (tokenInfo) {
          tokenInfo.tags.push('debridge');
          tokenInfo.rawData.debridge = item;
        } else {
          supportedTokens[chainId].push(createTokenByDeBridge(item));
        }
      });
    } else {
      supportedTokens[chainId] = [];
      token.forEach((item) => {
        supportedTokens[chainId].push(createTokenByDeBridge(item));
      });
    }
  });

  Object.values(supportedTokens).forEach((tokens) => {
    tokens.sort((a, b) => (a.name < b.name ? -1 : 1));
  });

  return supportedTokens;
}
