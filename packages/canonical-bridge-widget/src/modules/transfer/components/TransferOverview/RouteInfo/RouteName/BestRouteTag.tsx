import { Box, useColorMode, useIntl, useTheme } from '@bnb-chain/space';

type TBestRouteTag = {
  bestMode: 'bestTime' | 'bestReturn';
};

export const BestRouteTag = ({ bestMode }: TBestRouteTag) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  return (
    <Box
      p={'4px 8px'}
      borderRadius={'40px'}
      fontSize={'12px'}
      fontWeight={500}
      lineHeight={'16px'}
      h={'24px'}
      color={
        bestMode === 'bestTime'
          ? theme.colors[colorMode].support.brand['2']
          : bestMode === 'bestReturn'
          ? theme.colors[colorMode].support.success['2']
          : ''
      }
      background={
        bestMode === 'bestTime'
          ? theme.colors[colorMode].support.brand['5']
          : bestMode === 'bestReturn'
          ? theme.colors[colorMode].support.success['5']
          : ''
      }
    >
      {bestMode === 'bestTime'
        ? formatMessage({ id: 'route.option.tag.best-time' })
        : bestMode === 'bestReturn'
        ? formatMessage({ id: 'route.option.tag.highest-amount' })
        : null}
    </Box>
  );
};
