import { Box, Flex, List, ListItem, useColorMode, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { IntlProvider, useIntl } from 'react-intl';

import { theme } from '../../modules/theme';
import { Typography } from '../Typography';

import { Language } from './components/Language';
import { Context } from './context';
import { useData } from './data';
import { en } from './locales';

export type FooterMenuItemProps = {
  title: string;
  href: string;
  target: '_self' | '_blank';
  'data-analytics-id': string;
};

export type FooterMenuProps = {
  menu: string;
  items: Array<FooterMenuItemProps>;
};

type Props = {
  locale: string;
  messages: Record<string, string>;
  pathname: string;
  menus?: FooterMenuProps[];
  localeSwitchable?: boolean;
};

const Component = ({
  menus,
  localeSwitchable = true,
}: {
  menus?: FooterMenuProps[];
  localeSwitchable?: boolean;
}) => {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  const data = useData();

  return (
    <Flex
      as="footer"
      flexDirection="column"
      justifyContent="center"
      bgColor={theme.colors[colorMode].layer[2].default}
      w="100%"
    >
      <Flex
        flexDirection="column"
        alignSelf="center"
        w="100%"
        maxW={{ base: '100%', lg: '1200px' }}
        px={{ base: theme.sizes['5'], md: theme.sizes['10'], lg: 0 }}
        pt={{ base: theme.sizes['16'], md: theme.sizes['20'], lg: theme.sizes['30'] }}
        pb={{ base: theme.sizes['16'], md: theme.sizes['20'], lg: theme.sizes['40'] }}
      >
        <Box
          display="grid"
          gridTemplateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          gap={{ base: theme.sizes['10'], md: theme.sizes['10'], lg: 0 }}
          w="100%"
        >
          {Object.entries(menus?.length ? menus : data).map(([k, v]) => (
            <VStack key={k} spacing={{ base: theme.sizes['5'] }} alignItems="start">
              <Typography
                variant="heading"
                size="sm"
                fontWeight="700"
                color={theme.colors[colorMode].text.primary}
              >
                {menus?.length ? v.menu : formatMessage({ id: `footer.${k}.title` })}
              </Typography>

              <List>
                {(menus?.length ? v.items : v).map((it: FooterMenuItemProps) => (
                  <ListItem key={it.title} lineHeight="150%" _notLast={{ mb: [theme.sizes['5']] }}>
                    <Typography
                      as="a"
                      variant="label"
                      size="lg"
                      color={theme.colors[colorMode].text.secondary}
                      href={it.href}
                      target={it.target}
                      data-analytics-id={it['data-analytics-id']}
                    >
                      {it.title}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </VStack>
          ))}
        </Box>
      </Flex>
      <Flex w="100%" borderTop={`1px solid ${theme.colors[colorMode].border[3]}`}>
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          w="100%"
          px={{ base: theme.sizes['5'], md: theme.sizes['10'], lg: theme.sizes['16'] }}
          py={{ base: theme.sizes['8'], md: theme.sizes['6'] }}
        >
          <Typography
            variant="body"
            size="sm"
            color={theme.colors[colorMode].text.secondary}
            textAlign="center"
            order={{ base: 1, md: 0 }}
            mt={{ base: theme.sizes['5'], md: 0 }}
          >
            © {new Date().getFullYear()} bnbchain.org. All rights reserved.
          </Typography>
          {localeSwitchable && <Language />}
        </Flex>
      </Flex>
    </Flex>
  );
};

export const Footer = ({ locale, pathname, menus, localeSwitchable, ...otherProps }: Props) => {
  const messages = useMemo(() => {
    return { ...(en as Record<string, string>), ...otherProps.messages };
  }, [otherProps.messages]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Context.Provider value={{ pathname }}>
        <Component menus={menus} localeSwitchable={localeSwitchable} />
      </Context.Provider>
    </IntlProvider>
  );
};
