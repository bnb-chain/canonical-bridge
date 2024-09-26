import { Box, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

import { ChangeRouteIcon } from '@/core/components/icons/ChangeRouteIcon';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const RouteChangeButton = ({ onOpen }: { onOpen: () => void }) => {
  const theme = useTheme();
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const { colorMode } = useColorMode();

  const { formatMessage } = useIntl();
  return (
    <Flex
      flexDir={'row'}
      cursor={'pointer'}
      alignItems={'center'}
      gap={'1px'}
      fontSize={'12px'}
      lineHeight={'16px'}
      fontWeight={500}
      color={theme.colors[colorMode].text.brand}
      _hover={{ color: theme.colors[colorMode].button.brand.hover }}
      onClick={() => {
        if (isGlobalFeeLoading) return;
        onOpen();
      }}
    >
      <Box>{formatMessage({ id: 'route.button.change-routes' })}</Box>
      <ChangeRouteIcon w={'12px'} h={'12px'} />
    </Flex>
  );
};
