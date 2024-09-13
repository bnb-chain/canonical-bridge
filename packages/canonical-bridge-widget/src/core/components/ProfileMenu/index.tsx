import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  TYPOGRAPHY_STYLES,
  theme,
  useColorMode,
  useIntl,
} from '@bnb-chain/space';
import React from 'react';
import { DisconnectIcon } from '@bnb-chain/icons';
import { useAccount, useDisconnect } from 'wagmi';

import { CopyAddress } from '@/core/components/CopyAddress';
import { AccountAvatar } from '@/core/components/AccountAvatar';
import { ProfileBg } from '@/core/components/ProfileIcon/ProfileBg';
import { formatNumber } from '@/core/utils/number';
import { formatAppAddress } from '@/core/utils/address';
import { WalletIcon } from '@/core/components/icons/WalletIcon';
import { useEvmBalance } from '@/modules/wallet/hooks/useEvmBalance';

export const ProfileMenu = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const { data: balance } = useEvmBalance();
  const { disconnect } = useDisconnect();

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            flexShrink={0}
            border={'solid'}
            borderColor={theme.colors[colorMode].border['3']}
            borderWidth={'1px'}
            borderRadius={'96px'}
            h="min-content"
            pl={{ base: '4px', md: '8px' }}
            pr={{ base: '4px', md: '16px' }}
            py={{ base: '4px', md: '8px' }}
            color={theme.colors[colorMode].text.primary}
            background={
              isOpen
                ? theme.colors[colorMode].layer['3'].active
                : theme.colors[colorMode].layer['3'].default
            }
            _hover={{
              background: isOpen ? undefined : theme.colors[colorMode].layer['3'].hover,
            }}
            {...TYPOGRAPHY_STYLES['label']['md']}
            fontWeight={500}
          >
            <Flex alignItems="center">
              <Box mr={{ base: 0, md: '8px' }}>
                <WalletIcon boxSize={'24px'} color={theme.colors[colorMode].text.tertiary} />
              </Box>
              {formatAppAddress({ address })}
            </Flex>
          </MenuButton>
          <MenuList
            zIndex={1}
            color={theme.colors[colorMode].text.secondary}
            borderRadius={'8px'}
            overflow={'hidden'}
            fontSize={'14px'}
            fontWeight={400}
          >
            <Box>
              <ProfileBg />
              <Flex
                borderRadius={'50%'}
                justifyContent={'center'}
                alignItems={'center'}
                position={'absolute'}
                top={'48px'}
                left={'50%'}
                transform={`translateX(-50%)`}
                border={`2px solid ${theme.colors[colorMode].layer['4'].default}`}
              >
                <AccountAvatar size={'64px'} address={address} />
              </Flex>
            </Box>

            <Flex
              justifyContent={'center'}
              alignItems={'center'}
              pt={'48px'}
              pb={'4px'}
              gap={'8px'}
              color={theme.colors[colorMode].text.primary}
              background={theme.colors[colorMode].layer['4'].default}
              {...TYPOGRAPHY_STYLES['body']['lg']}
              fontWeight={500}
            >
              {formatAppAddress({ address })}
              <CopyAddress
                iconStyle={{
                  height: '24px',
                  width: '24px',
                }}
                h={'24px'}
                w={'24px'}
                content={address}
              />
            </Flex>

            {balance && (
              <Flex
                alignItems={'center'}
                px={'24px'}
                fontSize={'16px'}
                lineHeight={'24px'}
                background={theme.colors[colorMode].layer['4'].default}
                justifyContent={'center'}
                color={theme.colors[colorMode].text.secondary}
              >
                {formatNumber(Number(balance?.formatted), 4)} {balance?.symbol}
              </Flex>
            )}
            <Flex
              alignItems={'center'}
              px={'24px'}
              pt={'24px'}
              pb={'32px'}
              fontSize={'16px'}
              lineHeight={'24px'}
              background={theme.colors[colorMode].layer['4'].default}
              justifyContent={'center'}
              color={theme.colors[colorMode].text.secondary}
            >
              <Button
                size={'lg'}
                variant={'outline'}
                leftIcon={<DisconnectIcon w={'24px'} h={'24px'} />}
                onClick={() => {
                  disconnect();
                }}
              >
                {formatMessage({ id: 'wallet.button.disconnect' })}
              </Button>
            </Flex>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
