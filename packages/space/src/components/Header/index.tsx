import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { CloseIcon, MenuIcon } from '@bnb-chain/icons';

import { Menu } from '../Menu';
import { theme } from '../../modules/theme';

import { Logo } from './components/Logo';
import { HeaderWrapper } from './components/HeaderWrapper';
import { en } from './locales';
import type { IHeader } from './types';
import { HeaderButtons } from './components/HeaderButtons';
import { ANALYTICS_IDS } from './analytics';

const Provider = ({
  locale,
  messages,
  children,
}: Pick<IHeader, 'locale' | 'messages' | 'children'>) => {
  const _messages = useMemo(() => {
    return { ...(en as any), ...messages };
  }, [messages]);

  return (
    <IntlProvider locale={locale || 'en'} messages={_messages}>
      {children}
    </IntlProvider>
  );
};

export const Header = ({ locale, messages, isNotification, menus }: IHeader) => {
  const [show, setShow] = useState(false);
  const { colorMode } = useColorMode();
  const isGreenfield = (global as any).__GLOBAL_APP_NAME === 'greenfield-ui';

  const LogoLayout = (
    <Box
      height={theme.sizes['6']}
      cursor={'pointer'}
      as={'a'}
      href={`https://www.bnbchain.org/${locale}`}
      target={'_self'}
      aria-label={isGreenfield ? 'BNB GREENFIELD' : 'BNB Chain'}
      data-analytics-id={ANALYTICS_IDS['logo'].click_menu_home}
    >
      {isGreenfield ? <Logo.Greenfield /> : <Logo.Primary />}
    </Box>
  );

  const showIcon = (
    <Flex
      marginLeft={{
        base: 0,
        md: theme.sizes['5'],
        lg: 0,
      }}
      cursor={'pointer'}
    >
      {show && (
        <CloseIcon
          color={theme.colors[colorMode].button.primary.default}
          fontSize={theme.sizes['6']}
          onClick={() => {
            setShow(!show);
          }}
        />
      )}

      {!show && (
        <MenuIcon
          color={theme.colors[colorMode].button.primary.default}
          fontSize={theme.sizes['6']}
          onClick={() => {
            setShow(true);
          }}
        />
      )}
    </Flex>
  );
  if (isNotification) {
    return (
      <Provider locale={locale} messages={messages}>
        <>
          <HeaderWrapper display={{ base: 'none', lg: 'flex' }}>
            {LogoLayout}
            <Flex height={'100%'} display="flex" alignItems={'center'}>
              <Menu menus={menus} />
              <HeaderButtons />
            </Flex>
          </HeaderWrapper>
          <Flex
            display={{ base: 'none', md: 'flex', lg: 'none' }}
            position={'sticky'}
            top="0"
            left="0"
            right="0"
            height={
              show
                ? '100vh'
                : {
                    base: theme.sizes['16'],
                    md: theme.sizes['20'],
                    lg: theme.sizes['20'],
                  }
            }
            zIndex={theme.zIndices.dropdown}
          >
            <HeaderWrapper>
              <Flex flexDir={'column'} width={'100%'}>
                {!show && (
                  <Flex justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
                    {LogoLayout}
                    <Flex alignItems={'center'}>
                      <HeaderButtons />
                      {showIcon}
                    </Flex>
                  </Flex>
                )}
                {show && (
                  <Flex
                    position={'fixed'}
                    top={'0'}
                    zIndex={theme.zIndices.dropdown}
                    left={0}
                    width={'100%'}
                    flexDir={'column'}
                    flex={'1'}
                    overflow={'scroll'}
                    background={theme.colors[colorMode].background['1']}
                    height={'100vh'}
                  >
                    <HeaderWrapper>
                      <Flex justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
                        {LogoLayout}
                        <Flex alignItems={'center'}>
                          <HeaderButtons />
                          {showIcon}
                        </Flex>
                      </Flex>
                    </HeaderWrapper>
                    <Menu tablet menus={menus} />
                  </Flex>
                )}
              </Flex>
            </HeaderWrapper>
          </Flex>
          <Flex
            display={{ base: 'flex', md: 'none' }}
            height={
              show
                ? {
                    base: theme.sizes['16'],
                    md: theme.sizes['20'],
                    lg: theme.sizes['20'],
                  }
                : 'unset'
            }
            position={'sticky'}
            top="0"
            left="0"
            right="0"
            zIndex={theme.zIndices.dropdown}
          >
            <HeaderWrapper>
              {!show && (
                <Flex width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                  {LogoLayout}
                  {showIcon}
                </Flex>
              )}
              {show && (
                <Flex
                  position={'fixed'}
                  //better not to show the notification bar, since the height may change via devices
                  top={0}
                  left={0}
                  zIndex={theme.zIndices.dropdown}
                  width={'100%'}
                  flexDir={'column'}
                  height={`100vh`}
                  flex={'1'}
                  overflow={'scroll'}
                  background={theme.colors[colorMode].background['1']}
                >
                  <HeaderWrapper>
                    <Flex width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                      {LogoLayout}
                      {showIcon}
                    </Flex>
                  </HeaderWrapper>
                  <Menu mobile menus={menus} />
                  <HeaderButtons />
                </Flex>
              )}
            </HeaderWrapper>
          </Flex>
        </>
      </Provider>
    );
  }

  return (
    <Provider locale={locale} messages={messages}>
      <>
        <HeaderWrapper display={{ base: 'none', lg: 'flex' }}>
          {LogoLayout}
          <Flex height={'100%'} display="flex" alignItems={'center'}>
            <Menu menus={menus} />
            <HeaderButtons />
          </Flex>
        </HeaderWrapper>
        <Flex display={{ base: 'none', md: 'flex', lg: 'none' }} height={show ? '100vh' : 'unset'}>
          <Box
            width={'100%'}
            height={{
              base: theme.sizes['16'],
              md: theme.sizes['20'],
              lg: theme.sizes['20'],
            }}
          ></Box>
          <HeaderWrapper position={'fixed'}>
            <Flex flexDir={'column'} width={'100%'}>
              <Flex justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
                {LogoLayout}
                <Flex alignItems={'center'}>
                  <HeaderButtons />
                  {showIcon}
                </Flex>
              </Flex>
              {show && (
                <Flex
                  position={'fixed'}
                  top={theme.sizes['20']}
                  zIndex={theme.zIndices.dropdown}
                  left={0}
                  width={'100vw'}
                  flexDir={'column'}
                  flex={'1'}
                  overflow={'scroll'}
                  background={theme.colors[colorMode].background['1']}
                  height={`calc(100vh - ${theme.sizes['20']})`}
                >
                  <Menu tablet menus={menus} />
                </Flex>
              )}
            </Flex>
          </HeaderWrapper>
        </Flex>
        <Flex display={{ base: 'flex', md: 'none' }} height={show ? '100vh' : 'unset'}>
          <Box
            width={'100%'}
            height={{
              base: theme.sizes['16'],
              md: theme.sizes['20'],
              lg: theme.sizes['20'],
            }}
          ></Box>
          <HeaderWrapper position={'fixed'}>
            <Flex width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
              {LogoLayout}
              {showIcon}
            </Flex>
            {show && (
              <Flex
                position={'fixed'}
                top={theme.sizes['16']}
                zIndex={theme.zIndices.dropdown}
                left={0}
                width={'100%'}
                flexDir={'column'}
                height={`calc(100vh - ${theme.sizes['16']})`}
                flex={'1'}
                overflow={'scroll'}
                background={theme.colors[colorMode].background['1']}
              >
                <Menu mobile menus={menus} />
                <HeaderButtons />
              </Flex>
            )}
          </HeaderWrapper>
        </Flex>
      </>
    </Provider>
  );
};

Header.Provider = Provider;
