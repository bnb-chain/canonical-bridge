import { Box, Center, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { DisconnectIcon } from '@bnb-chain/icons';
import { useAccount, useDisconnect } from 'wagmi';
import { useWalletKit } from '@node-real/walletkit';
import { useMemo } from 'react';

import { CopyAddress } from '@/core/components/CopyAddress';
import { formatNumber } from '@/core/utils/number';
import { formatAppAddress } from '@/core/utils/address';
import { useEvmBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { Dropdown } from '@/modules/wallet/components/Dropdown/Dropdown';
import { DropdownButton } from '@/modules/wallet/components/Dropdown/DropdownButton';
import { DropdownList } from '@/modules/wallet/components/Dropdown/DropdownList';

export const ProfileMenu = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const { data: balance } = useEvmBalance(address);
  const { disconnect } = useDisconnect();

  const walletIcon = useWalletIcon();
  const theme = useTheme();

  return (
    <Dropdown>
      {({ isOpen, onClose }) => (
        <>
          <DropdownButton
            isActive={isOpen}
            pl={{ base: '0', md: '12px' }}
            pr={{ base: '0', md: '16px' }}
          >
            {walletIcon && (
              <Center
                sx={{
                  'svg, img': {
                    boxSize: '24px',
                  },
                }}
              >
                {walletIcon}
              </Center>
            )}
            <Box display={{ base: 'none', md: 'block' }}>{formatAppAddress({ address })}</Box>
          </DropdownButton>

          <DropdownList overflowY="visible" minW="240px">
            <Flex alignItems="center" p="16px 16px 12px">
              <Flex gap="12px">
                <Center
                  sx={{
                    'svg, img': {
                      boxSize: '32px',
                    },
                  }}
                >
                  {walletIcon}
                </Center>

                <Flex flexDir="column">
                  <Flex gap="4px" alignItems="center">
                    {formatAppAddress({ address })}
                    <CopyAddress boxSize={'20px'} content={address} />
                  </Flex>
                  <Flex color={theme.colors[colorMode].text.secondary}>
                    {formatNumber(Number(balance?.formatted), 4)} {balance?.symbol}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>

            <Flex
              borderTop={`1px solid ${theme.colors[colorMode].popover.separator}`}
              py="8px"
              onClick={() => {
                disconnect();
                onClose();
              }}
            >
              <Flex
                h="40px"
                alignItems="center"
                w="100%"
                gap="8px"
                cursor="pointer"
                fontSize={'14px'}
                lineHeight={'16px'}
                fontWeight={400}
                color={theme.colors[colorMode].text.danger}
                transitionDuration="normal"
                _hover={{
                  bg: theme.colors[colorMode].popover.selected,
                  color: theme.colors[colorMode].text.primary,
                }}
                px="16px"
              >
                <DisconnectIcon boxSize={'16px'} />
                {formatMessage({ id: 'wallet.popover.disconnect' })}
              </Flex>
            </Flex>
          </DropdownList>
        </>
      )}
    </Dropdown>
  );
};

function useWalletIcon() {
  const { connector } = useAccount();
  const { colorMode } = useColorMode();
  const { wallets } = useWalletKit();

  const icon = useMemo(() => {
    const selectedWallet = wallets.find(
      (item) => item.id === connector?.id || item.name === connector?.name,
    );

    if (selectedWallet) {
      const { transparent: transparentLogos } = selectedWallet.logos ?? {};
      const transparentLogo = (transparentLogos as any)?.[colorMode] ?? transparentLogos;
      return transparentLogo;
    }

    return null;
  }, [colorMode, connector?.id, wallets]);

  return icon;
}
