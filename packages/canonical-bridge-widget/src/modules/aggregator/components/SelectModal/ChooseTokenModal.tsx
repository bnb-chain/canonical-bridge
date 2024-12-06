import { Flex, Text, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { useAccount } from 'wagmi';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useTokens } from '@/modules/aggregator/hooks/useTokens';
import { VirtualList } from '@/core/components/VirtualList';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { formatAppAddress, isNativeToken, isSameAddress } from '@/core/utils/address';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { formatTokenUrl } from '@/core/utils/string';
import { useResponsive } from '@/core/hooks/useResponsive';
import { formatNumber } from '@/core/utils/number';
import { reportEvent } from '@/core/utils/gtm';
import { BaseModal } from '@/modules/aggregator/components/SelectModal/components/BaseModal';
import { useSearch } from '@/modules/aggregator/components/SelectModal/hooks/useSearch';
import { useTokenList } from '@/modules/aggregator/components/SelectModal/hooks/useTokenList';
import { ListItem } from '@/modules/aggregator/components/SelectModal/components/ListItem';
import { openLink } from '@/core/utils/common';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';

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

  const { isMobile } = useResponsive();
  const { selectToken } = useSelection();

  const tokens = useTokens({
    fromChainId: fromChain?.id,
    toChainId: toChain?.id,
  });

  const { isNoResult, result, keyword, onSearch } = useSearch({
    data: tokens,
    filter: (item, keyword) => {
      return (
        item.displaySymbol?.toLowerCase().includes(keyword?.toLowerCase()) ||
        item.name?.toLowerCase().includes(keyword?.toLowerCase()) ||
        isSameAddress(item.address, keyword)
      );
    },
  });

  const { isLoading, data } = useTokenList(result, keyword);

  const evmAccount = useAccount();
  const tronAccount = useTronAccount();
  const solanaAccount = useSolanaAccount();

  const showBalance =
    !isLoading &&
    ((fromChain?.chainType === 'evm' && evmAccount.isConnected) ||
      (fromChain?.chainType === 'tron' && tronAccount.isConnected) ||
      (fromChain?.chainType === 'solana' && solanaAccount.isConnected));

  return (
    <BaseModal
      className="bccb-widget-token-modal"
      isOpen={isOpen}
      onClose={onClose}
      title={formatMessage({ id: 'select-modal.token.title' })}
      onSearch={onSearch}
      placeholder={formatMessage({ id: 'select-modal.token.placeholder' })}
      isNoResult={isNoResult}
    >
      {showBalance && (
        <Flex
          className="bccb-widget-token-modal-list-header"
          fontSize={'14px'}
          fontWeight={400}
          lineHeight="16px"
          color={theme.colors[colorMode].text.secondary}
          pb={'12px'}
          px={'20px'}
          justifyContent="space-between"
        >
          <Text>{formatMessage({ id: 'select-modal.token.column.name' })}</Text>
          <Text>{formatMessage({ id: 'select-modal.token.column.balance' })}</Text>
        </Flex>
      )}
      <Flex flexDir="column" flex={1}>
        <VirtualList className="bccb-widget-token-virtual-list" data={data} itemHeight={52}>
          {(item) => {
            const isDisabled = !isChainOrTokenCompatible(item);
            const isActive =
              isSameAddress(item.address, selectedToken?.address) && isChainOrTokenCompatible(item);
            const isNative = isNativeToken(item.address, fromChain?.chainType);

            return (
              <ListItem
                className={
                  `bccb-widget-token-list-item` +
                  (isActive ? '-active' : isDisabled ? '-disabled' : '')
                }
                key={item.address}
                iconUrl={item.icon}
                isActive={isActive}
                isDisabled={isDisabled}
                data-address={item.address}
                incompatibleTooltip={formatMessage({
                  id: 'select-modal.token.incompatible.tooltip',
                })}
                _hover={{
                  '.token-info': {
                    transform: 'translateY(-100%)',
                  },
                }}
                onClick={() => {
                  reportEvent({
                    id: 'select_bridge_tokenDropdown',
                    params: {
                      item_name: item?.displaySymbol ?? item?.symbol,
                    },
                  });

                  selectToken(item);
                  onClose();
                }}
              >
                <Flex alignItems="center" justifyContent="space-between" w="100%" gap={'12px'}>
                  <Flex flex={1} minW={0} flexDir="column" gap={'0'}>
                    <Text className="bccb-widget-token-list-symbol" isTruncated>
                      {item.displaySymbol}
                    </Text>

                    {isMobile && !isNative && (
                      <TokenAddress
                        tokenUrlPattern={fromChain?.tokenUrlPattern}
                        address={item.address}
                      />
                    )}

                    {!isMobile && (
                      <Flex className="bccb-widget-token-address-link" h="16px" overflow="hidden">
                        <Flex
                          flexDir="column"
                          className={isNative ? undefined : 'token-info'}
                          transitionDuration="normal"
                          whiteSpace="nowrap"
                          w="100%"
                          color={theme.colors[colorMode].text.secondary}
                        >
                          <Text
                            className="token-name"
                            isTruncated
                            flexShrink={0}
                            fontSize="12px"
                            fontWeight={500}
                            lineHeight="16px"
                          >
                            {item.name}
                          </Text>
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
                      className="bccb-widget-token-list-token-balance"
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
  const { isMobile } = useResponsive();

  return (
    <Flex className="bccb-widget-token-list-address">
      <Text
        isTruncated
        flexShrink={0}
        display="inline-flex"
        alignItems="center"
        fontSize="12px"
        fontWeight={500}
        lineHeight="16px"
      >
        {formatAppAddress({
          address,
        })}
        {!isMobile && (
          <ExLinkIcon
            ml="4px"
            color={theme.colors[colorMode].text.secondary}
            boxSize={theme.sizes['4']}
            transitionDuration="normal"
            _hover={{
              color: theme.colors[colorMode].text.primary,
            }}
            onClick={(e) => {
              if (!isMobile) {
                e.stopPropagation();

                const url = formatTokenUrl(tokenUrlPattern, address);
                openLink(url);
              }
            }}
          />
        )}
      </Text>
    </Flex>
  );
}
