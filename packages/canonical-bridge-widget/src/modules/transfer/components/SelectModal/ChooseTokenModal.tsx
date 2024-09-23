import { Flex, formatAddress, Text, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

import { BaseModal } from '@/modules/transfer/components/SelectModal/components/BaseModal';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useTokens } from '@/modules/aggregator/hooks/useTokens';
import { useSearch } from '@/modules/transfer/components/SelectModal/hooks/useSearch';
import { VirtualList } from '@/core/components/VirtualList';
import { ListItem } from '@/modules/transfer/components/SelectModal/components/ListItem';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { isNativeToken, isSameAddress } from '@/core/utils/address';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { formatTokenUrl } from '@/core/utils/string';
import { useResponsive } from '@/core/hooks/useResponsive';
import { useTokenBalances } from '@/modules/transfer/components/SelectModal/hooks/useTokenBalances';
import { useTokenPrices } from '@/modules/transfer/components/SelectModal/hooks/useTokenPrices';
import { formatNumber } from '@/core/utils/number';

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

  const { isLoading, data: tokenBalances } = useTokenBalances(tokens, isOpen);
  const { data: tokenPrices } = useTokenPrices(tokens, isOpen);

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
        {isConnected && !isLoading && (
          <Text>{formatMessage({ id: 'select-modal.token.column.balance' })}</Text>
        )}
      </Flex>
      <Flex flexDir="column" flex={1}>
        <VirtualList data={result} itemHeight={64} itemKey="id">
          {(item) => {
            const isDisabled = !isChainOrTokenCompatible(item);
            const isActive = isSameAddress(selectedToken?.address, item.address);
            const isNative = isNativeToken(item.address);

            const rawBalance = tokenBalances?.[item.displaySymbol];
            const balance =
              rawBalance === undefined ? undefined : Number(formatUnits(rawBalance, item.decimals));
            const price = tokenPrices?.[item.displaySymbol];

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

                  {!isDisabled && !isLoading && (
                    <Flex flexShrink={0} flexDir="column" alignItems="flex-end" gap={'4px'}>
                      <Flex>{balance === undefined ? '-' : formatNumber(balance, 4)}</Flex>
                      <Flex
                        flexDir="column"
                        fontSize="12px"
                        fontWeight={500}
                        lineHeight="16px"
                        color={theme.colors[colorMode].text.secondary}
                      >
                        {balance && price ? `$${formatNumber(balance * price, 2)}` : ''}
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
    <Text
      as="a"
      href={formatTokenUrl(tokenUrlPattern, address)}
      target="_blank"
      rel="noopener noreferrer"
      isTruncated
      flexShrink={0}
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
  );
}
