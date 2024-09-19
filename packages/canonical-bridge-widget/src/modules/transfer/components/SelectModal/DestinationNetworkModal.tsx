import { Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { BaseModal } from '@/modules/transfer/components/SelectModal/components/BaseModal';
import { VirtualList } from '@/core/components/VirtualList';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useSearch } from '@/modules/transfer/components/SelectModal/hooks/useSearch';
import { useToChains } from '@/modules/aggregator/hooks/useToChains';
import { ListItem } from '@/modules/transfer/components/SelectModal/components/ListItem';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { openLink } from '@/core/utils/common';

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
            isActive={toChain?.id === item.id}
            isDisabled={!isChainOrTokenCompatible(item) && item.chainType !== 'link'}
            onClick={() => {
              if (item.chainType === 'link') {
                openLink(item.externalUrl);
              } else {
                selectToChain(item);
                onClose();
              }
            }}
          >
            <Flex>
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
