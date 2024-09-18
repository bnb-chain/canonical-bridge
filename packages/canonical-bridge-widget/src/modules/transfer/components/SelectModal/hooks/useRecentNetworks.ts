import { useState, useEffect } from 'react';

import { storage } from '@/core/utils/storage';
import { IBridgeChain } from '@/modules/aggregator/types';

interface UseRecentNetworksProps {
  current?: IBridgeChain;
  networks: IBridgeChain[];
  storageKey: string;
  maxCount: number;
}

export function useRecentNetworks(props: UseRecentNetworksProps) {
  const { current, networks, storageKey, maxCount } = props;

  const [recentNetworks, setRecentNetworks] = useState<IBridgeChain[]>([]);

  useEffect(() => {
    const currId = current?.id;

    const headNetworkIds: number[] = storage.get(storageKey, []);
    const tailCount = maxCount - headNetworkIds.length;
    const tailNetworkIds = networks.slice(0, tailCount).map((item) => item.id);

    const networkIds = [...headNetworkIds, ...tailNetworkIds];
    if (currId) {
      const target = networkIds.find((id) => id === currId);
      if (!target) {
        networkIds.pop();
        networkIds.unshift(currId);
      }
    }
    storage.set(storageKey, networkIds);

    const recentNetworks: IBridgeChain[] = [];
    networkIds.forEach((id) => {
      const target = networks.find((item) => item.id === id);
      if (target) {
        recentNetworks.push(target);
      }
    });
    setRecentNetworks(recentNetworks);
  }, [networks, current?.id, storageKey, maxCount]);

  return recentNetworks;
}
