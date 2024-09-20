import { Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { BaseModal } from '@/modules/transfer/components/SelectModal/components/BaseModal';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useFromChains } from '@/modules/aggregator/hooks/useFromChains';
import { VirtualList } from '@/core/components/VirtualList';
import { ListItem } from '@/modules/transfer/components/SelectModal/components/ListItem';
import { useSearch } from '@/modules/transfer/components/SelectModal/hooks/useSearch';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { openLink } from '@/core/utils/common';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';

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
      <VirtualList data={result} itemHeight={64} itemKey="id">
        {(item) => (
          <ListItem
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
