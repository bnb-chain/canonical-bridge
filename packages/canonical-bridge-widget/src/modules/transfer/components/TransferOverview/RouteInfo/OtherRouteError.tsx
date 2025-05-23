import { InfoCircleIcon } from '@bnb-chain/icons';
import { Box, useColorMode, useTheme } from '@bnb-chain/space';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { useAppSelector } from '@/modules/store/StoreProvider';

interface OtherRouteErrorProps {
  bridgeType: BridgeType;
}

export const OtherRouteError = ({ bridgeType }: OtherRouteErrorProps) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const routeError = useAppSelector((state) => state.transfer.routeError);
  return routeError && routeError[bridgeType] ? (
    <Box
      className="bccb-widget-route-error"
      position={'static'}
      color={theme.colors[colorMode].route.warning}
      lineHeight={'16px'}
      sx={{
        '>svg': {
          verticalAlign: '-3px',
        },
      }}
    >
      <InfoCircleIcon className="error-icon" display={'inline'} w={'16px'} h={'16px'} />
      <Box
        className="error-text"
        ml={'4px'}
        display={'inline'}
        lineHeight={'16px'}
        fontSize={'14px'}
        fontWeight={400}
      >
        {routeError[bridgeType]}
      </Box>
    </Box>
  ) : null;
};
