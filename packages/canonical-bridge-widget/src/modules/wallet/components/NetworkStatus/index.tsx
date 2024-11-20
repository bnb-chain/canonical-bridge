import { Flex, useColorMode, useIntl, useTheme, Text, Typography, Box } from '@bnb-chain/space';
import { TickIcon, InfoCircleIcon } from '@bnb-chain/icons';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';

import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { Dropdown } from '@/modules/wallet/components/Dropdown/Dropdown';
import { DropdownButton } from '@/modules/wallet/components/Dropdown/DropdownButton';
import { DropdownList } from '@/modules/wallet/components/Dropdown/DropdownList';
import { DropdownItem } from '@/modules/wallet/components/Dropdown/DropdownItem';
import { useFromChains } from '@/modules/aggregator/hooks/useFromChains';
import { TransferToIcon } from '@/core/components/icons/TransferToIcon';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
import { WarningIcon } from '@/core/components/icons/WarningIcon.tsx';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon.tsx';
import { openLink } from '@/core/utils/common.ts';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { IBridgeChain, useBridgeConfig, useSolanaAccount, useTronAccount } from '@/index';
import { useNeedSwitchChain } from '@/modules/wallet/hooks/useNeedSwitchChain';
import { useIsWalletCompatible } from '@/modules/wallet/hooks/useIsWalletCompatible';

export function NetworkStatus() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const { needSwitchChain } = useNeedSwitchChain();
  const isWalletCompatible = useIsWalletCompatible();

  const supportedChains = useFromChains();
  const { onClickConnectWallet } = useBridgeConfig();

  const { walletChain, hasOtherWalletConnected } = useFromChainConnectedInfo(supportedChains);

  const switchDropdown = (onClose: () => void) => (
    <DropdownList className="bccb-widget-header-network-status" maxW={'240px'}>
      <Flex flexDir={'column'} alignItems={'center'} padding={'16px'} gap={'8px'}>
        <Typography
          className="bccb-widget-header-network-status-title"
          color={theme.colors[colorMode].text.secondary}
          variant={'label'}
          size={'md'}
          display={'flex'}
          align={'center'}
          gap={'4px'}
        >
          <InfoCircleIcon boxSize={'16px'} color={theme.colors[colorMode].text.tertiary} />
          {needSwitchChain
            ? formatMessage({ id: 'wallet.network.switch-network' })
            : formatMessage({ id: 'wallet.network.connect-wallet' })}
        </Typography>
        <TransferToIcon w={'24px'} h={'24px'} transform={'rotate(90deg)'} />

        <Flex
          className="bccb-widget-header-network-status-network"
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
          <Typography
            as={'div'}
            display={'flex'}
            flex={1}
            flexShrink={0}
            noOfLines={1}
            variant={'label'}
            size={'md'}
            gap={'4px'}
          >
            {fromChain!.name}
          </Typography>
        </Flex>

        <Box onClick={onClose} w={'100%'}>
          {needSwitchChain ? (
            <SwitchNetworkButton h={'40px'} mt={'16px'} fontSize={'14px'} />
          ) : (
            <WalletConnectButton h={'40px'} mt={'16px'} fontSize={'14px'} />
          )}
        </Box>
      </Flex>
    </DropdownList>
  );

  if (!walletChain) {
    if (!hasOtherWalletConnected) return null;

    return (
      <Dropdown>
        {({ isOpen, onClose }) => {
          return (
            <>
              <DropdownButton
                className="bccb-widget-header-dropdown-button-not-connect"
                bgColor={theme.colors[colorMode].layer[3].default}
                isActive={isOpen}
                isWarning={isOpen}
              >
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

  const isWrongNetwork = needSwitchChain || !isWalletCompatible;

  return (
    <Dropdown>
      {({ isOpen, onClose }) => {
        return (
          <>
            <DropdownButton
              className="bccb-widget-header-dropdown-button"
              bgColor={theme.colors[colorMode].layer[3].default}
              isActive={isOpen}
              isWarning={isOpen && isWrongNetwork}
            >
              {isWrongNetwork ? (
                <WarningIcon
                  boxSize={'24px'}
                  color={theme.colors[colorMode].support.warning['3']}
                />
              ) : (
                <IconImage src={walletChain.icon} boxSize="24px" />
              )}
              <Flex
                className="chain-name"
                flexDir="column"
                gap="0"
                alignItems="flex-start"
                textAlign="left"
              >
                <Text fontSize="14px" noOfLines={1}>
                  {walletChain.name}
                </Text>
              </Flex>
            </DropdownButton>

            {isWrongNetwork ? (
              switchDropdown(onClose)
            ) : (
              <DropdownList>
                {supportedChains.map((item) => {
                  const isSelected = fromChain?.id === item.id;

                  return (
                    <DropdownItem
                      className={`bccb-widget-header-menu-item` + (isSelected ? '-selected' : '')}
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
                        onClickConnectWallet({
                          chainType: item.chainType,
                          chainId: item.id,
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

export function useFromChainConnectedInfo(supportedChains: IBridgeChain[]) {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const evmAccount = useAccount();
  const tronAccount = useTronAccount();
  const solanaAccount = useSolanaAccount();

  const evmChain = supportedChains.find(
    (e) => e.chainType === 'evm' && e.id === evmAccount.chainId,
  );
  const tronChain = supportedChains.find(
    (e) => e.chainType === 'tron' && e.id === tronAccount.chainId,
  );
  const solanaChain = supportedChains.find(
    (e) => e.chainType === 'solana' && e.id === solanaAccount.chainId,
  );

  const walletChain = useMemo(() => {
    if (fromChain?.chainType === 'evm') return evmChain;
    if (fromChain?.chainType === 'tron') return tronChain;
    if (fromChain?.chainType === 'solana') return solanaChain;
  }, [evmChain, fromChain?.chainType, solanaChain, tronChain]);

  return {
    walletChain,
    hasOtherWalletConnected: !!evmChain || !!tronChain || !!solanaChain,
  };
}
