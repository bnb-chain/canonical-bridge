import { Flex, useColorMode, useIntl, useTheme, Text, Typography, Box } from '@bnb-chain/space';
import { TickIcon, InfoCircleIcon } from '@bnb-chain/icons';
import { useAccount } from 'wagmi';
import { useMemo, useRef } from 'react';
import { ChainType } from '@bnb-chain/canonical-bridge-sdk';

import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { Dropdown } from '@/modules/wallet/components/Dropdown/Dropdown';
import { DropdownButton } from '@/modules/wallet/components/Dropdown/DropdownButton';
import { DropdownList } from '@/modules/wallet/components/Dropdown/DropdownList';
import { DropdownItem } from '@/modules/wallet/components/Dropdown/DropdownItem';
import { TransferToIcon } from '@/core/components/icons/TransferToIcon';
import { SwitchNetworkButton } from '@/modules/transfer/components/Button/SwitchNetworkButton';
import { WarningIcon } from '@/core/components/icons/WarningIcon.tsx';
import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon.tsx';
import { openLink } from '@/core/utils/common.ts';
import { WalletConnectButton } from '@/modules/transfer/components/Button/WalletConnectButton';
import { useSolanaAccount, useTronAccount } from '@/index';
import { useNeedSwitchChain } from '@/modules/wallet/hooks/useNeedSwitchChain';
import { useAutoSelectFromChain } from '@/modules/wallet/hooks/useAutoSelectFromChain';
import { useFromChains } from '@/modules/aggregator/hooks/useFromChains';

export interface NetworkListProps {
  onClickNetwork?: (params: { chainType: ChainType; chainId: number }) => void;
}

export function NetworkList(props: NetworkListProps) {
  const { onClickNetwork } = props;

  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const supportedChains = useFromChains();

  const { needSwitchChain } = useNeedSwitchChain();

  const isPendingRef = useRef(false);
  const timerRef = useRef<any>();
  const { autoSelectFromChain } = useAutoSelectFromChain({
    onPending() {
      clearTimeout(timerRef.current);
      isPendingRef.current = true;

      // TODO
      timerRef.current = setTimeout(() => {
        isPendingRef.current = false;
      }, 60 * 1000);
    },
    onSettle() {
      timerRef.current = setTimeout(() => {
        isPendingRef.current = false;
      }, 1000);
    },
  });
  const { walletChain, hasWalletConnected } = useFromChainConnectedInfo();

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
    if (!hasWalletConnected) return null;

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

  const isWrongNetwork = needSwitchChain && !isPendingRef.current;

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
                <IconImage
                  src={walletChain.icon}
                  boxSize="24px"
                  overflow="hidden"
                  borderRadius="100%"
                />
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
                        if (onClickNetwork) {
                          onClickNetwork?.({
                            chainType: item.chainType,
                            chainId: item.id,
                          });
                        } else {
                          autoSelectFromChain({
                            chainType: item.chainType,
                            chainId: item.id,
                          });
                        }
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

export function useFromChainConnectedInfo() {
  const supportedChains = useFromChains();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const evmAccount = useAccount();
  const tronAccount = useTronAccount();
  const solanaAccount = useSolanaAccount();

  const walletChain = useMemo(() => {
    const evmChain = supportedChains.find(
      (e) => e.chainType === 'evm' && e.id === evmAccount.chainId,
    );
    const tronChain = supportedChains.find(
      (e) => e.chainType === 'tron' && e.id === tronAccount.chainId,
    );
    const solanaChain = supportedChains.find(
      (e) => e.chainType === 'solana' && e.id === solanaAccount.chainId,
    );

    if (fromChain?.chainType === 'evm') return evmChain;
    if (fromChain?.chainType === 'tron') return tronChain;
    if (fromChain?.chainType === 'solana') return solanaChain;
  }, [
    evmAccount.chainId,
    fromChain?.chainType,
    solanaAccount.chainId,
    supportedChains,
    tronAccount.chainId,
  ]);

  return {
    walletChain,
    hasWalletConnected:
      evmAccount.isConnected || tronAccount.isConnected || !!solanaAccount.isConnected,
  };
}
