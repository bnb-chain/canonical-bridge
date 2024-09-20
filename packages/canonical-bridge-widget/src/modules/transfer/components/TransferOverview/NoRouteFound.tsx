import {
  Box,
  Flex,
  Typography,
  useBreakpointValue,
  useColorMode,
  useIntl,
  useTheme,
} from '@bnb-chain/space';

import { RouteNotFoundIcon } from '@/core/components/icons/RouteNotFoundIcon';

interface NoRouteFoundProps {
  onOpen: () => void;
}

export const NoRouteFound = ({ onOpen }: NoRouteFoundProps) => {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  return (
    <Flex
      flexDir={'column'}
      w={'100%'}
      gap={'8px'}
      background={theme.colors[colorMode].receive.background}
      borderRadius={'8px'}
      p={[0, 0, 0, '24px 16px']}
    >
      <Flex justifyContent={'center'}>
        <RouteNotFoundIcon w={'40px'} h={'40px'} />
      </Flex>
      <Typography variant="body" size={'md'} textAlign={'center'} fontWeight={500}>
        {formatMessage({ id: 'route.no-found.title' })}
      </Typography>

      <Typography
        variant="body"
        size={'sm'}
        mt={[0, 0, 0, '-4px']}
        textAlign={'center'}
        color={theme.colors[colorMode].text.secondary}
      >
        {!isBase
          ? formatMessage({ id: 'route.no-found.desc' })
          : formatMessage({ id: 'route.no-found.mobile-desc' })}
      </Typography>
      {isBase && (
        <Box
          margin={'0 auto'}
          fontSize={'14px'}
          fontWeight={500}
          textDecoration={'underline'}
          color={theme.colors[colorMode].text.brand}
          cursor={'pointer'}
          _hover={{ color: theme.colors[colorMode].button.brand.hover }}
          onClick={onOpen}
        >
          {formatMessage({ id: 'route.no-found.mobile.view.routes.link' })}
        </Box>
      )}
    </Flex>
  );
};
