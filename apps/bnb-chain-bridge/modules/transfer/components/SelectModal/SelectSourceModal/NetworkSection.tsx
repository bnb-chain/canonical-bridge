import { Button, Flex, theme } from '@bnb-chain/space';

import {
  SOURCE_MAX_MORE_COUNT,
  SOURCE_MAX_RECENT_COUNT,
  SOURCE_RECENT_NETWORKS_STORAGE_KEY,
} from '@/core/configs/app';
import { BridgeChain } from '@/modules/bridges';
import { useRecentNetworks } from '@/modules/transfer/components/SelectModal/hooks/useRecentNetworks';
import { SectionTitle } from '@/modules/transfer/components/SelectModal/components/SectionTitle';
import { NetworkItem } from '@/modules/transfer/components/SelectModal/SelectSourceModal/NetworkItem';

interface NetworkSectionProps {
  selectedNetwork?: BridgeChain;
  networks?: BridgeChain[];
  onSelect: (value: BridgeChain) => void;
  onShowMore: () => void;
}

export function NetworkSection(props: NetworkSectionProps) {
  const { selectedNetwork, networks = [], onSelect, onShowMore } = props;

  const showMoreButton = networks.length > SOURCE_MAX_RECENT_COUNT;
  const moreCount = networks.length - SOURCE_MAX_RECENT_COUNT;

  const recentNetworks = useRecentNetworks({
    current: selectedNetwork,
    networks,
    maxCount: SOURCE_MAX_RECENT_COUNT,
    storageKey: SOURCE_RECENT_NETWORKS_STORAGE_KEY,
  });

  return (
    <Flex flexDir="column">
      <SectionTitle>Select Network</SectionTitle>

      <Flex py={theme.sizes['2']} gap={theme.sizes['2']} flexWrap="wrap">
        {recentNetworks.map((item) => (
          <NetworkItem
            key={item.id}
            isSelected={item.id === selectedNetwork?.id}
            data={item}
            onClick={() => onSelect(item)}
          />
        ))}

        {showMoreButton && (
          <Button variant="subtle" onClick={onShowMore} h={theme.sizes['8']} px={theme.sizes['3']}>
            {moreCount > SOURCE_MAX_MORE_COUNT ? `${SOURCE_MAX_MORE_COUNT}+` : moreCount} More
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
