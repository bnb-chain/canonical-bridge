import {
  Box,
  Flex,
  Typography,
  useBreakpointValue,
  useColorMode,
  useIntl,
  useTheme,
} from '@bnb-chain/space';
import { useMemo } from 'react';

import { RouteNotFoundIcon } from '@/core/components/icons/RouteNotFoundIcon';
import { useAppSelector } from '@/modules/store/StoreProvider';

interface NoRouteFoundProps {
  onOpen: () => void;
}

export const NoRouteFound = ({ onOpen }: NoRouteFoundProps) => {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  const isNoRoute = useMemo(() => {
    return (
      estimatedAmount && Object.values(estimatedAmount).every((element) => element === undefined)
    );
  }, [estimatedAmount]);

  return (
    <Flex
      className="bccb-widget-no-route-found-container"
      flexDir={'column'}
      w={'100%'}
      gap={'8px'}
      background={theme.colors[colorMode].receive.background}
      borderRadius={'8px'}
      p={[0, 0, 0, '0 16px']}
    >
      <Flex className="bccb-widget-no-route-found-icon" justifyContent={'center'}>
        <RouteNotFoundIcon w={'40px'} h={'40px'} />
      </Flex>
      <Typography
        className="bccb-widget-no-route-found-title"
        variant="body"
        size={'md'}
        textAlign={'center'}
        fontWeight={500}
      >
        {formatMessage({ id: !isNoRoute ? 'route.adjust.title' : 'route.no-found.title' })}
      </Typography>

      <Typography
        className="bccb-widget-no-route-found-desc"
        variant="body"
        size={'sm'}
        mt={[0, 0, 0, '-4px']}
        textAlign={'center'}
        color={theme.colors[colorMode].text.secondary}
      >
        {!isBase
          ? formatMessage({ id: 'route.no-found.desc' })
          : formatMessage({ id: !isNoRoute ? 'route.adjust.desc' : 'route.no-found.desc' })}
      </Typography>
      {!isNoRoute && (
        <Box
          className="bccb-widget-no-route-found-link"
          display={{ base: 'block', lg: 'none' }}
          margin={'0 auto'}
          fontSize={'14px'}
          fontWeight={500}
          textDecoration={'underline'}
          color={theme.colors[colorMode].text.brand}
          cursor={'pointer'}
          _hover={{ color: theme.colors[colorMode].button.brand.hover }}
          onClick={onOpen}
        >
          {formatMessage({
            id: 'route.adjust.link',
          })}
        </Box>
      )}
    </Flex>
  );
};
