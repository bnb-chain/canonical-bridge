import { Flex, useColorMode, useIntl, useTheme, Text, Typography, Box } from '@bnb-chain/space';
import { useAccount } from 'wagmi';
import { TickIcon, WarningTriangleSolidIcon, InfoCircleIcon } from '@bnb-chain/icons';
import { useEffect, useRef } from 'react';

import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useFromChains } from '@/modules/aggregator/hooks/useFromChains';
import { useEvmSwitchChain } from '@/modules/wallet/hooks/useEvmSwitchChain';
import { Dropdown } from '@/modules/wallet/components/Dropdown/Dropdown';
import { DropdownButton } from '@/modules/wallet/components/Dropdown/DropdownButton';
import { DropdownList } from '@/modules/wallet/components/Dropdown/DropdownList';
import { DropdownItem } from '@/modules/wallet/components/Dropdown/DropdownItem';
import { TransferToIcon } from '@/core/components/icons/TransferToIcon';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';

export function NetworkStatus() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const thresholdRef = useRef(false);
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { chain, chainId } = useAccount();
  const { formatMessage } = useIntl();
  const fromChains = useFromChains();
  const { switchChain } = useEvmSwitchChain();
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
          <SwitchNetworkButton h={'40px'} mt={'16px'} fontSize={'14px'} />
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
              <DropdownButton isActive={isOpen} isWarning={true}>
                <WarningTriangleSolidIcon
                  boxSize={'24px'}
                  color={theme.colors[colorMode].support.warning['3']}
                />
                <Flex flexDir="column" gap="0" alignItems="flex-start" textAlign="left">
                  <Text fontSize="14px" noOfLines={1} fontWeight={500}>
                    {formatMessage({ id: 'wallet.network.unknown-network' })}
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
            <DropdownButton isActive={isOpen} isWarning={isWrongNetwork}>
              {isWrongNetwork ? (
                <WarningTriangleSolidIcon
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
            )}
          </>
        );
      }}
    </Dropdown>
  );
}
