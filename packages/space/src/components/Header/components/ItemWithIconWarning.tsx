import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { ArrowTopRightIcon } from '@bnb-chain/icons';
import React, { useMemo } from 'react';

import { theme } from '../../../modules/theme';
import { Typography } from '../../Typography';
import { Level2Props } from '../types';

interface Props {
  data: Level2Props;
  children?: React.ReactNode;
}

export const ItemWithIconWarning = ({ data, children, ...otherProps }: Props) => {
  const { colorMode } = useColorMode();
  const { name, desc, tag, icon, link, target } = data;
  const Icon = icon;
  const content = useMemo(() => {
    return (
      <>
        <Flex width={'100%'} overflow={'hidden'}>
          <Flex
            alignItems={'center'}
            borderRadius={theme.sizes['2']}
            cursor={'pointer'}
            width={'100%'}
            sx={{
              '.svg-warning': {
                WebkitMaskImage: `url(${Icon})`,
                WebkitMaskSize: { base: `16px 16px`, md: `24px 24px` },
                flexShrink: 0,
                maxWidth: { base: '16px', md: '24px' },
              },
            }}
          >
            {Icon &&
              (typeof Icon === 'string' ? (
                <Box
                  className={'accordion_level-item-icon svg-warning'}
                  bg={theme.colors[colorMode].text.on.color.primary}
                  h={{ base: theme.sizes['4'], md: theme.sizes['6'] }}
                  w={{ base: theme.sizes['4'], md: theme.sizes['6'] }}
                />
              ) : (
                <Icon
                  className={'accordion_level-item-icon'}
                  h={{ base: theme.sizes['4'], md: theme.sizes['6'] }}
                  w={{ base: theme.sizes['4'], md: theme.sizes['6'] }}
                  color={theme.colors[colorMode].text.on.color.primary}
                />
              ))}
            <Flex
              justifyContent="space-between"
              alignItems={'center'}
              marginLeft={Icon ? theme.sizes['3'] : 0}
              width={'100%'}
              sx={{
                svg: {
                  maxW: { base: theme.sizes['4'], md: theme.sizes['6'] },
                },
              }}
            >
              <Typography
                variant={'label'}
                size={{ base: 'lg', lg: 'md' }}
                textAlign="left"
                color={theme.colors[colorMode].text.on.color.primary}
                sx={{
                  span: {
                    fontWeight: 700,
                  },
                }}
              >
                {/* hardcode for fontweight */}
                Learn more about <span>Fusion</span>
              </Typography>
              <ArrowTopRightIcon
                color={theme.colors[colorMode].text.on.color.primary}
                h={{ base: theme.sizes['4'], md: theme.sizes['6'] }}
                w={{ base: theme.sizes['4'], md: theme.sizes['6'] }}
              />
            </Flex>
          </Flex>
        </Flex>
        {children}
      </>
    );
  }, [desc, name, Icon, tag, colorMode, children]);

  return (
    <>
      {!!link ? (
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          overflow={'hidden'}
          width={'100%'}
          as={'a'}
          href={link}
          target={target}
          {...otherProps}
        >
          {content}
        </Flex>
      ) : (
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          overflow={'hidden'}
          width={'100%'}
          bg={theme.colors[colorMode].support.warning['3']}
          {...otherProps}
        >
          {content}
        </Flex>
      )}
    </>
  );
};
