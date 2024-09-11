import { useEffect, useState } from 'react';
import { Box, useColorMode } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setIsRefreshing } from '@/modules/transfer/action';
import { ESTIMATE_AMOUNT_DATA_RELOAD } from '@/core/constants';
import { useLoadingBridgeFees } from '@/modules/transfer/hooks/useLoadingBridgeFees';
import { RefreshingIcon } from '@/modules/transfer/components/LoadingImg/RefreshingIcon';

export const RefreshingButton = () => {
  const { colorMode } = useColorMode();
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const isRefreshing = useAppSelector((state) => state.transfer.isRefreshing);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const theme = useAppSelector((state) => state.theme.themeConfig);
  const dispatch = useAppDispatch();
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const { loadingBridgeFees } = useLoadingBridgeFees();

  // Load estimated bridge fees every 30 seconds when there is bridge route available
  useEffect(() => {
    let mount = true;
    if (!mount) return;
    if (transferActionInfo) {
      let interval = setInterval(() => {
        loadingBridgeFees();
      }, ESTIMATE_AMOUNT_DATA_RELOAD);

      // Stop and restart fee loading
      if (isButtonPressed === true) {
        dispatch(setIsRefreshing(false));
        if (interval) {
          clearInterval(interval);
          loadingBridgeFees();
          dispatch(setIsRefreshing(true));
          interval = setInterval(() => {
            loadingBridgeFees();
          }, ESTIMATE_AMOUNT_DATA_RELOAD);
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
  }, [transferActionInfo, loadingBridgeFees, dispatch, isButtonPressed]);

  return transferActionInfo ? (
    <Box
      cursor={!isGlobalFeeLoading && isRefreshing ? 'pointer' : 'not-allowed'}
      color={theme.colors[colorMode].button.refresh.text}
      _hover={{
        color:
          !isGlobalFeeLoading && isRefreshing
            ? theme.colors[colorMode].support.brand['4']
            : theme.colors[colorMode].button.refresh.text,
      }}
      onClick={() => {
        setIsButtonPressed(true);
        dispatch(setIsRefreshing(false));
      }}
    >
      <RefreshingIcon />
    </Box>
  ) : null;
};
