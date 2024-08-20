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
} from '@bnb-chain/space';
import React from 'react';
import { DisconnectIcon } from '@bnb-chain/icons';

import { CopyAddress } from '@/core/components/CopyAddress';
import { AccountAvatar } from '@/core/components/AccountAvatar';
import { ProfileBg } from '@/core/components/ProfileIcon/ProfileBg';
import { formatNumber } from '@/core/utils/number';
import { formatAppAddress } from '@/core/utils/address';
import { WalletIcon } from '@/core/components/icons/WalletIcon';
import { useCurrentWallet } from '@/modules/wallet/hooks/useCurrentWallet';

export const ProfileMenu = () => {
  // const { formatMessage } = useFormatMessage();
  // const { locale } = useIntl();
  const { colorMode } = useColorMode();
  const { address, balance, disconnect } = useCurrentWallet();

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            flexShrink={0}
            border={'solid'}
            borderColor={theme.colors[colorMode].border['3']}
            borderWidth={theme.sizes['0.25']}
            borderRadius={theme.sizes['24']}
            h="min-content"
            pl={{ base: theme.sizes['1'], md: theme.sizes['2'] }}
            pr={{ base: theme.sizes['1'], md: theme.sizes['4'] }}
            py={{ base: theme.sizes['1'], md: theme.sizes['2'] }}
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
              <Box mr={{ base: 0, md: theme.sizes['2'] }}>
                <WalletIcon
                  boxSize={theme.sizes['6']}
                  color={theme.colors[colorMode].text.tertiary}
                />
                {/* <AccountAvatar size={theme.sizes['6']} address={address} /> */}
              </Box>
              {formatAppAddress({ address })}
            </Flex>
          </MenuButton>
          <MenuList
            zIndex={1}
            color={theme.colors[colorMode].text.secondary}
            borderRadius={theme.sizes['2']}
            overflow={'hidden'}
            fontSize={theme.sizes['3.5']}
            fontWeight={400}
          >
            <Box>
              <ProfileBg />
              <Flex
                borderRadius={'50%'}
                justifyContent={'center'}
                alignItems={'center'}
                position={'absolute'}
                top={theme.sizes['12']}
                left={'50%'}
                transform={`translateX(-50%)`}
                border={`${theme.sizes['0.5']} solid ${theme.colors[colorMode].layer['4'].default}`}
              >
                <AccountAvatar size={theme.sizes['16']} address={address} />
              </Flex>
            </Box>

            <Flex
              justifyContent={'center'}
              alignItems={'center'}
              pt={theme.sizes['12']}
              pb={theme.sizes['1']}
              gap={theme.sizes['2']}
              color={theme.colors[colorMode].text.primary}
              background={theme.colors[colorMode].layer['4'].default}
              {...TYPOGRAPHY_STYLES['body']['lg']}
              fontWeight={500}
            >
              {formatAppAddress({ address })}
              <CopyAddress
                iconStyle={{
                  height: theme.sizes['6'],
                  width: theme.sizes['6'],
                }}
                h={theme.sizes['6']}
                w={theme.sizes['6']}
                content={address}
              />
            </Flex>

            {balance && (
              <Flex
                alignItems={'center'}
                px={theme.sizes['6']}
                fontSize={theme.sizes['4']}
                lineHeight={theme.sizes['6']}
                background={theme.colors[colorMode].layer['4'].default}
                justifyContent={'center'}
                color={theme.colors[colorMode].text.secondary}
              >
                {formatNumber(Number(balance?.formatted), 4)} {balance?.symbol}
              </Flex>
            )}
            <Flex
              alignItems={'center'}
              px={theme.sizes['6']}
              pt={theme.sizes['6']}
              pb={theme.sizes['8']}
              fontSize={theme.sizes['4']}
              lineHeight={theme.sizes['6']}
              background={theme.colors[colorMode].layer['4'].default}
              justifyContent={'center'}
              color={theme.colors[colorMode].text.secondary}
            >
              <Button
                size={'lg'}
                variant={'outline'}
                leftIcon={<DisconnectIcon w={theme.sizes['6']} h={theme.sizes['6']} />}
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect Wallet
              </Button>
            </Flex>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
