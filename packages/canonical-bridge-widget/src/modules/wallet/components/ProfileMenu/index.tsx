import {
  Box,
  Center,
  Circle,
  Flex,
  IconButton,
  Typography,
  useColorMode,
  useTheme,
} from '@bnb-chain/space';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useAccount, useDisconnect } from 'wagmi';

import { CopyAddress } from '@/core/components/CopyAddress';
import { formatNumber } from '@/core/utils/number';
import { formatAppAddress } from '@/core/utils/address';
import { Dropdown } from '@/modules/wallet/components/Dropdown/Dropdown';
import { DropdownButton } from '@/modules/wallet/components/Dropdown/DropdownButton';
import { DropdownList } from '@/modules/wallet/components/Dropdown/DropdownList';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useEvmBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { useTronBalance } from '@/modules/wallet/hooks/useTronBalance';
import { useSolanaBalance } from '@/modules/wallet/hooks/useSolanaBalance';
import { ChainType } from '@/modules/aggregator';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { LogoutIcon } from '@/core/components/icons/LogoutIcon';

interface ProfileMenuProps {
  connectedWalletIcons?: Array<{ walletType: ChainType; icon: React.ReactNode }>;
}

export const ProfileMenu = (props: ProfileMenuProps) => {
  const { connectedWalletIcons } = props;

  const { colorMode } = useColorMode();
  const theme = useTheme();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const evmAccount = useAccount();
  const tronAccount = useTronAccount();
  const solanaAccount = useSolanaAccount();

  const evmBalance = useEvmBalance();
  const tronBalance = useTronBalance();
  const solanaBalance = useSolanaBalance();

  const { disconnect: evmDisconnect } = useDisconnect();
  const { disconnect: solanaDisconnect } = useSolanaWallet();
  const { disconnect: tronDisconnect } = useTronWallet();

  const options = [
    {
      walletType: 'evm',
      walletIcon: connectedWalletIcons?.find((e) => e.walletType === 'evm')?.icon,
      address: evmAccount.address,
      isConnected: evmAccount.isConnected,
      balance: evmBalance.data,
      disconnect: evmDisconnect,
    },
    {
      walletType: 'solana',
      walletIcon: connectedWalletIcons?.find((e) => e.walletType === 'solana')?.icon,
      address: solanaAccount.address,
      isConnected: solanaAccount.isConnected,
      balance: solanaBalance.data,
      disconnect: solanaDisconnect,
    },
    {
      walletType: 'tron',
      walletIcon: connectedWalletIcons?.find((e) => e.walletType === 'tron')?.icon,
      address: tronAccount.address,
      isConnected: tronAccount.isConnected,
      balance: tronBalance.data,
      disconnect: tronDisconnect,
    },
  ].filter((e) => e.isConnected);

  const fromChainWallet = options.find((e) => e.walletType === fromChain?.chainType)!;

  return (
    <Dropdown>
      {({ isOpen, onClose }) => (
        <>
          <DropdownButton
            className="bccb-widget-header-profile-button"
            bgColor={theme.colors[colorMode].layer[3].default}
            isActive={isOpen}
            pl={{ base: '0', md: '12px' }}
            pr={{ base: '0', md: '16px' }}
          >
            {/* Don't remove the below component, otherwise tron icon will be abnormal on mobile */}
            <Center
              boxSize={1}
              opacity={0}
              position="absolute"
              left={0}
              zIndex={-1}
              sx={{
                opacity: 0,
                boxSize: 1,
              }}
            >
              {fromChainWallet.walletIcon}
            </Center>
            {fromChainWallet.walletIcon && (
              <Circle
                overflow="hidden"
                sx={{
                  'svg, img': {
                    boxSize: '24px',
                  },
                }}
              >
                {fromChainWallet.walletIcon}
              </Circle>
            )}
            <Box display={{ base: 'none', md: 'block' }}>
              <Typography
                className="profile-address"
                as={'span'}
                variant={'label'}
                size={'md'}
                fontWeight={500}
              >
                {formatAppAddress({ address: fromChainWallet.address })}
              </Typography>
            </Box>
          </DropdownButton>

          <DropdownList className="bccb-widget-header-profile-list" overflowY="visible">
            <Flex alignItems="flex-start" p="12px" gap="12px" flexDir="column" w="240px">
              {options.map((item) => (
                <Flex
                  key={item.walletType}
                  gap="8px"
                  flexDir="column"
                  w="100%"
                  fontWeight={500}
                  fontSize={'12px'}
                  lineHeight="16px"
                >
                  <Flex gap="12px" alignItems="center">
                    <Flex color={theme.colors[colorMode].text.placeholder}>
                      {item.walletType.toUpperCase()}
                    </Flex>
                    <Flex
                      flex={1}
                      borderTop="1px solid"
                      borderColor={theme.colors[colorMode].popover.separator}
                    />
                  </Flex>
                  <Flex alignItems="center">
                    {item.walletIcon && (
                      <Center
                        boxSize={'32px'}
                        mr="8px"
                        borderRadius={'8px'}
                        overflow="hidden"
                        sx={{
                          'svg, img': {
                            boxSize: '100%',
                          },
                        }}
                      >
                        {item.walletIcon}
                      </Center>
                    )}
                    <Flex flexDir="column" flex={1}>
                      <Flex fontWeight={700} fontSize={'14px'}>
                        {formatAppAddress({ address: item.address })}
                      </Flex>
                      <Flex color={theme.colors[colorMode].text.secondary}>
                        {formatNumber(Number(item.balance?.formatted), 4)} {item?.balance?.symbol}
                      </Flex>
                    </Flex>
                    <Flex alignItems="center" gap="8px">
                      <CopyAddress content={item.address} />
                      <IconButton
                        className="bccb-widget-header-profile-disconnect-link"
                        variant="outline"
                        boxSize={'24px'}
                        minW={'24px'}
                        icon={<LogoutIcon />}
                        cursor={'pointer'}
                        borderColor={theme.colors[colorMode].button.primary.subtle}
                        color={theme.colors[colorMode].text.secondary}
                        borderRadius={'4px'}
                        _hover={{
                          color: theme.colors[colorMode].text.inverse,
                          bg: theme.colors[colorMode].button.primary.hover,
                        }}
                        onClick={() => {
                          item.disconnect();
                          onClose();
                        }}
                        aria-label={''}
                      ></IconButton>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </DropdownList>
        </>
      )}
    </Dropdown>
  );
};
