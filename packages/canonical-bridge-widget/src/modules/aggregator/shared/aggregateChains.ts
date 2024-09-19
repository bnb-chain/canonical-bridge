import {
  AdapterType,
  IBridgeChain,
  IBridgeConfig,
  IBridgeToken,
  IChainConfig,
} from '@/modules/aggregator/types';
import { env } from '@/core/configs/env';
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
  config: IBridgeConfig;
}

export function aggregateChains({ direction, adapters, params, config }: IAggregateChainsParams) {
  const chainMap = new Map<number, IBridgeChain>();

  const chainConfigs = config.chainConfigs;
  const chainOrder = config.order.chains;

  adapters.forEach((adapter) => {
    const { bridgeType } = adapter;

    const tmpSymbol = params.token?.[bridgeType]?.symbol?.toUpperCase();
    const isNotSelf = params.token && !tmpSymbol;
    const tokenSymbol = isNotSelf ? '???????' : tmpSymbol;

    let adapterParams: any;
    if (direction === 'from') {
      adapterParams = {
        toChainId: (params as IGetFromChainsParams).toChainId,
        tokenSymbol,
      };
    } else {
      adapterParams = {
        fromChainId: (params as IGetToChainsParams).fromChainId,
        tokenSymbol,
      };
    }

    const { chains, compatibleChainIds } =
      direction === 'from'
        ? adapter.getFromChains(adapterParams)
        : adapter.getToChains(adapterParams);

    chains.forEach((item: any) => {
      const chainId = adapter.getChainId(item);

      let bridgeChain = chainMap.get(chainId);
      const isCompatible = compatibleChainIds.has(chainId);

      if (!bridgeChain) {
        bridgeChain = {
          ...getChainInfo({
            chainId,
            chainConfigs,
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

  const finalChains = [...chainMap.values()];
  finalChains.sort((a, b) => {
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

  return finalChains;
}

function getChainInfo({
  chainId,
  chainConfigs,
}: {
  chainId: number;
  chainConfigs: IChainConfig[];
}) {
  const chain = chainConfigs.find((item) => item.id === chainId);

  const explorerUrl = chain?.explorer.url?.replace(/\/$/, '') ?? '';
  const tmpUrlPattern = explorerUrl ? `${explorerUrl}/token/{0}` : '';
  const tokenUrlPattern = chain?.explorer?.tokenUrlPattern || tmpUrlPattern;

  return {
    id: chainId,
    name: chain?.name ?? '',
    icon: `${env.ASSET_PREFIX}/images/chains/${chainId}.png`,
    explorerUrl,
    rpcUrl: chain?.rpcUrl ?? '',
    tokenUrlPattern,
  };
}
