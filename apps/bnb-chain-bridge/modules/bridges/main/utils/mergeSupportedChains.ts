import { isMobile } from '@node-real/walletkit';

import { env } from '@/core/configs/env';
import { BridgeChain, BridgeConfigsResponse, ChainConfig, ChainType } from '@/modules/bridges';
import { isAvailableChainOrToken } from '@/modules/bridges/main/utils/isAvailableChainOrToken';
import {
  CreateAdapterFuncReturnType,
  GetSupportedFromChainsParams,
  GetSupportedToChainsParams,
} from '@/modules/bridges/main/utils/createAdapter';

export interface MergeSupportedChainsFuncParams {
  direction: 'from' | 'to';
  adapters: CreateAdapterFuncReturnType[];
  adapterParams: GetSupportedFromChainsParams | GetSupportedToChainsParams;
  defaultWallets: BridgeConfigsResponse['defaultWallets'];
  chainOrder: number[];
  chainConfigs: ChainConfig[];
}

export function mergeSupportedChains(params: MergeSupportedChainsFuncParams) {
  const {
    direction = 'from',
    adapters,
    adapterParams,
    defaultWallets,
    chainConfigs,
    chainOrder,
  } = params;

  const supportedChains: BridgeChain[] = [];
  const existingMap = new Map<number, BridgeChain>();

  const funcName = direction === 'from' ? 'getSupportedFromChains' : 'getSupportedToChains';

  adapters.forEach((adapter) => {
    const { bridgeType, getChainId } = adapter;
    const { availableChainIds, chains } = adapter[funcName](adapterParams);

    chains.forEach((item: any) => {
      const chainId = getChainId(item);

      const existingChain = existingMap.get(chainId);
      const isAvailable = availableChainIds.has(chainId);

      if (existingChain) {
        existingChain.rawData[bridgeType] = isAvailable ? item : undefined;
        existingChain.available[bridgeType] = isAvailable;
      } else {
        const bridgeChain: BridgeChain = {
          rawData: {
            [bridgeType]: isAvailable ? item : undefined,
          },
          available: {
            [bridgeType]: isAvailable,
          },
          ...formatChainInfo({
            chainId,
            chainConfigs,
            defaultWallets,
          }),
        };

        supportedChains.push(bridgeChain);
        existingMap.set(chainId, bridgeChain);
      }
    });
  });

  supportedChains.sort((a, b) => {
    const isA = isAvailableChainOrToken(a);
    const isB = isAvailableChainOrToken(b);

    if (isA && !isB) {
      return -1;
    }
    if (!isA && isB) {
      return 1;
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

  return supportedChains;
}

function formatChainInfo(params: {
  chainId: number;
  chainConfigs: ChainConfig[];
  defaultWallets: BridgeConfigsResponse['defaultWallets'];
}) {
  const { chainId, chainConfigs, defaultWallets } = params;

  const chain = chainConfigs.find((item) => item.id === chainId)!;

  const explorerUrl = chain?.explorer.url?.replace(/\/$/, '') ?? '';
  const tmpUrlPattern = explorerUrl ? `${explorerUrl}/token/{0}` : '';
  const tokenUrlPattern = chain?.explorer?.tokenUrlPattern || tmpUrlPattern;
  const chainType: ChainType = chain?.chainType ?? 'evm';

  const pcWallets = chain?.wallets?.pc ?? defaultWallets[chainType].pc;
  const mobileWallets = chain?.wallets?.mobile ?? defaultWallets[chainType].mobile;
  const supportedWallets = isMobile() ? mobileWallets : pcWallets;

  return {
    id: chainId,
    name: chain?.name ?? '',
    icon: `${env.ASSET_PREFIX}/images/chains/${chainId}.png`,
    explorerUrl,
    rpcUrl: chain?.rpcUrl ?? '',
    tokenUrlPattern,
    chainType,
    supportedWallets,
  };
}
