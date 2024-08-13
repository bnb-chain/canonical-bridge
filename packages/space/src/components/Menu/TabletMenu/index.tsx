import { CaretDownIcon, CaretRightIcon, ArrowRightIcon } from '@bnb-chain/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  useColorMode,
  Button,
  Divider,
} from '@chakra-ui/react';
import React from 'react';

import { theme } from '../../../modules/theme';
import { Typography } from '../../Typography';
import { ItemWithIcon } from '../../Header/components/ItemWithIcon';
import { TagBadge } from '../../Header/components/TagBadge';
import { DataProps } from '../../Header/types';
import { SubItemMainTopWithImage } from '../components/SubItemMainTopWithImage';
import { SubItemMainTop } from '../components/SubItemMainTop';
import { ItemWithIconWarning } from '../../Header/components/ItemWithIconWarning';

export const TabletMenu = ({ data }: { data: DataProps }) => {
  const { colorMode } = useColorMode();

  return (
    <Box bg={theme.colors[colorMode].background['3']}>
      <Accordion allowMultiple>
        {data.map((level1, level1Index) => {
          return (
            <AccordionItem
              key={`${level1.key}-${level1Index}`}
              border="none"
              data-analytics-id={level1.analyticsId}
            >
              {({ isExpanded: isLevel1Expanded }) => (
                <>
                  <AccordionButton
                    outline={'none'}
                    outlineOffset={'0'}
                    transitionProperty={'none'}
                    borderY={'none'}
                    display={'flex'}
                    px={theme.sizes['10']}
                    py={theme.sizes['6']}
                    justifyContent={'space-between'}
                    bg={theme.colors[colorMode].background['1']}
                    color={theme.colors[colorMode].button.primary.default}
                    _hover={{
                      svg: {
                        color: theme.colors[colorMode].button.primary.default,
                      },
                      bg: theme.colors[colorMode].background['2'],
                      ...(isLevel1Expanded && {
                        bg: theme.colors[colorMode].background['3'],
                      }),
                    }}
                  >
                    <Flex flexDir={'column'}>
                      <Typography
                        variant={'heading'}
                        size={'sm'}
                        fontWeight={'400'}
                        color={theme.colors[colorMode].button.primary.default}
                      >
                        {level1.name}
                      </Typography>
                    </Flex>
                    {isLevel1Expanded ? (
                      <CaretDownIcon
                        fontSize={theme.sizes['10']}
                        color={theme.colors[colorMode].button.primary.default}
                      />
                    ) : (
                      <CaretRightIcon
                        fontSize={theme.sizes['10']}
                        color={theme.colors[colorMode].text.placeholder}
                      />
                    )}
                  </AccordionButton>
                  <AccordionPanel
                    background={theme.colors[colorMode].background['3']}
                    {...(isLevel1Expanded && {
                      bg: theme.colors[colorMode].background['3'],
                    })}
                    display={'flex'}
                    flexDir={'column'}
                  >
                    <Accordion
                      allowMultiple
                      display={'flex'}
                      flexDir={'row'}
                      flexWrap={'wrap'}
                      gap={theme.sizes['1']}
                    >
                      {level1.children.map((level2, level2Index) => {
                        const Icon = level2.icon;
                        const IconComponent =
                          Icon &&
                          (typeof Icon === 'string' ? (
                            <Box
                              className={'accordion__icon-original svg-tablet-image'}
                              bg={theme.colors[colorMode].button.primary.default}
                              h={theme.sizes['6']}
                              w={theme.sizes['6']}
                              mr={theme.sizes['3']}
                            />
                          ) : (
                            <Icon
                              className={'accordion__icon-original'}
                              h={theme.sizes['6']}
                              w={theme.sizes['6']}
                              color={theme.colors[colorMode].button.primary.default}
                              mr={theme.sizes['3']}
                            />
                          ));

                        return (
                          <AccordionItem
                            data-analytics-id={level2.analyticsId}
                            key={`${level2.name} - ${level2Index}`}
                            border="none"
                            _hover={{
                              bg: theme.colors[colorMode].background['1'],
                            }}
                            flexBasis={level1.key === 'Chains' ? '100%' : 'calc(50% - 4px)'}
                            borderRadius={theme.sizes['2']}
                            sx={{
                              '.svg-tablet-image': {
                                WebkitMaskImage: `url(${Icon})`,
                                flexShrink: 0,
                              },
                            }}
                          >
                            {({ isExpanded: isLevel2Expanded }) => (
                              <>
                                {!level2.children ? (
                                  <AccordionButton
                                    outline={'none'}
                                    outlineOffset={'0'}
                                    transitionProperty={'none'}
                                    borderY={'none'}
                                    display={'flex'}
                                    as={'a'}
                                    cursor={'pointer'}
                                    href={level2.link}
                                    target={level2.target}
                                    padding={theme.sizes['5']}
                                    justifyContent={'space-between'}
                                    background={theme.colors[colorMode].background['3']}
                                    borderRadius={theme.sizes['2']}
                                    className="test"
                                    _hover={{
                                      bg: theme.colors[colorMode].background['2'],
                                      svg: {
                                        color: theme.colors[colorMode].button.primary.default,
                                      },
                                      '.accordion__icon-original': {
                                        color: theme.colors[colorMode].background.brand,
                                      },
                                    }}
                                    color={theme.colors[colorMode].button.primary.default}
                                    {...(isLevel2Expanded && {
                                      bg: theme.colors[colorMode].background['2'],
                                    })}
                                  >
                                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                                      <Flex alignItems={'flex-start'}>
                                        {IconComponent}
                                        <Flex flexDir={'column'}>
                                          <Flex alignItems={'center'}>
                                            <Typography
                                              variant={'label'}
                                              size={'lg'}
                                              textAlign="left"
                                              fontWeight={'700'}
                                              color={theme.colors[colorMode].button.primary.default}
                                            >
                                              {level2.name}
                                            </Typography>
                                            {!!level2.tag && (
                                              <TagBadge
                                                variant={level2.tag.variant}
                                                link={level2.tag.link || ''}
                                              >
                                                {level2.tag.name}
                                              </TagBadge>
                                            )}
                                          </Flex>
                                          <Typography
                                            variant={'label'}
                                            size={'md'}
                                            textAlign="left"
                                            color={theme.colors[colorMode].text.placeholder}
                                          >
                                            {level2.desc}
                                          </Typography>
                                        </Flex>
                                      </Flex>
                                    </Flex>
                                    <Flex></Flex>
                                  </AccordionButton>
                                ) : (
                                  <AccordionButton
                                    outline={'none'}
                                    outlineOffset={'0'}
                                    transitionProperty={'none'}
                                    className="accordion_button-level2"
                                    borderY={'none'}
                                    display={'flex'}
                                    padding={theme.sizes['5']}
                                    justifyContent={'space-between'}
                                    background={theme.colors[colorMode].background['1']}
                                    color={theme.colors[colorMode].button.primary.default}
                                    borderRadius={theme.sizes['2']}
                                    _hover={{
                                      bg: theme.colors[colorMode].background['2'],
                                      '.accordion__icon-original': {
                                        color: theme.colors[colorMode].background.brand,
                                      },
                                    }}
                                    {...(isLevel2Expanded && {
                                      bg: theme.colors[colorMode].background['2'],
                                    })}
                                  >
                                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                                      <Flex alignItems={'flex-start'}>
                                        {IconComponent}
                                        <Flex flexDir={'column'}>
                                          <Flex alignItems={'center'}>
                                            <Typography
                                              variant={'label'}
                                              size={'lg'}
                                              textAlign="left"
                                              fontWeight={'700'}
                                            >
                                              {level2.name}
                                            </Typography>
                                            {!!level2.tag && (
                                              <TagBadge
                                                variant={level2.tag.variant}
                                                link={level2.tag.link || ''}
                                              >
                                                {level2.tag.name}
                                              </TagBadge>
                                            )}
                                          </Flex>
                                          <Typography
                                            variant={'label'}
                                            size={'md'}
                                            textAlign="left"
                                            color={theme.colors[colorMode].text.placeholder}
                                          >
                                            {level2.desc}
                                          </Typography>
                                        </Flex>
                                      </Flex>
                                    </Flex>
                                    <Flex>
                                      {!!level2.children && !level2.subLink && (
                                        <>
                                          {isLevel2Expanded ? (
                                            <CaretDownIcon fontSize={theme.sizes['6']} />
                                          ) : (
                                            <CaretRightIcon
                                              fontSize={theme.sizes['6']}
                                              color={theme.colors[colorMode].text.placeholder}
                                            />
                                          )}
                                        </>
                                      )}
                                    </Flex>
                                  </AccordionButton>
                                )}

                                {!!level2.children && !level2.subLink && (
                                  <AccordionPanel
                                    background={theme.colors[colorMode].background['3']}
                                    {...(isLevel2Expanded && {
                                      bg: theme.colors[colorMode].background['2'],
                                      borderRadius: `0 0 ${theme.sizes['2']} ${theme.sizes['2']}`,
                                    })}
                                  >
                                    {!!level2.children && level2.children.length > 0 && (
                                      <Accordion
                                        allowMultiple
                                        sx={{
                                          '&': {
                                            display: { base: 'flex', md: 'flex', lg: 'block' },
                                            flexWrap: { base: 'wrap', md: 'wrap', lg: 'wrap' },
                                          },
                                        }}
                                      >
                                        {level2.title && (
                                          <AccordionItem
                                            key={`${level2.name} -${level2Index} thumbnail`}
                                            border="none"
                                            flexBasis={'100%'}
                                            marginBottom={theme.sizes['1']}
                                            borderRadius={theme.sizes['2']}
                                          >
                                            <SubItemMainTop
                                              title={level2.title}
                                              link={
                                                level2.thumbnailLink ?? {
                                                  href: '',
                                                  name: '',
                                                }
                                              }
                                              analyticsId={level2.thumbnailAnalyticsId ?? ''}
                                            />
                                          </AccordionItem>
                                        )}
                                        {level2.children.map((level3, level3Index) => {
                                          if (
                                            level1.key === 'Developers' &&
                                            level2?.buttonBottom &&
                                            typeof level2?.children?.length === 'number' &&
                                            level3Index === level2?.children?.length - 1
                                          ) {
                                            return null;
                                          }
                                          return (
                                            <AccordionItem
                                              data-analytics-id={level3.analyticsId}
                                              marginBottom={theme.sizes['1']}
                                              key={`${level3.name} - ${level3Index}`}
                                              border="none"
                                              _hover={{
                                                bg: theme.colors[colorMode].background['1'],
                                              }}
                                              borderRadius={theme.sizes['2']}
                                              width={{
                                                base: '100%',
                                                md:
                                                  level1.key === 'Chains' &&
                                                  level2.name === 'BNB Beacon Chain' &&
                                                  level3Index === 0
                                                    ? '100%'
                                                    : '50%',
                                                lg: '100%',
                                              }}
                                            >
                                              {({ isExpanded: isLevel3Expanded }) => (
                                                <>
                                                  <AccordionButton
                                                    outline={'none'}
                                                    marginBottom={theme.sizes['1']}
                                                    px={0}
                                                    outlineOffset={'0'}
                                                    transitionProperty={'none'}
                                                    borderY={'none'}
                                                    background={
                                                      theme.colors[colorMode].background['2']
                                                    }
                                                  >
                                                    {level1.key === 'Chains' &&
                                                    level2.name === 'BNB Beacon Chain' &&
                                                    level3Index === 0 ? (
                                                      <Flex
                                                        width={'100%'}
                                                        px={theme.sizes['4']}
                                                        py={theme.sizes['3.5']}
                                                        borderRadius={theme.sizes['2']}
                                                        bg={
                                                          theme.colors[colorMode].support.warning[
                                                            '3'
                                                          ]
                                                        }
                                                        _hover={{
                                                          bg: theme.colors[colorMode].support
                                                            .warning['2'],
                                                        }}
                                                      >
                                                        <ItemWithIconWarning
                                                          data={{
                                                            name: level3.name,
                                                            icon: level3.icon,
                                                            desc: level3.desc,
                                                            link: level3.link,
                                                            target: level3.target,
                                                          }}
                                                        />
                                                      </Flex>
                                                    ) : (
                                                      <ItemWithIcon
                                                        data={{
                                                          name: level3.name,
                                                          icon: level3.icon,
                                                          desc: level3.desc,
                                                          link: level3.link,
                                                          target: level3.target,
                                                        }}
                                                      />
                                                    )}
                                                  </AccordionButton>
                                                </>
                                              )}
                                            </AccordionItem>
                                          );
                                        })}
                                      </Accordion>
                                    )}
                                  </AccordionPanel>
                                )}
                              </>
                            )}
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                    {!!level1.button && (
                      <Button
                        w="100%"
                        mt={theme.sizes['5']}
                        size="md"
                        variant="outline"
                        as="a"
                        href={level1.button.href}
                        target={level1.button.target}
                        borderColor={theme.colors[colorMode].button.brand.default}
                        color={theme.colors[colorMode].button.brand.default}
                        data-analytics-id={level1.button.analyticsId || ''}
                      >
                        <Typography
                          variant="label"
                          size="md"
                          fontWeight={500}
                          mr={theme.sizes['1']}
                        >
                          {level1.button.name}
                        </Typography>
                        <ArrowRightIcon fontSize={theme.sizes['4']} transform="rotate(-45deg)" />
                      </Button>
                    )}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </Box>
  );
};
