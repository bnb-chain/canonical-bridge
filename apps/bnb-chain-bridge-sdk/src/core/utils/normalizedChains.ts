import { env } from '@/core/configs/env';
import { CBridgeChain } from '@/modules/bridges/cbridge/types';
import { DeBridgeChain } from '@/modules/bridges/debridge/types';
import { BridgeChain } from '@/modules/bridges/main';
import { isAvailableChainOrToken } from '@/modules/bridges/main/utils/isAvailableChainOrToken';
import { StarGateChain } from '@/modules/bridges/stargate/types';

export interface MergeSupportedChainsFuncParams {
  chainOrder: number[];
  cBridge: {
    availableChainIds: Set<number>;
    chains: CBridgeChain[];
  };
  deBridge: {
    availableChainIds: Set<number>;
    chains: DeBridgeChain[];
  };
  stargate: {
    availableChainIds: Set<number>;
    chains: StarGateChain[];
  };
}

export function normalizedChains(params: MergeSupportedChainsFuncParams) {
  const { chainOrder, cBridge, deBridge, stargate } = params;

  const chains: BridgeChain[] = [];
  const existingMap = new Map<number, BridgeChain>();

  // cBridge chains
  cBridge.chains.forEach((item) => {
    const isAvailable = cBridge.availableChainIds.has(item.id);

    const bridgeChain: BridgeChain = {
      id: item.id,
      name: item.name,
      icon: `${env.ASSET_PREFIX}/images/chains/${item.id}.png`,
      rawData: {
        cBridge: isAvailable ? item : undefined,
      },
      available: {
        cBridge: isAvailable,
      },
    };

    chains.push(bridgeChain);
    existingMap.set(item.id, bridgeChain);
  });

  // deBridge chains
  deBridge.chains.forEach((item) => {
    const existingChain = existingMap.get(item.chainId);
    const isAvailable = deBridge.availableChainIds.has(item.chainId);

    if (existingChain) {
      existingChain.rawData.deBridge = isAvailable ? item : undefined;
      existingChain.available.deBridge = isAvailable;
    } else {
      chains.push({
        id: item.chainId,
        name: item.chainName,
        icon: `${env.ASSET_PREFIX}/images/chains/${item.chainId}.png`,
        rawData: {
          deBridge: isAvailable ? item : undefined,
        },
        available: {
          deBridge: isAvailable,
        },
      });
    }
  });

  // Stargate chains
  stargate.chains.forEach((item) => {
    const existingChain = existingMap.get(item.chainId);
    const isAvailable = stargate.availableChainIds.has(item.chainId);

    if (existingChain) {
      existingChain.rawData.stargate = isAvailable ? item : undefined;
      existingChain.available.stargate = isAvailable;
    } else {
      chains.push({
        id: item.chainId,
        name: item.chainName,
        icon: `${env.ASSET_PREFIX}/images/chains/${item.chainId}.png`,
        rawData: {
          stargate: isAvailable ? item : undefined,
        },
        available: {
          stargate: isAvailable,
        },
      });
    }
  });

  chains.sort((a, b) => {
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

  return chains;
}
