import { Flex, useColorMode, useIntl, useTheme, Text } from '@bnb-chain/space';

import { VirtualList } from '@/core/components/VirtualList';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { openLink } from '@/core/utils/common';
import { reportEvent } from '@/core/utils/gtm';
import { useSearch } from '@/modules/aggregator/components/SelectModal/hooks/useSearch';
import { BaseModal } from '@/modules/aggregator/components/SelectModal/components/BaseModal';
import { ListItem } from '@/modules/aggregator/components/SelectModal/components/ListItem';
import { useToChains } from '@/modules/aggregator/hooks/useToChains';

interface DestinationNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DestinationNetworkModal(props: DestinationNetworkModalProps) {
  const { isOpen, onClose } = props;
  const { formatMessage } = useIntl();

  const toChain = useAppSelector((state) => state.transfer.toChain);

  const { selectToChain } = useSelection();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const toChains = useToChains();

  const { isNoResult, result, onSearch } = useSearch({
    filter: (item, keyword) => item.name.toLowerCase().includes(keyword?.toLowerCase()),
    sorter: (a) => (toChain?.id === a.id ? -1 : 0),
    data: toChains,
  });

  return (
    <BaseModal
      className="bccb-widget-to-network-modal"
      isOpen={isOpen}
      onClose={onClose}
      title={formatMessage({ id: 'select-modal.destination.title' })}
      onSearch={onSearch}
      placeholder={formatMessage({ id: 'select-modal.destination.placeholder' })}
      isNoResult={isNoResult}
    >
      <VirtualList className="bccb-widget-to-network-virtual-list" data={result} itemHeight={52}>
        {(item) => (
          <ListItem
            className={
              'bccb-widget-to-network-list-item' + (toChain?.id === item.id ? '-active' : '')
            }
            key={item.id}
            iconUrl={item.icon}
            isActive={toChain?.id === item.id}
            isDisabled={!item.isCompatible}
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
                selectToChain(item.id);
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
