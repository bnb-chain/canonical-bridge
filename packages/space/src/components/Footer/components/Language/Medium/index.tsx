import { CaretDownIcon, CaretUpIcon, GlobeIcon } from '@bnb-chain/icons';
import {
  Box,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useColorMode,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { useIntl } from 'react-intl';

import { SUPPORTED_LOCALES, getTextByLocale } from '../../../../../modules/intl/constants';
import { theme } from '../../../../../modules/theme';
import { Typography } from '../../../../Typography';
import { Context } from '../../../context';
import { toLocalePathname } from '../../../utils';

export const Medium = () => {
  const { colorMode } = useColorMode();
  const { locale } = useIntl();

  const { pathname } = useContext(Context);

  return (
    <Menu placement="top-end">
      {({ isOpen }) => (
        <>
          <MenuButton
            color={
              isOpen ? theme.colors[colorMode].text.brand : theme.colors[colorMode].text.secondary
            }
          >
            <Box display="flex" alignItems="center">
              <GlobeIcon fontSize={theme.sizes['5']} />
              &nbsp;
              <Typography as="span" variant="body" size="sm">
                {getTextByLocale(locale)}
              </Typography>
              {isOpen ? (
                <CaretUpIcon fontSize={theme.sizes['5']} />
              ) : (
                <CaretDownIcon fontSize={theme.sizes['5']} />
              )}
            </Box>
          </MenuButton>

          <MenuList
            bg={theme.colors[colorMode].layer[3].default}
            borderRadius={theme.sizes['2']}
            py={theme.sizes['2']}
            border="none"
            boxShadow="none"
          >
            <MenuOptionGroup defaultValue={locale} type="radio">
              {Object.keys(SUPPORTED_LOCALES).map((it) => (
                <MenuItemOption
                  icon={null}
                  value={it}
                  as="a"
                  href={toLocalePathname(pathname, it)}
                  px={theme.sizes['6']}
                  py={theme.sizes['3']}
                  key={it}
                  w="100%"
                  color={
                    it === locale
                      ? theme.colors[colorMode].text.brand
                      : theme.colors[colorMode].text.secondary
                  }
                  bg="none"
                  _hover={{
                    bg: theme.colors[colorMode].layer[3].hover,
                    color:
                      it === locale
                        ? theme.colors[colorMode].text.brand
                        : theme.colors[colorMode].text.secondary,
                  }}
                >
                  <Typography variant="label" size="md" fontWeight={it === locale ? 500 : 400}>
                    {SUPPORTED_LOCALES[it]}
                  </Typography>
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
