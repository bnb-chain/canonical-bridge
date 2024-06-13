import {
  TransferConfigsContextProps,
  ChainInfo,
  TokenInfo,
} from '@/bridges/index';

export function getSupportedTokens(
  configs: TransferConfigsContextProps,
  fromChain: ChainInfo,
  toChain: ChainInfo
) {
  const { chainTokensMap, peggedPairConfigs } = configs;

  const chainTokens = chainTokensMap[fromChain.id];
  const finalTokens: TokenInfo[] = [];

  chainTokens.forEach((item) => {
    if (item.rawData.cbridge) {
      const tokenSet = new Set<string>();
      peggedPairConfigs.forEach((ppItem) => {
        if (
          ppItem.org_chain_id === fromChain.id &&
          ppItem.pegged_chain_id === toChain.id &&
          ppItem.org_token.token.symbol === item.symbol &&
          !tokenSet.has(item.symbol)
        ) {
          finalTokens.push({
            ...item,
            isPegged: true,
            peggedRawData: {
              cbridge: ppItem,
            },
          });
          tokenSet.add(item.symbol);
        }

        if (
          ppItem.org_chain_id === toChain.id &&
          ppItem.pegged_chain_id === fromChain.id &&
          ppItem.pegged_token.token.symbol === item.symbol &&
          !tokenSet.has(item.symbol)
        ) {
          finalTokens.push({
            ...item,
            isPegged: true,
            peggedRawData: {
              cbridge: ppItem,
            },
          });
          tokenSet.add(item.symbol);
        }
      });

      if (
        !tokenSet.has(item.symbol) &&
        !item.rawData.cbridge.token.xfer_disabled
      ) {
        finalTokens.push({
          ...item,
          isPegged: false,
          peggedRawData: undefined,
        });
      }
    } else if (item.rawData.debridge) {
      finalTokens.push({
        ...item,
        isPegged: false,
        peggedRawData: undefined,
      });
    }
  });

  return finalTokens;
}
