import { Flex, useColorMode, useIntl, useTheme, Text } from '@bnb-chain/space';
import { useAccount } from 'wagmi';
import { TickIcon } from '@bnb-chain/icons';

import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useFromChains } from '@/modules/aggregator/hooks/useFromChains';
import { useEvmSwitchChain } from '@/modules/wallet/hooks/useEvmSwitchChain';
import { Dropdown } from '@/modules/wallet/components/Dropdown/Dropdown';
import { DropdownButton } from '@/modules/wallet/components/Dropdown/DropdownButton';
import { DropdownList } from '@/modules/wallet/components/Dropdown/DropdownList';
import { DropdownItem } from '@/modules/wallet/components/Dropdown/DropdownItem';

export function NetworkStatus() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { chain, chainId } = useAccount();
  const { formatMessage } = useIntl();
  const fromChains = useFromChains();
  const { switchChain } = useEvmSwitchChain();

  const bridgeChains = useFromChains();

  if (!chain) {
    return null;
  }

  const isWrongNetwork = !!fromChain && fromChain.id !== chain.id;
  const iconUrl = bridgeChains.find((e) => e.id === chain.id)?.icon;

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
              {fromChains.map((item) => {
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
                      if (chainId !== item.id) {
                        switchChain({
                          chainId: item.id,
                        });
                      }
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
