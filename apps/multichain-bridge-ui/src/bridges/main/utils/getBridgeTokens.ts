import { CBridgePeggedPairConfig } from '@/bridges/cbridge/types';
import { TokenInfo } from '@/bridges/main';

interface GetBridgeTokensParams {
  chainTokensMap: Record<number, TokenInfo[]>;
  peggedPairConfigs: CBridgePeggedPairConfig[];
  fromChainId: number;
  toChainId: number;
}

export function getBridgeTokens(params: GetBridgeTokensParams) {
  const { chainTokensMap, peggedPairConfigs, fromChainId, toChainId } = params;

  const fromChainTokens = chainTokensMap[fromChainId];
  const toChainTokens = chainTokensMap[toChainId];
  const tokens: TokenInfo[] = [];

  fromChainTokens?.forEach((item) => {
    // cbridge token
    if (item.rawData.cbridge) {
      const tmpTokenSymbolSet = new Set<string>();

      if (!item.rawData.cbridge.token.xfer_disabled) {
        const toToken = toChainTokens.find((token) => {
          const hasToken = !!token.rawData.cbridge;
          const isEnabledToken = !token.rawData.cbridge?.token.xfer_disabled;
          return hasToken && isEnabledToken && token.symbol === item.symbol;
        });

        if (toToken) {
          tokens.push({
            ...item,
            peggedRawData: undefined,
            isPegged: false,
          });
          tmpTokenSymbolSet.add(item.symbol);
        }
      }

      peggedPairConfigs.forEach((ppItem) => {
        if (
          ppItem.org_chain_id === fromChainId &&
          ppItem.pegged_chain_id === toChainId &&
          ppItem.org_token.token.symbol === item.symbol &&
          !tmpTokenSymbolSet.has(item.symbol)
        ) {
          tokens.push({
            ...item,
            isPegged: true,
            peggedRawData: {
              cbridge: ppItem,
            },
          });
          tmpTokenSymbolSet.add(item.symbol);
        }

        if (
          ppItem.org_chain_id === toChainId &&
          ppItem.pegged_chain_id === fromChainId &&
          ppItem.pegged_token.token.symbol === item.symbol &&
          !tmpTokenSymbolSet.has(item.symbol)
        ) {
          tokens.push({
            ...item,
            isPegged: true,
            peggedRawData: {
              cbridge: ppItem,
            },
          });
          tmpTokenSymbolSet.add(item.symbol);
        }
      });
      // debridge token
    } else if (item.rawData.debridge) {
      const hasToToken = toChainTokens.find((token) => {
        const hasToken = !!token.rawData.debridge;
        return hasToken && token.symbol === item.symbol;
      });

      if (hasToToken) {
        tokens.push({
          ...item,
          isPegged: false,
          peggedRawData: undefined,
        });
      }
    }
  });

  return tokens;
}
