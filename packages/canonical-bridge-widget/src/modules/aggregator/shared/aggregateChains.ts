import {
  AdapterType,
  ChainType,
  IBridgeChain,
  ITransferConfig,
  IBridgeToken,
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
  adapters: AdapterType[];
  params: IGetFromChainsParams | IGetToChainsParams;
  config: ITransferConfig;
  assetsPrefix?: string;
}

export function aggregateChains({
  direction,
  adapters,
  params,
  config,
  assetsPrefix,
}: IAggregateChainsParams) {
  const chainMap = new Map<number, IBridgeChain>();

  const chainOrder = config.order.chains;

  adapters.forEach((adapter) => {
    const { bridgeType } = adapter;

    const tmpSymbol = params.token?.[bridgeType]?.symbol?.toUpperCase();
    const isNotSelf = params.token && !tmpSymbol;
    const tokenSymbol = isNotSelf ? '???????' : tmpSymbol; // TODO

    const { chains, compatibleChainIds } =
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
      const isCompatible = compatibleChainIds.has(chainId);

      if (!bridgeChain) {
        bridgeChain = {
          ...getChainInfo({
            assetsPrefix,
            chainId,
            config,
          }),
        };
      }

      bridgeChain = {
        ...bridgeChain,
        [bridgeType]: {
          isCompatible,
          raw: isCompatible ? item : undefined,
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
  assetsPrefix,
  chainId,
  config,
}: {
  assetsPrefix?: string;
  chainId: number;
  config: ITransferConfig;
}) {
  const chainConfig = config.chainConfigs.find((item) => item.id === chainId);

  const explorerUrl = chainConfig?.explorer.url?.replace(/\/$/, '') ?? '';
  const tmpUrlPattern = explorerUrl ? `${explorerUrl}/token/{0}` : '';
  const tokenUrlPattern = chainConfig?.explorer?.tokenUrlPattern || tmpUrlPattern;

  const externalConfig = config.externalChains?.find((item) => item.chainId === chainId);
  const chainType: ChainType = externalConfig ? 'link' : 'evm';
  const externalBridgeUrl = externalConfig?.bridgeUrl;

  return {
    id: chainId,
    name: chainConfig?.name ?? '',
    icon: `${assetsPrefix}/images/chains/${chainId}.png`,
    explorerUrl,
    rpcUrl: chainConfig?.rpcUrl ?? '',
    tokenUrlPattern,
    chainType,
    externalBridgeUrl,
  };
}
