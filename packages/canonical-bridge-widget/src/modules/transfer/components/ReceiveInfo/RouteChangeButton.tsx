import { Box, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { ChangeRouteIcon } from '@/core/components/icons/ChangeRouteIcon';

export const RouteChangeButton = ({ onOpen }: { onOpen: () => void }) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const { formatMessage } = useIntl();
  return (
    <Flex
      flexDir={'row'}
      cursor={'pointer'}
      alignItems={'center'}
      gap={'1px'}
      fontSize={'12px'}
      fontWeight={500}
      color={theme.colors[colorMode].text.brand}
      _hover={{ color: theme.colors[colorMode].support.brand['1'] }}
      onClick={() => {
        onOpen();
      }}
    >
      <Box>{formatMessage({ id: 'route.button.change-routes' })}</Box>
      <ChangeRouteIcon w={'12px'} h={'12px'} />
    </Flex>
  );
};
