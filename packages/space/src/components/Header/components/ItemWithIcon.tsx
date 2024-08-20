import { Box, Flex, useColorMode } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { theme } from '../../../modules/theme';
import { Typography } from '../../Typography';
import { Level2Props } from '../types';

import { TagBadge } from './TagBadge';

interface Props {
  data: Level2Props;
  children?: React.ReactNode;
}

export const ItemWithIcon = ({ data, children, ...otherProps }: Props) => {
  const { colorMode } = useColorMode();
  const { name, desc, tag, icon, link, target } = data;
  const Icon = icon;
  const content = useMemo(() => {
    return (
      <>
        <Flex width={'100%'} overflow={'hidden'}>
          <Flex
            alignItems={desc ? 'flex-start' : 'center'}
            borderRadius={theme.sizes['2']}
            cursor={'pointer'}
            sx={{
              '.svg-image': {
                WebkitMaskImage: `url(${Icon})`,
                WebkitMaskSize: 'contain',
                flexShrink: 0,
              },
            }}
          >
            {Icon &&
              (typeof Icon === 'string' ? (
                <Box
                  mt={{ base: theme.sizes['0.5'], lg: 0 }}
                  className={'accordion_level-item-icon svg-image'}
                  bg={theme.colors[colorMode].button.primary.default}
                  h={{ base: theme.sizes['6'], lg: theme.sizes['5'] }}
                  w={{ base: theme.sizes['6'], lg: theme.sizes['5'] }}
                />
              ) : (
                <Icon
                  mt={{ base: theme.sizes['0.5'], lg: 0 }}
                  className={'accordion_level-item-icon'}
                  h={{ base: theme.sizes['6'], lg: theme.sizes['5'] }}
                  w={{ base: theme.sizes['6'], lg: theme.sizes['5'] }}
                  color={theme.colors[colorMode].button.primary.default}
                />
              ))}
            <Flex flexDir={'column'} marginLeft={Icon ? theme.sizes['3'] : 0}>
              <Flex alignItems={'center'} marginBottom={theme.sizes['1']}>
                <Typography
                  variant={'label'}
                  size={{ base: 'lg', lg: 'md' }}
                  textAlign="left"
                  fontWeight={'700'}
                  color={theme.colors[colorMode].button.primary.default}
                  my={{ base: 0, lg: theme.sizes['0.5'] }}
                >
                  {name}
                </Typography>
                {!!tag && (
                  <TagBadge variant={tag.variant} link={tag.link || ''}>
                    {tag.name}
                  </TagBadge>
                )}
              </Flex>
              {desc && (
                <Typography
                  variant={'label'}
                  size={{ base: 'md', lg: 'sm' }}
                  textAlign="left"
                  color={theme.colors[colorMode].text.placeholder}
                >
                  {desc}
                </Typography>
              )}
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
          data-analytics-id={data.analyticsId ? data.analyticsId : ''}
          _hover={{
            // svg: {
            //   color: theme.colors[colorMode].button.primary.active,
            // },
            '.accordion_level-item-icon': {
              color: theme.colors[colorMode].background.brand,
            },
            '.svg-image': {
              bg: theme.colors[colorMode].button.brand.default,
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
            // svg: {
            //   color: theme.colors[colorMode].button.primary.active,
            // },
            '.accordion_level-item-icon': {
              color: theme.colors[colorMode].background.brand,
            },
            '.svg-image': {
              bg: theme.colors[colorMode].button.brand.default,
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
