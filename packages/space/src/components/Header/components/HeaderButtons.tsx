import { Box, Button, FlexProps } from '@chakra-ui/react';
import { useIntl } from 'react-intl';

import { theme } from '../../../modules/theme';
import { ANALYTICS_IDS } from '../analytics';
import { ButtonListProps } from '../types';

export const HeaderButtons = ({ ...otherProps }: FlexProps) => {
  const { formatMessage, locale } = useIntl();
  const isGreenfield = (global as any).__GLOBAL_APP_NAME === 'greenfield-ui';

  const buttonList: ButtonListProps = [
    {
      name: formatMessage({
        id: 'header.contact-us',
      }),
      variant: 'outline',
      href: `https://www.bnbchain.org/${locale}/contact`,
      analyticsId: ANALYTICS_IDS['contact'].click_menu_contactUs,
    },
    !isGreenfield
      ? {
          name: formatMessage({
            id: 'header.start-building',
          }),
          variant: 'solid',
          href: `https://developer.bnbchain.org/`,
          analyticsId: ANALYTICS_IDS['contact'].click_menu_developerHome,
          target: '_blank',
        }
      : {
          name: formatMessage({
            id: 'header.greenfield.go-to-console',
          }),
          variant: 'solid',
          target: '_blank',
          href: `https://dcellar.io/connect-wallet`,
          analyticsId: ANALYTICS_IDS['contact'].click_menu_developerHome,
        },
  ];
  return (
    <Box
      display={'flex'}
      flexDir={{ base: 'column', md: 'row', lg: 'row' }}
      px={{
        base: theme.sizes['5'],
        md: 0,
        lg: 0,
      }}
      {...otherProps}
    >
      {buttonList.map((e, i) => {
        return (
          <Button
            key={i}
            as={'a'}
            size="lg"
            target={e.target ?? '_self'}
            variant={e.variant}
            href={e.href}
            fontWeight={500}
            cursor={'pointer'}
            disabled
            data-analytics-id={e.analyticsId}
            marginRight={theme.sizes['4']}
            marginBottom={{
              base: theme.sizes['4'],
              md: 0,
              lg: 0,
            }}
            fontSize={theme.sizes['3.5']}
            height={theme.sizes['10']}
            py={theme.sizes['3']}
            px={theme.sizes['4']}
            width={{
              base: '100%',
              md: 'fit-content',
              lg: 'fit-content',
            }}
            sx={{
              '&:last-child': {
                marginRight: 0,
                order: {
                  base: -1,
                  md: 'unset',
                  lg: 'unset',
                },
              },
            }}
          >
            {e.name}
          </Button>
        );
      })}
    </Box>
  );
};
