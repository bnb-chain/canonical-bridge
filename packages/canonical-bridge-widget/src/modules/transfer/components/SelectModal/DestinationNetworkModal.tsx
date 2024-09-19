import { Flex, useIntl } from '@bnb-chain/space';

import { BaseModal } from '@/modules/transfer/components/SelectModal/components/BaseModal';
import { VirtualList } from '@/core/components/VirtualList';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useSearch } from '@/modules/transfer/components/SelectModal/hooks/useSearch';
import { useToChains } from '@/modules/aggregator/hooks/useToChains';
import { ListItem } from '@/modules/transfer/components/SelectModal/components/ListItem';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';

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

  const toChains = useToChains({
    fromChainId: fromChain?.id,
    token: selectedToken,
  });

  const { isNoResult, result, onSearch } = useSearch({
    filter: (item, keyword) => item.name.toLowerCase().includes(keyword),
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
      <VirtualList data={result} itemHeight={56} itemKey="id">
        {(item) => (
          <ListItem
            iconUrl={item.icon}
            onClick={() => {
              selectToChain(item);
              onClose();
            }}
            isActive={toChain?.id === item.id}
            isDisabled={!isChainOrTokenCompatible(item)}
          >
            <Flex>{item.name}</Flex>
          </ListItem>
        )}
      </VirtualList>
    </BaseModal>
  );
}
