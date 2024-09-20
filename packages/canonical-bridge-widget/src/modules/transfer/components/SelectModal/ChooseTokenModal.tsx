import { Flex, Text, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useAccount } from 'wagmi';

import { BaseModal } from '@/modules/transfer/components/SelectModal/components/BaseModal';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useTokens } from '@/modules/aggregator/hooks/useTokens';
import { useSearch } from '@/modules/transfer/components/SelectModal/hooks/useSearch';
import { VirtualList } from '@/core/components/VirtualList';
import { ListItem } from '@/modules/transfer/components/SelectModal/components/ListItem';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { isSameAddress } from '@/core/utils/address';

interface ChooseTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChooseTokenModal(props: ChooseTokenModalProps) {
  const { isOpen, onClose } = props;
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const { isConnected } = useAccount();
  const { selectToken } = useSelection();

  const tokens = useTokens({
    fromChainId: fromChain?.id,
    toChainId: toChain?.id,
  });

  const { isNoResult, result, onSearch } = useSearch({
    filter: (item, keyword) =>
      item.name.toLowerCase().includes(keyword) ||
      item.displaySymbol.toLowerCase().includes(keyword),
    data: tokens,
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={formatMessage({ id: 'select-modal.token.title' })}
      onSearch={onSearch}
      placeholder={formatMessage({ id: 'select-modal.token.placeholder' })}
      isNoResult={isNoResult}
    >
      <Flex
        fontSize={'14px'}
        fontWeight={400}
        lineHeight="16px"
        color={theme.colors[colorMode].text.secondary}
        pb={'12px'}
        px={'20px'}
        justifyContent="space-between"
      >
        <Text>{formatMessage({ id: 'select-modal.token.column.name' })}</Text>
        {isConnected && <Text>{formatMessage({ id: 'select-modal.token.column.balance' })}</Text>}
      </Flex>
      <Flex flexDir="column" flex={1}>
        <VirtualList data={result} itemHeight={56} itemKey="id">
          {(item) => (
            <ListItem
              iconUrl={item.icon}
              isActive={isSameAddress(selectedToken?.address, item.address)}
              isDisabled={!isChainOrTokenCompatible(item)}
              onClick={() => {
                selectToken(item);
                onClose();
              }}
            >
              <Flex>{item.displaySymbol}</Flex>
            </ListItem>
          )}
        </VirtualList>
      </Flex>
    </BaseModal>
  );
}
