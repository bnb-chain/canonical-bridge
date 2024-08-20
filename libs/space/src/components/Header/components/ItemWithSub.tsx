import { Box, Flex, useColorMode } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { theme } from '../../../modules/theme';
import { Typography } from '../../Typography';
import { Level2Props } from '../types';

import { TagBadge } from './TagBadge';

export const ItemWithSub = ({
  children,
  name,
  desc,
  tag,
  icon,
  link,
  target,
  ...otherProps
}: Level2Props) => {
  const { colorMode } = useColorMode();

  const Icon = icon;
  const content = useMemo(() => {
    return (
      <>
        <Flex>
          <Flex
            alignItems={'flex-start'}
            borderRadius={theme.sizes['2']}
            px={theme.sizes['4']}
            py={theme.sizes['3']}
            cursor={'pointer'}
            sx={{
              '.svg-image': {
                WebkitMaskImage: `url(${Icon})`,
                flexShrink: 0,
              },
            }}
          >
            {Icon &&
              (typeof Icon === 'string' ? (
                <Box
                  className={'accordion_level-icon svg-image'}
                  bg={theme.colors[colorMode].button.primary.default}
                  h={theme.sizes['6']}
                  w={theme.sizes['6']}
                />
              ) : (
                <Icon
                  className={'accordion_level-icon'}
                  h={theme.sizes['6']}
                  w={theme.sizes['6']}
                  color={theme.colors[colorMode].button.primary.default}
                />
              ))}
            <Flex flexDir={'column'} marginLeft={Icon ? theme.sizes['3'] : 0}>
              <Flex alignItems={'center'} marginBottom={theme.sizes['1']}>
                <Typography
                  variant={'body'}
                  size={'sm'}
                  textAlign="left"
                  fontWeight={'700'}
                  color={theme.colors[colorMode].button.primary.default}
                >
                  {name}
                </Typography>
                {!!tag && (
                  <TagBadge variant={tag.variant} link={tag.link || ''}>
                    {tag.name}
                  </TagBadge>
                )}
              </Flex>
              <Typography
                variant={'label'}
                size={'sm'}
                textAlign="left"
                color={theme.colors[colorMode].text.placeholder}
              >
                {desc}
              </Typography>
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
          _hover={{
            svg: {
              color: theme.colors[colorMode].button.primary.active,
            },
            '.accordion_level-icon': {
              color: theme.colors[colorMode].background.brand,
            },
          }}
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
          _hover={{
            svg: {
              color: theme.colors[colorMode].button.primary.active,
            },
            '.accordion_level-icon': {
              color: theme.colors[colorMode].background.brand,
            },
          }}
          {...otherProps}
        >
          {content}
        </Flex>
      )}
    </>
  );
};
