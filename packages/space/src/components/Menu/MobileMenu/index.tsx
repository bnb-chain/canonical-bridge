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
} from '@chakra-ui/react';
import React from 'react';

import { theme } from '../../../modules/theme';
import { Typography } from '../../Typography';
import { DataProps } from '../../Header/types';
import { ItemWithIcon } from '../../Header/components/ItemWithIcon';
import { ItemWithIconWarning } from '../../Header/components/ItemWithIconWarning';
import { TagBadge } from '../../Header/components/TagBadge';
import { SubItemMainTop } from '../components/SubItemMainTop';

export const MobileMenu = ({ data }: { data: DataProps }) => {
  const { colorMode } = useColorMode();

  return (
    <Box flex={'1'}>
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
                    className="accordion__mobile-level1-button"
                    outline={'none'}
                    outlineOffset={'0'}
                    transitionProperty={'none'}
                    borderY={'none'}
                    display={'flex'}
                    px={theme.sizes['5']}
                    py={theme.sizes['5']}
                    justifyContent={'space-between'}
                    alignItems="center"
                    bg={theme.colors[colorMode].background['1']}
                    _hover={{
                      bg: theme.colors[colorMode].background['2'],
                      svg: {
                        color: theme.colors[colorMode].button.primary.default,
                      },
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
                        fontSize={theme.sizes['8']}
                        color={theme.colors[colorMode].button.primary.default}
                      />
                    ) : (
                      <CaretRightIcon
                        fontSize={theme.sizes['8']}
                        color={theme.colors[colorMode].text.placeholder}
                      />
                    )}
                  </AccordionButton>
                  <AccordionPanel
                    background={theme.colors[colorMode].background['3']}
                    {...(isLevel1Expanded && {
                      bg: theme.colors[colorMode].background['3'],
                    })}
                  >
                    <Accordion allowMultiple marginBottom={theme.sizes['1']}>
                      {level1.children.map((level2, level2Index) => {
                        const Icon = level2.icon;
                        const IconComponent =
                          Icon &&
                          (typeof Icon === 'string' ? (
                            <Box
                              className={'accordion__icon-original svg-mobile-image'}
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
                            key={`${level2.name}-${level2Index}`}
                            border="none"
                            _hover={{
                              bg: theme.colors[colorMode].background['1'],
                            }}
                            data-analytics-id={level2.analyticsId}
                            borderRadius={theme.sizes['2']}
                            sx={{
                              '.svg-mobile-image': {
                                WebkitMaskImage: `url(${Icon})`,
                                flexShrink: 0,
                              },
                            }}
                          >
                            {({ isExpanded: isLevel2Expanded }) => (
                              <>
                                {!level2.children ? (
                                  <AccordionButton
                                    className="accordion__mobile-level2-button"
                                    marginBottom={theme.sizes['1']}
                                    outline={'none'}
                                    outlineOffset={'0'}
                                    transitionProperty={'none'}
                                    borderY={'none'}
                                    display={'flex'}
                                    cursor={'pointer'}
                                    as={'a'}
                                    href={level2.link}
                                    target={level2.target}
                                    px={theme.sizes['5']}
                                    py={theme.sizes['4']}
                                    justifyContent={'space-between'}
                                    background={theme.colors[colorMode].background['3']}
                                    borderRadius={theme.sizes['2']}
                                    _hover={{
                                      bg: theme.colors[colorMode].background['2'],
                                      svg: {
                                        color: theme.colors[colorMode].background.brand,
                                      },
                                    }}
                                    {...(isLevel2Expanded && {
                                      bg: theme.colors[colorMode].background['2'],
                                      marginBottom: 0,
                                    })}
                                  >
                                    <Flex
                                      justifyContent={'space-between'}
                                      alignItems={'center'}
                                      width={'100%'}
                                    >
                                      <Flex alignItems={'flex-start'}>
                                        {IconComponent}
                                        <Flex flexDir={'column'}>
                                          <Flex alignItems={'center'}>
                                            <Typography
                                              variant={'label'}
                                              size={'lg'}
                                              fontWeight={'700'}
                                              textAlign="left"
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
                                      <Flex>
                                        {!!level2.children && (
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
                                    </Flex>
                                  </AccordionButton>
                                ) : (
                                  <AccordionButton
                                    className="accordion__mobile-level2-button"
                                    marginBottom={theme.sizes['1']}
                                    outline={'none'}
                                    outlineOffset={'0'}
                                    transitionProperty={'none'}
                                    borderY={'none'}
                                    display={'flex'}
                                    px={theme.sizes['5']}
                                    py={theme.sizes['4']}
                                    justifyContent={'space-between'}
                                    background={theme.colors[colorMode].background['1']}
                                    borderRadius={theme.sizes['2']}
                                    _hover={{
                                      bg: theme.colors[colorMode].background['2'],
                                      svg: {
                                        color: theme.colors[colorMode].button.primary.default,
                                      },
                                    }}
                                    {...(isLevel2Expanded && {
                                      bg: theme.colors[colorMode].background['2'],
                                      marginBottom: 0,
                                    })}
                                  >
                                    <Flex
                                      justifyContent={'space-between'}
                                      alignItems={'center'}
                                      width={'100%'}
                                    >
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
                                      <Flex>
                                        {!!level2.children && (
                                          <>
                                            {isLevel2Expanded ? (
                                              <CaretDownIcon
                                                fontSize={theme.sizes['6']}
                                                color={theme.colors[colorMode].text.placeholder}
                                              />
                                            ) : (
                                              <CaretRightIcon
                                                fontSize={theme.sizes['6']}
                                                color={theme.colors[colorMode].text.placeholder}
                                              />
                                            )}
                                          </>
                                        )}
                                      </Flex>
                                    </Flex>
                                  </AccordionButton>
                                )}

                                {!!level2.children && !level2.subLink && (
                                  <AccordionPanel
                                    background={theme.colors[colorMode].background['3']}
                                    {...(isLevel2Expanded && {
                                      bg: theme.colors[colorMode].background['2'],
                                      marginBottom: theme.sizes['1'],
                                      borderRadius: `0 0 ${theme.sizes['2']} ${theme.sizes['2']}`,
                                    })}
                                  >
                                    {!!level2.children && level2.children.length > 0 && (
                                      <Accordion
                                        allowMultiple
                                        sx={{
                                          '&': {
                                            display: {
                                              base: 'flex',
                                              md: 'flex',
                                              lg: 'block',
                                            },
                                            flexWrap: {
                                              base: 'wrap',
                                              md: 'wrap',
                                              lg: 'wrap',
                                            },
                                          },
                                        }}
                                      >
                                        {level2.title && (
                                          <AccordionItem
                                            key={`${level2.name} - ${level2Index} thumbnail`}
                                            border="none"
                                            flexBasis={'100%'}
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
                                            typeof level2?.children?.length === 'number' &&
                                            level2?.buttonBottom &&
                                            level3Index === level2?.children?.length - 1
                                          ) {
                                            return null;
                                          }
                                          return (
                                            <AccordionItem
                                              data-analytics-id={level3.analyticsId}
                                              key={`${level3.name} - ${level3Index}`}
                                              border="none"
                                              flexBasis={'100%'}
                                              _hover={{
                                                bg: theme.colors[colorMode].background['1'],
                                              }}
                                              borderRadius={theme.sizes['2']}
                                            >
                                              {({ isExpanded: isLevel3Expanded }) => (
                                                <>
                                                  <AccordionButton
                                                    outline={'none'}
                                                    outlineOffset={'0'}
                                                    px={0}
                                                    marginBottom={theme.sizes['1']}
                                                    transitionProperty={'none'}
                                                    borderY={'none'}
                                                    width={'100%'}
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
                                                        borderRadius={theme.sizes['1']}
                                                        alignItems={'center'}
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
                    </Accordion>
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
