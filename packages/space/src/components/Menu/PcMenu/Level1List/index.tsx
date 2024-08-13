import { ArrowRightIcon, CaretDownIcon, CaretRightIcon } from '@bnb-chain/icons';
import { Box, Flex, useColorMode, Button, Divider } from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { theme } from '../../../../modules/theme';
import { Typography } from '../../../Typography';
import { ItemWithIcon } from '../../../Header/components/ItemWithIcon';
import { ItemWithIconWarning } from '../../../Header/components/ItemWithIconWarning';
import { Level1Props, Level2Props } from '../../../Header/types';
// import { SubItemMainTopWithImage } from '../../components/SubItemMainTopWithImage';
import { SubItemMainTop } from '../../components/SubItemMainTop';
import { LEVEL1_PADDING_TOP, MENU_WIDTH, MENU_WIDTH_PX, TRANSITION } from '../../constants';
import { AddNetwork } from '../../components/AddNetwork';

interface Level1ContentProps {
  level1: Level1Props;
  level1Index: number;
}

interface LevelProps {
  level2: Level2Props;
  level1Index: number;
  level2Index: number;
}

interface NumberProps {
  [key: number]: number;
}

let level2Height: NumberProps = {} as NumberProps;

export const Level1List = ({ data }: { data: Level1ContentProps }) => {
  const { colorMode } = useColorMode();
  const canUseDOM = typeof window !== 'undefined';
  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
  const { level1, level1Index } = data;
  const [level2Data, setLevel2] = useState<LevelProps>({} as LevelProps);
  const containerRef = useRef<HTMLDivElement>(null);
  const flexRef = useRef<HTMLDivElement>(null);
  const level2ElRef = useRef<HTMLDivElement>(null);
  const level3ElRef = useRef<HTMLDivElement>(null);
  const level3ElWrapRef = useRef<HTMLDivElement>(null);

  const level3Data = useMemo(() => {
    const data: Level2Props['children'] = [];

    level1.children?.forEach((level2) => {
      data.push(...(level2.children || []));
    });

    return data;
  }, [level1]);

  useIsomorphicLayoutEffect(() => {
    let level2 = level2Data.level2;
    if (!level2) return;

    let level1Index = level2Data.level1Index;
    let level2Index = level2Data.level2Index;
    if (!level2Height[level1Index]) return;

    if (level2?.children) {
      level2ElRef.current?.classList.add('hover');
    } else {
      level2ElRef.current?.classList.remove('hover');
    }
    const hover = level2ElRef.current?.querySelector('.hover');
    const item = level2ElRef.current?.querySelector(`.accordion__level2-item-${level2Index}`);
    hover?.classList.remove('hover');
    item?.classList.add('hover');
    //64: Add network to wallet, 16: paddingY, 80: submenu top
    const childrenNum = level2?.children?.length ? level2?.children?.length : 0;
    const estimateHeight = childrenNum * 60 + childrenNum * 4 + 64 + 80 + 16;
    let maxHeight =
      typeof level3ElWrapRef.current?.clientHeight === 'number'
        ? level3ElWrapRef.current?.clientHeight > level2Height[level1Index]
          ? level3ElWrapRef.current?.clientHeight
          : level2Height[level1Index]
        : level2Height[level1Index];
    const customHeight = maxHeight - estimateHeight > 0 ? maxHeight : estimateHeight;
    const level2ClientWith =
      typeof level2ElRef.current?.clientWidth === 'number' ? level2ElRef.current?.clientWidth : 0;
    const level3ClientWidth =
      typeof level3ElRef.current?.clientWidth === 'number' ? level3ElRef.current?.clientWidth : 0;
    let maxWidth = level3ClientWidth + level2ClientWith + 'px';

    flexRef.current && (flexRef.current.style.height = customHeight + LEVEL1_PADDING_TOP + 'px');
    flexRef.current && (flexRef.current.style.width = maxWidth);

    level2ElRef.current && (level2ElRef.current.style.height = customHeight + 'px');
    level3ElRef.current && (level3ElRef.current.style.height = customHeight + 'px');
  }, [level2Data]);

  return (
    <Box
      ref={containerRef}
      height={'100%'}
      paddingRight={theme.sizes['10']}
      key={`${level1.key} - ${level1Index}- level1-item`}
      position={'relative'}
      display={'flex'}
      alignItems={'center'}
      cursor={'pointer'}
      onMouseEnter={() => {
        // setTimeout(() => {
        // Fix the issue of menu modal disappearing when moving the mouse quickly left and right.
        level2Height = {
          ...level2Height,
          [level1Index]: level2ElRef.current?.clientHeight ?? 0,
        };
        const level2ClientHeight =
          typeof level2ElRef.current?.clientHeight === 'number'
            ? level2ElRef.current?.clientHeight
            : 0;
        flexRef.current &&
          (flexRef.current.style.height = LEVEL1_PADDING_TOP + level2ClientHeight + 'px');
        flexRef.current && (flexRef.current.style.width = MENU_WIDTH_PX);
        level3ElRef.current && (level3ElRef.current.style.minHeight = level2ClientHeight + 'px');
        // }, 0);
      }}
      onMouseLeave={() => {
        containerRef.current?.querySelectorAll('.hover')?.forEach((item) => {
          item.classList.remove('hover');
        });

        level2ElRef.current &&
          (level2ElRef.current.style.height = level2Height[level1Index] + 'px');
        flexRef.current &&
          (flexRef.current.style.height = LEVEL1_PADDING_TOP + level2Height[level1Index] + 'px');
        flexRef.current && (flexRef.current.style.width = MENU_WIDTH_PX);
        level2ElRef.current?.classList.remove('hover');
      }}
      _hover={{
        '.accordion__level2-level3-container': {
          display: 'inline-block',
        },
        '.accordion__level1-each-item': {
          p: { color: theme.colors[colorMode].button.brand.default },
          svg: {
            color: theme.colors[colorMode].button.brand.default,
          },
        },
      }}
      className={`accordion__level1-container-${level1Index}`}
      sx={{
        '>div:hover': {
          '.accordion__level1-each-item': {
            p: { color: theme.colors[colorMode].button.brand.default },
            '.accordion--caretdown-icon': {
              svg: {
                color: theme.colors[colorMode].button.brand.default,
              },
            },
          },
        },
      }}
      data-analytics-id={level1.analyticsId}
    >
      <Box
        display={'flex'}
        key={`${level1.key} - ${level1Index}`}
        alignItems={'center'}
        cursor={'pointer'}
        className={'accordion__level1-each-item'}
      >
        <Typography
          size={'lg'}
          variant={'label'}
          textAlign="left"
          opacity={0.9}
          color={theme.colors[colorMode].button.primary.default}
        >
          {level1.name}
        </Typography>
        <Box w={theme.sizes['6']} height={theme.sizes['6']}>
          <CaretDownIcon
            className={'accordion--caretdown-icon'}
            fontSize={theme.sizes['6']}
            color={theme.colors[colorMode].text.placeholder}
          />
        </Box>
      </Box>
      <Box
        className="accordion__level2-level3-container"
        ref={flexRef}
        display={'none'}
        position="absolute"
        overflow={'hidden'}
        left={'50%'}
        marginLeft={`-${MENU_WIDTH / 2}px`}
        paddingTop={theme.sizes['2']}
        top="100%"
        transition={`${TRANSITION}s`}
        whiteSpace="nowrap"
        zIndex={100}
      >
        <Box
          className={'accordion__level2-container'}
          ref={level2ElRef}
          verticalAlign={'top'}
          width={MENU_WIDTH_PX}
          display={'inline-block'}
          transition={`${TRANSITION}s`}
          zIndex={theme.zIndices.docked}
          whiteSpace="normal"
          borderRadius={theme.sizes['3']}
          bg={theme.colors[colorMode].background['3']}
          py={theme.sizes['4']}
          sx={{
            '&.hover': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
          }}
        >
          <Box height={'100%'}>
            {/* {level1.title && (
              <SubItemMainTopWithImage
                title={level1.title ?? ''}
                description={level1.subtitle ?? ''}
                link={
                  level1.thumbnailLink ?? {
                    href: '',
                    name: '',
                  }
                }
                analyticsId={level1.thumbnailAnalyticsId ?? ''}
                image={
                  level1.thumbnailImage ?? {
                    src: '',
                    alt: '',
                  }
                }
                onMouseEnter={() => {
                  const hover = level2ElRef.current?.querySelector('.hover');
                  hover?.classList.remove('hover');
                }}
              />
            )} */}
            {!!level1.children &&
              level1.children.map((level2, level2Index) => {
                return (
                  <Box
                    className={`accordion__level2-item-${level2Index}`}
                    key={`${level2.name} - ${level2Index}`}
                    overflow={'hidden'}
                    onMouseEnter={() => {
                      setLevel2({
                        level2,
                        level1Index,
                        level2Index,
                      });
                    }}
                    sx={{
                      '&.hover': {
                        '.accordion__level2-flex-item': {
                          bg: theme.colors[colorMode].background['2'],
                          '.accordion__caretright-icon': {
                            color: theme.colors[colorMode].button.primary.default,
                          },
                        },
                        '.level2-inner-item': {
                          bg: theme.colors[colorMode].border['2'],
                          borderRadius: theme.sizes['2'],
                        },
                      },
                    }}
                  >
                    <Flex
                      mx={theme.sizes['2']}
                      px={theme.sizes['4']}
                      py={theme.sizes['2']}
                      className="accordion__level2-flex-item"
                      borderRadius={theme.sizes['2']}
                      cursor={'pointer'}
                      flex={'1'}
                    >
                      <ItemWithIcon
                        data={{
                          icon: level2.icon,
                          name: level2.name,
                          desc: level2.desc,
                          link: level2.selfLink || level2.link,
                          target: level2.target,
                          tag: level2.tag,
                          analyticsId: level2.analyticsId || level2.selfAnalyticsId,
                        }}
                      >
                        {!!level2.children && (
                          <CaretRightIcon
                            className={'accordion__caretright-icon'}
                            fontSize={theme.sizes['5']}
                            color={theme.colors[colorMode].text.placeholder}
                            ml={theme.sizes['3']}
                          />
                        )}
                      </ItemWithIcon>
                    </Flex>
                  </Box>
                );
              })}
            {!!level1.button && (
              <Box mx={theme.sizes['6']} mt={theme.sizes['4']}>
                <Divider borderColor={theme.colors[colorMode].border['3']} mb={theme.sizes['4']} />
                <Button
                  size="md"
                  h={theme.sizes['8']}
                  px={theme.sizes['3']}
                  py={theme.sizes['2']}
                  variant="outline"
                  as="a"
                  href={level1.button.href}
                  target={level1.button.target}
                  borderColor={theme.colors[colorMode].button.brand.default}
                  color={theme.colors[colorMode].button.brand.default}
                  data-analytics-id={level1.button.analyticsId || ''}
                >
                  <Typography variant="label" size="md" fontWeight={500} mr={theme.sizes['1']}>
                    {level1.button.name}
                  </Typography>
                  <ArrowRightIcon fontSize={theme.sizes['4']} transform="rotate(-45deg)" />
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {level2Data.level2?.children && (
          <Box
            className={'accordion__level3-container'}
            ref={level3ElRef}
            display={'inline-block'}
            width={MENU_WIDTH_PX}
            verticalAlign={'top'}
            bg={theme.colors[colorMode].background['2']}
            borderRadius={theme.sizes['3']}
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            transition={`${TRANSITION}s`}
            whiteSpace="normal"
            overflow={'hidden'}
          >
            <Flex
              direction="column"
              pt={theme.sizes['2']}
              className={'accordion__level3-wrap'}
              ref={level3ElWrapRef}
              h="100%"
            >
              {level2Data.level2?.title && (
                <SubItemMainTop
                  title={level2Data.level2?.title ?? ''}
                  link={
                    level2Data.level2?.thumbnailLink ?? {
                      href: '',
                      name: '',
                    }
                  }
                  onMouseEnter={() => {
                    const hover = level2ElRef.current?.querySelector('.hover');
                    hover?.classList.remove('hover');
                  }}
                  analyticsId={level2Data.level2?.thumbnailAnalyticsId ?? ''}
                />
              )}
              {!!level2Data.level2.children &&
                level2Data.level2?.children.map((level3, level3Index) => {
                  if (
                    level1.key === 'Developers' &&
                    level2Data.level2?.buttonBottom &&
                    typeof level2Data.level2?.children?.length === 'number' &&
                    level3Index === level2Data.level2?.children?.length - 1
                  ) {
                    return (
                      <Flex
                        key={level3Index}
                        borderTop={`1px solid ${theme.colors[colorMode].border['3']}`}
                        color={theme.colors[colorMode].button.primary.default}
                        padding={theme.sizes['6']}
                        width={'100%'}
                        marginTop="auto"
                        alignItems={'center'}
                        sx={{
                          svg: {
                            color: theme.colors[colorMode].button.primary.default,
                          },
                        }}
                        as={'a'}
                        href={level3.link}
                        target={level3.target}
                        data-analytics-id={level3.analyticsId}
                      >
                        <Typography
                          variant={'label'}
                          size={'md'}
                          textAlign="left"
                          marginRight={theme.sizes['2']}
                          color={theme.colors[colorMode].button.primary.default}
                        >
                          {level3.name}
                        </Typography>
                        <ArrowRightIcon fontSize={theme.sizes['4']} />
                      </Flex>
                    );
                  } else {
                    return (
                      <Flex
                        key={`${level3.name} - ${level3Index}`}
                        overflow={'hidden'}
                        borderRadius={theme.sizes['2']}
                        _hover={{
                          '.accordion__level3-inner-item': {
                            bg: theme.colors[colorMode].background['3'],
                            borderRadius: theme.sizes['2'],
                          },
                          'accordion__level3-inner-item-warning': {
                            bg: theme.colors[colorMode].support.warning['2'],
                            borderRadius: theme.sizes['2'],
                          },
                        }}
                        marginBottom={{ base: 0, md: 0, lg: theme.sizes['1'] }}
                        width={'100%'}
                        data-analytics-id={level3.analyticsId}
                      >
                        {level3.analyticsId === 'click_menu_solution_beacon_fusion' ? (
                          <Flex
                            mx={theme.sizes['2']}
                            px={theme.sizes['4']}
                            py={theme.sizes['3.5']}
                            className={'accordion__level3-inner-item-warning'}
                            overflow={'hidden'}
                            width={'100%'}
                            borderRadius={theme.sizes['2']}
                            bg={theme.colors[colorMode].support.warning['3']}
                            _hover={{
                              bg: theme.colors[colorMode].support.warning['2'],
                            }}
                          >
                            <ItemWithIconWarning
                              data={{
                                icon: level3.icon,
                                name: level3.name,
                                desc: level3.desc,
                                link: level3.link,
                                target: level3.target,
                              }}
                              key={`${level3.name} - ${level3Index} - level3-item`}
                            />
                          </Flex>
                        ) : (
                          <Flex
                            mx={theme.sizes['2']}
                            px={theme.sizes['4']}
                            py={theme.sizes['2']}
                            className={'accordion__level3-inner-item'}
                            overflow={'hidden'}
                            width={'100%'}
                            borderRadius={theme.sizes['2']}
                          >
                            {level3.tag ? (
                              <ItemWithIcon
                                data={{
                                  icon: level3.icon,
                                  name: level3.name,
                                  desc: level3.desc,
                                  link: level3.link,
                                  target: level3.target,
                                  tag: level3.tag,
                                }}
                                key={`${level3.name} - ${level3Index} - level3-item`}
                              />
                            ) : (
                              <ItemWithIcon
                                data={{
                                  icon: level3.icon,
                                  name: level3.name,
                                  desc: level3.desc,
                                  link: level3.link,
                                  target: level3.target,
                                }}
                                key={`${level3.name} - ${level3Index} - level3-item`}
                              />
                            )}
                          </Flex>
                        )}
                      </Flex>
                    );
                  }
                })}
              {level2Data.level2.wallet && (
                <AddNetwork
                  options={level2Data.level2.wallet.options}
                  title={level2Data.level2.wallet.title}
                />
              )}
            </Flex>
          </Box>
        )}
        {level3Data.map((level3, index) => (
          <Flex
            display={'none'}
            key={index}
            as={'a'}
            href={level3.link}
            target={level3.target}
            data-analytics-id={level3.analyticsId}
          >
            {level3.name}
          </Flex>
        ))}
      </Box>
    </Box>
  );
};
