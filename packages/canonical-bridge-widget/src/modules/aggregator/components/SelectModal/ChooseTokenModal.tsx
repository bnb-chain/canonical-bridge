import { Flex, formatAddress, Text, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useAccount } from 'wagmi';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useTokens } from '@/modules/aggregator/hooks/useTokens';
import { VirtualList } from '@/core/components/VirtualList';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { isNativeToken, isSameAddress } from '@/core/utils/address';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { formatTokenUrl } from '@/core/utils/string';
import { useResponsive } from '@/core/hooks/useResponsive';
import { formatNumber } from '@/core/utils/number';
import { reportEvent } from '@/core/utils/gtm';
import { BaseModal } from '@/modules/aggregator/components/SelectModal/components/BaseModal';
import { useSearch } from '@/modules/aggregator/components/SelectModal/hooks/useSearch';
import { useTokenList } from '@/modules/aggregator/components/SelectModal/hooks/useTokenList';
import { ListItem } from '@/modules/aggregator/components/SelectModal/components/ListItem';

interface ChooseTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChooseTokenModal(props: ChooseTokenModalProps) {
  const { isOpen, onClose } = props;
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { isConnected } = useAccount();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const { isMobile } = useResponsive();
  const { selectToken } = useSelection();

  const tokens = useTokens({
    fromChainId: fromChain?.id,
    toChainId: toChain?.id,
  });

  const { isNoResult, result, onSearch } = useSearch({
    data: tokens,
    filter: (item, keyword) => {
      return (
        item.displaySymbol.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword)
      );
    },
  });

  const { isLoading, data } = useTokenList(result);
  const activeIndex = data.findIndex((item) => isSameAddress(selectedToken?.address, item.address));
  const showBalance = isConnected && !isLoading;

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
        {showBalance && <Text>{formatMessage({ id: 'select-modal.token.column.balance' })}</Text>}
      </Flex>
      <Flex flexDir="column" flex={1}>
        <VirtualList data={data} itemHeight={64} itemKey="address">
          {(item, index) => {
            const isDisabled = !isChainOrTokenCompatible(item);
            const isActive = index === activeIndex;
            const isNative = isNativeToken(item.address);

            return (
              <ListItem
                iconUrl={item.icon}
                isActive={isActive}
                isDisabled={isDisabled}
                incompatibleTooltip={formatMessage({
                  id: 'select-modal.token.incompatible.tooltip',
                })}
                _hover={{
                  '.token-info': {
                    transform: 'translateY(-100%)',
                  },
                }}
                onClick={() => {
                  selectToken(item);
                  onClose();
                  reportEvent({
                    id: 'select_bridge_fromDropdown',
                    params: {
                      item_name: fromChain?.name || '',
                      token: item?.symbol,
                    },
                  });
                }}
              >
                <Flex alignItems="center" justifyContent="space-between" w="100%" gap={'12px'}>
                  <Flex flex={1} minW={0} flexDir="column" gap={'4px'}>
                    <Text isTruncated>{item.displaySymbol}</Text>

                    {isMobile && !isNative && (
                      <TokenAddress
                        tokenUrlPattern={fromChain?.tokenUrlPattern}
                        address={item.address}
                      />
                    )}

                    {!isMobile && (
                      <Flex h="16px" overflow="hidden">
                        <Flex
                          flexDir="column"
                          className={isNative || isActive ? undefined : 'token-info'}
                          transitionDuration="normal"
                          whiteSpace="nowrap"
                          fontSize="12px"
                          fontWeight={500}
                          lineHeight="16px"
                          w="100%"
                          color={theme.colors[colorMode].text.secondary}
                        >
                          {(!isActive || isNative) && (
                            <Text isTruncated flexShrink={0}>
                              {item.name}
                            </Text>
                          )}
                          {!isNative && (
                            <TokenAddress
                              tokenUrlPattern={fromChain?.tokenUrlPattern}
                              address={item.address}
                            />
                          )}
                        </Flex>
                      </Flex>
                    )}
                  </Flex>

                  {!isDisabled && showBalance && (
                    <Flex
                      flexShrink={0}
                      flexDir="column"
                      alignItems="flex-end"
                      gap={'4px'}
                      alignSelf="flex-start"
                    >
                      <Flex>
                        {item.balance !== undefined ? formatNumber(item.balance, 4) : '-'}
                      </Flex>
                      <Flex
                        flexDir="column"
                        fontSize="12px"
                        fontWeight={500}
                        lineHeight="16px"
                        color={theme.colors[colorMode].text.secondary}
                      >
                        {item.value ? `$${formatNumber(item.value, 2)}` : ''}
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </ListItem>
            );
          }}
        </VirtualList>
      </Flex>
    </BaseModal>
  );
}

interface TokenAddressProps {
  address: string;
  tokenUrlPattern?: string;
}

function TokenAddress(props: TokenAddressProps) {
  const { address, tokenUrlPattern } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();

  return (
    <Flex>
      <Text
        as="a"
        href={formatTokenUrl(tokenUrlPattern, address)}
        target="_blank"
        rel="noopener noreferrer"
        isTruncated
        flexShrink={0}
        display="inline-flex"
        alignItems="center"
        onClick={(e) => e.stopPropagation()}
      >
        {formatAddress({
          value: address,
        })}
        <ExLinkIcon
          ml="4px"
          color={theme.colors[colorMode].text.secondary}
          boxSize={theme.sizes['4']}
        />
      </Text>
    </Flex>
  );
}
