import { Flex, formatAddress, Text, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
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
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { formatTokenUrl } from '@/core/utils/string';

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
        {/* {isConnected && <Text>{formatMessage({ id: 'select-modal.token.column.balance' })}</Text>} */}
      </Flex>
      <Flex flexDir="column" flex={1}>
        <VirtualList data={result} itemHeight={56} itemKey="id">
          {(item) => {
            const isDisabled = !isChainOrTokenCompatible(item);
            const isActive = isSameAddress(selectedToken?.address, item.address);

            const showAddressStyle = {
              '.token-info': {
                transform: 'translateY(-100%)',
              },
            };

            return (
              <ListItem
                iconUrl={item.icon}
                isActive={isActive}
                isDisabled={isDisabled}
                onClick={() => {
                  selectToken(item);
                  onClose();
                }}
                sx={isActive ? showAddressStyle : {}}
                _hover={showAddressStyle}
              >
                <Flex alignItems="center" justifyContent="space-between" flex={1} gap={'8px'}>
                  <Flex w="50%" flexDir="column" gap={'4px'}>
                    <Flex>{item.displaySymbol}</Flex>
                    <Flex
                      fontSize="12px"
                      fontWeight={500}
                      lineHeight="16px"
                      color={theme.colors[colorMode].text.secondary}
                      h="16px"
                      overflow="hidden"
                    >
                      <Flex
                        flexDir="column"
                        className="token-info"
                        transitionDuration="normal"
                        whiteSpace="nowrap"
                      >
                        <Flex>{item.name}</Flex>
                        <Flex
                          as="a"
                          href={formatTokenUrl(fromChain?.tokenUrlPattern, item.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {formatAddress({
                            value: item.address,
                          })}
                          <ExLinkIcon
                            ml="4px"
                            color={theme.colors[colorMode].text.secondary}
                            boxSize={theme.sizes['4']}
                          />
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                  {/* 
                  {!isDisabled && (
                    <Flex w="50%" flexDir="column" alignItems="flex-end" gap={'4px'}>
                      <Flex>0</Flex>
                      <Flex
                        flexDir="column"
                        fontSize="12px"
                        fontWeight={500}
                        lineHeight="16px"
                        color={theme.colors[colorMode].text.secondary}
                      >
                        -
                      </Flex>
                    </Flex>
                  )} */}
                </Flex>
              </ListItem>
            );
          }}
        </VirtualList>
      </Flex>
    </BaseModal>
  );
}
