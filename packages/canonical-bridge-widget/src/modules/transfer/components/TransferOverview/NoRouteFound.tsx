import {
  Flex,
  Typography,
  useBreakpointValue,
  useColorMode,
  useIntl,
  useTheme,
} from '@bnb-chain/space';

import { RouteNotFoundIcon } from '@/core/components/icons/RouteNotFoundIcon';

export const NoRouteFound = () => {
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
    </Flex>
  );
};
