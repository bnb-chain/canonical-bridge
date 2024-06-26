import { ChainInfo, TokenInfo, BridgeConfigsContextProps } from '@/bridges/main';

export function getSupportedTokens(
  configs: BridgeConfigsContextProps,
  fromChain: ChainInfo,
  toChain: ChainInfo,
) {
  const { chainTokensMap, peggedPairConfigs } = configs;

  const fromChainTokens = chainTokensMap[fromChain.id];
  const toChainTokens = chainTokensMap[toChain.id];
  const tokens: TokenInfo[] = [];

  fromChainTokens?.forEach((item) => {
    // cbridge token
    if (item.rawData.cbridge) {
      const tmpTokenSymbolSet = new Set<string>();

      if (!item.rawData.cbridge.token.xfer_disabled) {
        const toToken = toChainTokens.find((token) => {
          const hasToken = !!token.rawData.cbridge;
          const isEnabledToken = !token.rawData.cbridge!.token.xfer_disabled;
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
          ppItem.org_chain_id === fromChain.id &&
          ppItem.pegged_chain_id === toChain.id &&
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
          ppItem.org_chain_id === toChain.id &&
          ppItem.pegged_chain_id === fromChain.id &&
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

function getCBridgeTokenSymbolSet(
  configs: BridgeConfigsContextProps,
  fromChainId: number,
  toChainId: number,
) {
  const { rawData, peggedPairConfigs, multiBurnConfigs } = configs;
  const { chains, chain_token: tokensMap } = rawData.cbridge;

  const tokenSymbolSet = new Set();
}

function getDeBridgeTokenSymbolSet(
  configs: BridgeConfigsContextProps,
  fromTokenSymbol: string,
  toChainId: number,
) {
  const { rawData, peggedPairConfigs, multiBurnConfigs } = configs;
  const { chains, chain_token: tokensMap } = rawData.debridge;

  const tokenSymbolSet = new Set();
  const toChainTokens = tokensMap[toChainId];

  const hasToToken = toChainTokens?.find((token) => {
    return token.symbol === fromTokenSymbol;
  });
}
