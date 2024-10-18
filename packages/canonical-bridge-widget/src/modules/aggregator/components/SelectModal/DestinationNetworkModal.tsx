import { Flex, useColorMode, useIntl, useTheme, Text } from '@bnb-chain/space';

import { VirtualList } from '@/core/components/VirtualList';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useToChains } from '@/modules/aggregator/hooks/useToChains';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { openLink } from '@/core/utils/common';
import { reportEvent } from '@/core/utils/gtm';
import { useSearch } from '@/modules/aggregator/components/SelectModal/hooks/useSearch';
import { BaseModal } from '@/modules/aggregator/components/SelectModal/components/BaseModal';
import { ListItem } from '@/modules/aggregator/components/SelectModal/components/ListItem';

interface DestinationNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DestinationNetworkModal(props: DestinationNetworkModalProps) {
  const { isOpen, onClose } = props;
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const { selectToChain } = useSelection();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const toChains = useToChains({
    fromChainId: fromChain?.id,
    token: selectedToken,
  });

  const { isNoResult, result, onSearch } = useSearch({
    filter: (item, keyword) => item.name.toLowerCase().includes(keyword),
    sorter: (a) => (toChain?.id === a.id ? -1 : 0),
    data: toChains,
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={formatMessage({ id: 'select-modal.destination.title' })}
      onSearch={onSearch}
      placeholder={formatMessage({ id: 'select-modal.destination.placeholder' })}
      isNoResult={isNoResult}
    >
      <VirtualList data={result} itemHeight={64}>
        {(item) => (
          <ListItem
            key={item.id}
            iconUrl={item.icon}
            isActive={toChain?.id === item.id}
            isDisabled={!isChainOrTokenCompatible(item)}
            incompatibleTooltip={formatMessage({
              id: 'select-modal.destination.incompatible.tooltip',
            })}
            onClick={() => {
              reportEvent({
                id: 'select_bridge_toDropdown',
                params: {
                  item_name: item.name,
                },
              });

              if (item.chainType === 'link') {
                openLink(item.externalBridgeUrl);
              } else {
                selectToChain(item);
                onClose();
              }
            }}
          >
            <Flex alignItems="center" w="100%">
              <Text isTruncated>{item.name}</Text>
              {item.chainType === 'link' && (
                <ExLinkIcon
                  ml={'4px'}
                  color={theme.colors[colorMode].text.secondary}
                  boxSize={theme.sizes['4']}
                />
              )}
            </Flex>
          </ListItem>
        )}
      </VirtualList>
    </BaseModal>
  );
}
