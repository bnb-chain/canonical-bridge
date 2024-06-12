import { ChainInfo } from '@/bridges/index/types';
import { CBRIDGE_TRANSFER_CONFIGS, DEBRIDGE_CHAIN_LIST } from '../data/index';

export function getAllChains() {
  const CBridgeChainInfos = CBRIDGE_TRANSFER_CONFIGS.chains;
  const deBridgeChains = DEBRIDGE_CHAIN_LIST.chains;

  const chainMap = new Map<number, ChainInfo>();
  const supportedChains: ChainInfo[] = [];
  CBridgeChainInfos.forEach((item) => {
    const chainInfo: ChainInfo = {
      id: item.id,
      name: item.name,
      icon: item.icon,
      tags: ['cbridge'],
      rawData: {
        cbridge: item,
      },
    };

    chainMap.set(item.id, chainInfo);
    supportedChains.push(chainInfo);
  });

  deBridgeChains.forEach((item) => {
    const chainInfo = chainMap.get(item.chainId);
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
