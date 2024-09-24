import {
  Box,
  Button,
  Flex,
  TYPOGRAPHY_STYLES,
  theme,
  useColorMode,
  useIntl,
} from '@bnb-chain/space';
import { DisconnectIcon } from '@bnb-chain/icons';
import { useAccount, useDisconnect } from 'wagmi';

import { CopyAddress } from '@/core/components/CopyAddress';
import { formatNumber } from '@/core/utils/number';
import { formatAppAddress } from '@/core/utils/address';
import { WalletIcon } from '@/core/components/icons/WalletIcon';
import { useEvmBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { AccountAvatar } from '@/modules/wallet/components/AccountAvatar';
import { Dropdown } from '@/modules/wallet/components/Dropdown/Dropdown';
import { DropdownButton } from '@/modules/wallet/components/Dropdown/DropdownButton';
import { DropdownList } from '@/modules/wallet/components/Dropdown/DropdownList';

export const ProfileMenu = () => {
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const { data: balance } = useEvmBalance();
  const { disconnect } = useDisconnect();

  return (
    <Dropdown>
      {({ isOpen }) => (
        <>
          <DropdownButton isActive={isOpen}>
            <Flex alignItems="center">
              <Box mr={{ base: 0, md: '8px' }}>
                <WalletIcon boxSize={'24px'} color={theme.colors[colorMode].text.tertiary} />
              </Box>
              {formatAppAddress({ address })}
            </Flex>
          </DropdownButton>

          <DropdownList>
            <Box>
              <Box h={'80px'} />
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
          </DropdownList>
        </>
      )}
    </Dropdown>
  );
};
