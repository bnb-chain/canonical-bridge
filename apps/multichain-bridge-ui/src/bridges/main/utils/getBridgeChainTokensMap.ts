import { TokenInfo } from '@/bridges/main/types';
import { CBridgeTransferConfigResponse } from '@/bridges/cbridge/types';
import { DeBridgeTokenDetails } from '@/bridges/debridge/types';

interface GetBridgeChainTokensMapParams {
  cbridgeTokens: CBridgeTransferConfigResponse['chain_token'];
  deBridgeTokens: Record<number, DeBridgeTokenDetails[]>;
}

export function getBridgeChainTokensMap(params: GetBridgeChainTokensMapParams) {
  const { cbridgeTokens, deBridgeTokens } = params;

  const supportedTokens: Record<number, TokenInfo[]> = {};
  const tmpChainTokensMap: Record<number, Record<string, TokenInfo>> = {};

  // cbridge tokens
  Object.entries(cbridgeTokens).forEach(([key, { token: tokens }]) => {
    const chainId = Number(key);

    supportedTokens[chainId] = [];
    tmpChainTokensMap[chainId] = {};

    tokens.forEach((item) => {
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
      tmpChainTokensMap[chainId][item.token.symbol] = tokenInfo;
    });
  });

  // debridge tokens
  const createTokenByDeBridge = (item: DeBridgeTokenDetails) => {
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

  Object.entries(deBridgeTokens).forEach(([key, tokens]) => {
    const chainId = Number(key);

    if (tmpChainTokensMap[chainId]) {
      tokens.forEach((item) => {
        const tokenInfo = tmpChainTokensMap[chainId][item.symbol];
        if (tokenInfo) {
          tokenInfo.tags.push('debridge');
          tokenInfo.rawData.debridge = item;
        } else {
          supportedTokens[chainId].push(createTokenByDeBridge(item));
        }
      });
    } else {
      supportedTokens[chainId] = [];
      tokens.forEach((item) => {
        supportedTokens[chainId].push(createTokenByDeBridge(item));
      });
    }
  });

  Object.values(supportedTokens).forEach((tokens) => {
    tokens.sort((a, b) => (a.symbol < b.symbol ? -1 : 1));
  });

  return supportedTokens;
}
