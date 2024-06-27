import { CBridgeChainInfo } from '@/bridges/cbridge/types';
import { DeBridgetChainDetails } from '@/bridges/debridge/types';
import { ChainInfo } from '@/bridges/main/types';

interface NormalizedChainsParams {
  cbridgeChains: CBridgeChainInfo[];
  deBridgeChains: DeBridgetChainDetails[];
}

export function normalizedChains(params: NormalizedChainsParams) {
  const { cbridgeChains, deBridgeChains } = params;

  const supportedChains: ChainInfo[] = [];
  const tmpChainMap: Record<number, ChainInfo> = {};

  // cbridge chains
  cbridgeChains.forEach((item) => {
    const chainInfo: ChainInfo = {
      id: item.id,
      name: item.name,
      icon: item.icon,
      tags: ['cbridge'],
      rawData: {
        cbridge: item,
      },
    };

    supportedChains.push(chainInfo);
    tmpChainMap[item.id] = chainInfo;
  });

  // debridge chains
  deBridgeChains.forEach((item) => {
    const chainInfo = tmpChainMap[item.chainId];
    if (chainInfo) {
      chainInfo.tags.push('debridge');
      chainInfo.rawData.debridge = item;
    } else {
      supportedChains.push({
        id: item.chainId,
        name: item.chainName,
        icon: '',
        tags: ['debridge'],
        rawData: {
          debridge: item,
        },
      });
    }
  });

  supportedChains.sort((a, b) => (a.id < b.id ? -1 : 1));

  return supportedChains;
}
