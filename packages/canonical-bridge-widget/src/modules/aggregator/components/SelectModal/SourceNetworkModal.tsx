import { Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useFromChains } from '@/modules/aggregator/hooks/useFromChains';
import { VirtualList } from '@/core/components/VirtualList';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { openLink } from '@/core/utils/common';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { BaseModal } from '@/modules/aggregator/components/SelectModal/components/BaseModal';
import { useSearch } from '@/modules/aggregator/components/SelectModal/hooks/useSearch';
import { ListItem } from '@/modules/aggregator/components/SelectModal/components/ListItem';

interface SourceNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SourceNetworkModal(props: SourceNetworkModalProps) {
  const { isOpen, onClose } = props;
  const { formatMessage } = useIntl();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const { selectFromChain } = useSelection();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const fromChains = useFromChains({
    toChainId: toChain?.id,
    token: selectedToken,
  });

  const { isNoResult, result, onSearch } = useSearch({
    filter: (item, keyword) => item.name.toLowerCase().includes(keyword),
    sorter: (a) => (fromChain?.id === a.id ? -1 : 0),
    data: fromChains,
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={formatMessage({ id: 'select-modal.source.title' })}
      onSearch={onSearch}
      placeholder={formatMessage({ id: 'select-modal.source.placeholder' })}
      isNoResult={isNoResult}
    >
      <VirtualList data={result} itemHeight={64}>
        {(item) => (
          <ListItem
            key={item.id}
            iconUrl={item.icon}
            isActive={fromChain?.id === item.id}
            isDisabled={false}
            onClick={() => {
              if (item.chainType === 'link') {
                openLink(item.externalBridgeUrl);
              } else {
                selectFromChain(item);
                onClose();
              }
            }}
          >
            <Flex alignItems="center">
              {item.name}
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