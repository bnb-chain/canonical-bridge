import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  Link,
  useColorMode,
  Box,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  MenuItemOption,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import { CaretDownIcon, GlobeIcon } from '@bnb-chain/icons';
import { useContext } from 'react';
import { useIntl } from 'react-intl';

import { getTextByLocale, SUPPORTED_LOCALES } from '../../../../../modules/intl/constants';
import { theme } from '../../../../../modules/theme';
import { Typography } from '../../../../Typography';
import { Context } from '../../../context';
import { toLocalePathname } from '../../../utils';

export const Base = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { locale } = useIntl();

  const { pathname } = useContext(Context);

  return (
    <>
      <Link
        as="button"
        onClick={onOpen}
        outline="none"
        border="none"
        bg="none"
        textDecoration="none"
        color={theme.colors[colorMode].text.secondary}
        _hover={{
          color: theme.colors[colorMode].text.brand,
        }}
      >
        <Box display="flex" alignItems="center">
          <GlobeIcon fontSize={theme.sizes['5']} />
          &nbsp;
          <Typography as="span" variant="body" size="sm">
            {getTextByLocale(locale)}
          </Typography>
          <CaretDownIcon fontSize={theme.sizes['5']} />
        </Box>
      </Link>

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerBody p={0}>
              <Menu isOpen={isOpen}>
                <MenuButton />
                <MenuList
                  bg={theme.colors[colorMode].layer[3].default}
                  borderRadius={`${theme.sizes['6']} ${theme.sizes['6']} 0 0`}
                  pt={theme.sizes['5']}
                  pb={0}
                  w="100vw"
                  minW="100vw"
                  boxShadow="none"
                  border="none"
                  sx={{
                    '> div': {
                      maxH: '45vh',
                      overflowY: 'scroll',
                      mb: `-${theme.sizes['4']}`,
                    },
                  }}
                >
                  <Divider
                    h={theme.sizes['1']}
                    w={theme.sizes['8']}
                    m="auto"
                    mb={theme.sizes['4']}
                    bgColor={theme.colors[colorMode].border.disabled}
                    border="none"
                  />
                  <MenuOptionGroup defaultValue={locale} type="radio">
                    {Object.keys(SUPPORTED_LOCALES).map((it) => (
                      <MenuItemOption
                        key={it}
                        as="a"
                        href={toLocalePathname(pathname, it)}
                        value={it}
                        icon={null}
                        textAlign="center"
                        w="100%"
                        px={0}
                        py={theme.sizes['4']}
                        bg="none"
                        _active={{ bg: 'none' }}
                        _focus={{ bg: 'none' }}
                        _last={{
                          pb: theme.sizes['6'],
                        }}
                      >
                        <Typography
                          variant="label"
                          size="lg"
                          fontWeight={it === locale ? 700 : 400}
                          color={
                            it === locale
                              ? theme.colors[colorMode].text.brand
                              : theme.colors[colorMode].text.secondary
                          }
                        >
                          {SUPPORTED_LOCALES[it]}
                        </Typography>
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};
