import { Flex, useColorMode, useIntl, useTheme, Text, Typography, Box } from '@bnb-chain/space';
import { TickIcon, InfoCircleIcon } from '@bnb-chain/icons';
import { useEffect, useRef } from 'react';

import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { Dropdown } from '@/modules/wallet/components/Dropdown/Dropdown';
import { DropdownButton } from '@/modules/wallet/components/Dropdown/DropdownButton';
import { DropdownList } from '@/modules/wallet/components/Dropdown/DropdownList';
import { DropdownItem } from '@/modules/wallet/components/Dropdown/DropdownItem';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';
import { useFromChains } from '@/modules/aggregator/hooks/useFromChains';
import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { TransferToIcon } from '@/core/components/icons/TransferToIcon';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
import { WarningIcon } from '@/core/components/icons/WarningIcon.tsx';
import { SwitchWalletButton } from '@/modules/transfer/components/Button/SwitchWalletButton';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon.tsx';
import { openLink } from '@/core/utils/common.ts';

export function NetworkStatus() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { formatMessage } = useIntl();
  const thresholdRef = useRef(false);
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const { chain, chainId, linkWallet, walletType } = useCurrentWallet();
  const fromChains = useFromChains();

  const { chainConfigs } = useAggregator();
  const supportedChains = fromChains.filter((c) => chainConfigs.find((e) => c.id === e.id));
  const bridgeChains = useFromChains();

  useEffect(() => {
    thresholdRef.current = true;
    setTimeout(() => {
      thresholdRef.current = false;
    }, 1000);
  }, [chainId]);

  const switchDropdown = (onClose: () => void) => (
    <DropdownList maxW={'240px'}>
      <Flex flexDir={'column'} alignItems={'center'} padding={'16px'} gap={'8px'}>
        <Typography
          color={theme.colors[colorMode].text.secondary}
          variant={'label'}
          size={'md'}
          display={'flex'}
          align={'center'}
          gap={'4px'}
        >
          <InfoCircleIcon boxSize={'16px'} color={theme.colors[colorMode].text.tertiary} />
          {formatMessage({ id: 'wallet.network.switch-network' })}
        </Typography>
        <TransferToIcon w={'24px'} h={'24px'} transform={'rotate(90deg)'} />

        <Flex
          maxW={'100%'}
          borderRadius={'24px'}
          padding={'4px'}
          pr={'8px'}
          alignItems={'center'}
          justifyContent={'center'}
          bg={theme.colors[colorMode].support.primary['4']}
          gap={'8px'}
        >
          <IconImage src={fromChain!.icon} boxSize="24px" flexShrink={0} />
          <Flex flex={1} flexShrink={0} noOfLines={1}>
            {fromChain!.name}
          </Flex>
        </Flex>

        <Box onClick={onClose} w={'100%'}>
          {walletType !== fromChain?.chainType ? (
            <SwitchWalletButton h={'40px'} mt={'16px'} fontSize={'14px'} />
          ) : (
            <SwitchNetworkButton h={'40px'} mt={'16px'} fontSize={'14px'} />
          )}
        </Box>
      </Flex>
    </DropdownList>
  );

  if (!chain) {
    if (!chainId || !fromChain) return null;

    return (
      <Dropdown>
        {({ isOpen, onClose }) => {
          return (
            <>
              <DropdownButton isActive={isOpen} isWarning={isOpen}>
                <WarningIcon
                  boxSize={'24px'}
                  color={theme.colors[colorMode].support.warning['3']}
                />
                <Flex flexDir="column" gap="0" alignItems="flex-start" textAlign="left">
                  <Text
                    fontSize="14px"
                    noOfLines={1}
                    fontWeight={500}
                    display={{ base: 'none', md: 'block' }}
                  >
                    {formatMessage({ id: 'wallet.network.unknown-network' })}
                  </Text>
                  <Text
                    fontSize="14px"
                    noOfLines={1}
                    fontWeight={500}
                    display={{ base: 'block', md: 'none' }}
                  >
                    {formatMessage({ id: 'wallet.network.unknown-network-mobile' })}
                  </Text>
                </Flex>
              </DropdownButton>

              {switchDropdown(onClose)}
            </>
          );
        }}
      </Dropdown>
    );
  }

  const isWrongNetwork = !!fromChain && fromChain.id !== chain.id && !thresholdRef.current;
  const iconUrl = bridgeChains.find((e) => e.id === chain.id)?.icon;

  return (
    <Dropdown>
      {({ isOpen, onClose }) => {
        return (
          <>
            <DropdownButton isActive={isOpen} isWarning={isOpen && isWrongNetwork}>
              {isWrongNetwork ? (
                <WarningIcon
                  boxSize={'24px'}
                  color={theme.colors[colorMode].support.warning['3']}
                />
              ) : (
                <IconImage src={iconUrl} boxSize="24px" />
              )}
              <Flex flexDir="column" gap="0" alignItems="flex-start" textAlign="left">
                <Text fontSize="14px" noOfLines={1}>
                  {chain.name}
                </Text>
              </Flex>
            </DropdownButton>

            {isWrongNetwork ? (
              switchDropdown(onClose)
            ) : (
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
                        if (item.chainType === 'link') {
                          openLink(item.externalBridgeUrl);
                          return;
                        }
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
                      {item.chainType === 'link' && (
                        <ExLinkIcon
                          ml={'4px'}
                          color={theme.colors[colorMode].text.secondary}
                          boxSize={theme.sizes['4']}
                        />
                      )}
                      {isSelected && <TickIcon boxSize={'16px'} />}
                    </DropdownItem>
                  );
                })}
              </DropdownList>
            )}
          </>
        );
      }}
    </Dropdown>
  );
}
