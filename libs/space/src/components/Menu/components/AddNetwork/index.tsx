import { MetaMaskColorIcon, TrustWalletColorIcon } from '@bnb-chain/icons';
import { Box, Flex, Tooltip, useColorMode } from '@chakra-ui/react';
import { useCallback } from 'react';

import { theme } from '../../../../modules/theme';
import { Typography } from '../../../Typography';
import { CLASS_NAMES } from '../../../constants';
import { AddNetworkProps, ChainProps } from '../../types';
import { getTrustWalletInjectedProvider } from '../../../../modules/utils/getTrustWalletInjectedProvider';

const list = [TrustWalletColorIcon, MetaMaskColorIcon];

export const AddNetwork = ({ options, title }: AddNetworkProps) => {
  const { colorMode } = useColorMode();

  const addNetwork = useCallback(
    async ({ id, key, chain }: { id: string; key?: string; chain: ChainProps[] }) => {
      if ([id, key].includes('metamask')) {
        await (window as any)?.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: chain,
        });
        return;
      }
      if ([id, key].includes('tw')) {
        const injectedProvider = await getTrustWalletInjectedProvider();
        try {
          await injectedProvider?.request({
            method: 'wallet_addEthereumChain',
            params: chain,
          });
        } catch (e: any) {
          if (e.code === 4001) {
            return;
          }
        }
      } else return;
    },
    [],
  );

  return (
    <Flex
      mx={theme.sizes['6']}
      py={theme.sizes['4']}
      mt={'auto'}
      gap={theme.sizes['4']}
      borderTop={`1px solid ${theme.colors[colorMode].border['3']}`}
      _hover={{
        [`.${CLASS_NAMES.ICON}`]: {
          color: theme.colors[colorMode].button.primary.hover,
        },
      }}
      justifyContent={'space-between'}
      alignItems={'center'}
    >
      <Typography variant="label" size="lg" color={'#C4C5CB'} fontSize="14px">
        {title}
      </Typography>
      <Flex gap={theme.sizes['4']}>
        {list.map((e, i) => {
          const Icon = e;
          return (
            <Tooltip
              label={options[i].tooltipContent}
              hasArrow
              placement="top"
              maxW={{ base: '150px', md: '265px' }}
              key={i}
            >
              <Box
                border={`1px solid ${theme.colors[colorMode].border['3']}`}
                borderRadius={theme.sizes['2']}
                height={theme.sizes['8']}
                _hover={{
                  '&': {
                    background: theme.colors[colorMode].button.primary.hover,
                  },
                  [`.${CLASS_NAMES.ICON}`]: {
                    color: theme.colors[colorMode].button.primary.hover,
                  },
                }}
              >
                <Icon
                  data-analytics-id={options[i].analyticsId}
                  onClick={() => {
                    addNetwork({ id: options[i].id, key: options[i].key, chain: options[i].chain });
                  }}
                  fontSize={theme.sizes['6']}
                  margin={theme.sizes['1']}
                />
              </Box>
            </Tooltip>
          );
        })}
      </Flex>
    </Flex>
  );
};
