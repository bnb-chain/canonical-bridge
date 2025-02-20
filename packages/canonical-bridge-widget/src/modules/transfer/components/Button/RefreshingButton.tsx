import { Box, BoxProps, IconProps, useColorMode, useTheme } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setIsManuallyReload, setIsRefreshing } from '@/modules/transfer/action';
import { RefreshingIcon } from '@/modules/transfer/components/LoadingImg/RefreshingIcon';
import { useBridgeConfig } from '@/index';

export const RefreshingButton = ({
  iconProps,
  boxProps,
}: {
  iconProps?: IconProps;
  boxProps?: BoxProps;
}) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const isRefreshing = useAppSelector((state) => state.transfer.isRefreshing);

  const bridgeConfig = useBridgeConfig();

  return transferActionInfo ? (
    <Box
      className={'bccb-widget-refreshing-button'}
      cursor={!isGlobalFeeLoading && !isRefreshing ? 'pointer' : 'not-allowed'}
      color={theme.colors[colorMode].button.refresh.text}
      _hover={{
        color:
          !isGlobalFeeLoading && !isRefreshing
            ? theme.colors[colorMode].support.brand['4']
            : theme.colors[colorMode].button.refresh.text,
      }}
      onClick={() => {
        dispatch(setIsManuallyReload(true));
        dispatch(setIsRefreshing(true));
      }}
      {...boxProps}
    >
      {bridgeConfig.components.refreshingIcon ?? <RefreshingIcon {...iconProps} />}
    </Box>
  ) : null;
};
