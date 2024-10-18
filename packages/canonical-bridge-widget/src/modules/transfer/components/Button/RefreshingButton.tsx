import { useEffect, useState } from 'react';
import { Box, BoxProps, useColorMode, useTheme } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setIsGlobalFeeLoading, setIsRefreshing } from '@/modules/transfer/action';
import { useLoadingBridgeFees } from '@/modules/transfer/hooks/useLoadingBridgeFees';
import { RefreshingIcon } from '@/modules/transfer/components/LoadingImg/RefreshingIcon';
import { useBridgeConfig } from '@/index';

export const RefreshingButton = (props: BoxProps) => {
  const { colorMode } = useColorMode();
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isRefreshing = useAppSelector((state) => state.transfer.isRefreshing);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const { loadingBridgeFees } = useLoadingBridgeFees();
  const bridgeConfig = useBridgeConfig();

  // Load estimated bridge fees every 30 seconds when there is bridge route available
  useEffect(() => {
    let mount = true;
    if (!mount) return;
    if (transferActionInfo) {
      let interval = setInterval(() => {
        dispatch(setIsGlobalFeeLoading(true));
        loadingBridgeFees();
      }, bridgeConfig.http.refetchingInterval ?? 30000);

      // Stop and restart fee loading
      if (isButtonPressed === true) {
        dispatch(setIsRefreshing(true));
        if (interval) {
          clearInterval(interval);
          dispatch(setIsGlobalFeeLoading(true));
          loadingBridgeFees();
          dispatch(setIsRefreshing(false));
          interval = setInterval(() => {
            dispatch(setIsGlobalFeeLoading(true));
            loadingBridgeFees();
          }, bridgeConfig.http?.refetchingInterval ?? 30000);
        }
        setIsButtonPressed(false);
      }

      return () => {
        mount = false;
        interval && clearInterval(interval);
        setIsButtonPressed(false);
      };
    } else {
      return () => {
        mount = false;
        setIsButtonPressed(false);
      };
    }
  }, [
    transferActionInfo,
    loadingBridgeFees,
    dispatch,
    isButtonPressed,
    bridgeConfig.http.refetchingInterval,
  ]);

  return transferActionInfo ? (
    <Box
      cursor={!isGlobalFeeLoading && !isRefreshing ? 'pointer' : 'not-allowed'}
      color={theme.colors[colorMode].button.refresh.text}
      _hover={{
        color:
          !isGlobalFeeLoading && !isRefreshing
            ? theme.colors[colorMode].support.brand['4']
            : theme.colors[colorMode].button.refresh.text,
      }}
      onClick={() => {
        setIsButtonPressed(true);
        dispatch(setIsRefreshing(true));
      }}
      {...props}
    >
      <RefreshingIcon />
    </Box>
  ) : null;
};
