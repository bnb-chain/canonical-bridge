import {
  AdapterType,
  ChainType,
  IBridgeChain,
  ITransferConfig,
  IBridgeToken,
  IChainConfig,
} from '@/modules/aggregator/types';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';

export interface IGetFromChainsParams {
  toChainId?: number;
  token?: IBridgeToken;
}

export interface IGetToChainsParams {
  fromChainId?: number;
  token?: IBridgeToken;
}

export interface IAggregateChainsParams {
  direction: 'from' | 'to';
  transferConfig: ITransferConfig;
  chainConfigs: IChainConfig[];
  adapters: AdapterType[];
  params: IGetFromChainsParams | IGetToChainsParams;
  assetPrefix?: string;
}

export function aggregateChains({
  direction,
  adapters,
  params,
  transferConfig,
  chainConfigs,
  assetPrefix,
}: IAggregateChainsParams) {
  const chainMap = new Map<number, IBridgeChain>();

  const chainOrder = transferConfig.order?.chains ?? [];

  adapters.forEach((adapter) => {
    const { bridgeType } = adapter;

    const tmpSymbol = params.token?.[bridgeType]?.symbol?.toUpperCase();
    const isNotSelf = params.token && !tmpSymbol;
    const tokenSymbol = isNotSelf ? '???????' : tmpSymbol; // TODO

    const { chains, matchedChainIds, compatibleChainIds } =
      direction === 'from'
        ? adapter.getFromChains({
            toChainId: (params as IGetFromChainsParams).toChainId,
            tokenSymbol,
          })
        : adapter.getToChains({
            fromChainId: (params as IGetToChainsParams).fromChainId,
            tokenSymbol,
          });

    chains.forEach((item: any) => {
      const chainId = adapter.getChainId(item);

      let bridgeChain = chainMap.get(chainId);
      const isMatched = matchedChainIds.has(chainId);
      const isCompatible = compatibleChainIds.has(chainId);

      if (!bridgeChain) {
        bridgeChain = {
          ...getChainInfo({
            assetPrefix,
            chainId,
            transferConfig,
            chainConfigs,
          }),
        };
      }

      bridgeChain = {
        ...bridgeChain,
        [bridgeType]: {
          isCompatible,
          isMatched,
          raw: isMatched ? item : undefined,
        },
      };

      chainMap.set(chainId, bridgeChain);
    });
  });

  const chains = [...chainMap.values()];

  chains.sort((a, b) => {
    if (direction === 'to') {
      const isA = isChainOrTokenCompatible(a);
      const isB = isChainOrTokenCompatible(b);

      if (isA && !isB) {
        return -1;
      }
      if (!isA && isB) {
        return 1;
      }
    }

    const indexA = chainOrder.indexOf(a.id);
    const indexB = chainOrder.indexOf(b.id);

    if (indexA > -1 && indexB === -1) {
      return -1;
    }
    if (indexA === -1 && indexB > -1) {
      return 1;
    }
    if (indexA > -1 && indexB > -1) {
      return indexA - indexB;
    }

    return a.name < b.name ? -1 : 1;
  });

  return chains;
}

function getChainInfo({
  assetPrefix,
  chainId,
  transferConfig,
  chainConfigs,
}: {
  assetPrefix?: string;
  chainId: number;
  transferConfig: ITransferConfig;
  chainConfigs: IChainConfig[];
}) {
  const chainConfig = chainConfigs.find((item) => item.id === chainId);

  const explorerUrl = chainConfig?.explorer.url?.replace(/\/$/, '') ?? '';
  const tmpUrlPattern = explorerUrl ? `${explorerUrl}/token/{0}` : '';
  const tokenUrlPattern = chainConfig?.explorer?.tokenUrlPattern || tmpUrlPattern;

  const externalConfig = transferConfig.externalChains?.find((item) => item.chainId === chainId);
  const chainType: ChainType = externalConfig ? 'link' : 'evm';
  const externalBridgeUrl = externalConfig?.bridgeUrl;

  return {
    id: chainId,
    name: chainConfig?.name ?? '',
    icon: `${assetPrefix}/images/chains/${chainId}.png`,
    explorerUrl,
    rpcUrl: chainConfig?.rpcUrl ?? '',
    tokenUrlPattern,
    chainType,
    externalBridgeUrl,
  };
}
