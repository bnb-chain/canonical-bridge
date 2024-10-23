import { Flex, useColorMode, useIntl, useTheme, Text } from '@bnb-chain/space';
import { TickIcon } from '@bnb-chain/icons';

import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { Dropdown } from '@/modules/wallet/components/Dropdown/Dropdown';
import { DropdownButton } from '@/modules/wallet/components/Dropdown/DropdownButton';
import { DropdownList } from '@/modules/wallet/components/Dropdown/DropdownList';
import { DropdownItem } from '@/modules/wallet/components/Dropdown/DropdownItem';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';
import { useFromChains } from '@/modules/aggregator/hooks/useFromChains';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function NetworkStatus() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const { chain, chainId, linkWallet } = useCurrentWallet();
  const fromChains = useFromChains();

  const isWrongNetwork = !!fromChain && fromChain.id !== chainId;

  const { chainConfigs } = useAggregator();
  const supportedChains = fromChains.filter((c) => chainConfigs.find((e) => c.id === e.id));
  const iconUrl = supportedChains.find((e) => e.id === chainId)?.icon;

  if (!chain) {
    return null;
  }

  return (
    <Dropdown>
      {({ isOpen }) => {
        return (
          <>
            <DropdownButton isActive={isOpen} isWarning={isWrongNetwork}>
              <IconImage src={iconUrl} boxSize="24px" />
              <Flex flexDir="column" gap="0" alignItems="flex-start" textAlign="left">
                <Text fontSize="14px" noOfLines={1}>
                  {chain.name}
                </Text>
                {isWrongNetwork && (
                  <Text
                    color={theme.colors[colorMode].support.warning['3']}
                    fontSize={'12px'}
                    fontWeight={400}
                    noOfLines={1}
                  >
                    {formatMessage({ id: 'wallet.network.wrong-network' })}
                  </Text>
                )}
              </Flex>
            </DropdownButton>

            <DropdownList>
              {supportedChains.map((item) => {
                const isSelected = chainId === item.id;

                return (
                  <DropdownItem
                    key={item.id}
                    color={
                      isSelected
                        ? theme.colors[colorMode].text.primary
                        : theme.colors[colorMode].text.secondary
                    }
                    bg={isSelected ? theme.colors[colorMode].popover.selected : undefined}
                    onClick={() => {
                      linkWallet({
                        targetChainType: item.chainType,
                        targetChainId: item.id,
                      });
                    }}
                  >
                    <IconImage src={item.icon} boxSize="16px" flexShrink={0} />
                    <Flex flex={1} flexShrink={0} noOfLines={1}>
                      {item.name}
                    </Flex>
                    {isSelected && <TickIcon boxSize={'16px'} />}
                  </DropdownItem>
                );
              })}
            </DropdownList>
          </>
        );
      }}
    </Dropdown>
  );
}
