import { TransferConfigsContextProps, ChainInfo } from '@/bridges/index';

export function getSupportedTokens(
  configs: TransferConfigsContextProps,
  fromChain: ChainInfo,
  toChain: ChainInfo
) {
  const { chains, tokens, peggedPairConfigs } = configs;

  // const tokens = useMemo(() => {
  //   // CBridge supported pegged tokens
  //   peggedPairConfigs.forEach((ppItem) => {
  //     // Deposit to pegged chain
  //     if (
  //       ppItem.org_chain_id === fromChainId &&
  //       ppItem.pegged_chain_id === toChainId
  //     ) {
  //       tokens.push({
  //         ...ppItem.org_token,
  //         bridgeAddress: ppItem.pegged_deposit_contract_addr,
  //       });
  //     }
  //     // Withdraw from pegged chain
  //     // if (
  //     //   ppItem.pegged_chain_id === fromChainId &&
  //     //   ppItem.org_chain_id === toChainId
  //     // ) {
  //     //   tokens.push({
  //     //     ...ppItem.org_token,
  //     //     bridgeAddress: ppItem.pegged_burn_contract_addr,
  //     //   });
  //     // }
  //   });

  //   // CBridge supported pool-based tokens
  //   chainTokensMap.get(fromChainId)?.forEach((token) => {
  //     chainTokensMap.get(toChainId)?.forEach((tokenInner) => {
  //       if (
  //         !token.token.xfer_disabled &&
  //         !tokenInner.token.xfer_disabled &&
  //         token.token.symbol === tokenInner.token.symbol
  //       ) {
  //         tokens.push({
  //           ...token,
  //           method: 'CB_POOL_BASED',
  //           bridgeAddress: chainsMap.get(fromChainId)?.contract_addr,
  //         });
  //       }
  //     });
  //   });

  //   // TODO: DeBridge supported tokens
  // }, [fromChainId, peggedPairConfigs, toChainId, chainTokensMap, chainsMap]);

  // return tokens;

  const chainTokens = tokens[fromChain.id] ?? [];
  const filteredTokens = chainTokens.filter((item) => {
    if (item.rawData.debridge) {
      return true;
    }
    if (item.rawData.cbridge && !item.rawData.cbridge.token.xfer_disabled) {
    }
  });

  return filteredTokens;
}
