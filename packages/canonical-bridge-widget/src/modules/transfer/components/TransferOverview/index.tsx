import { Box, Flex, useColorMode, useIntl, useTheme } from '@bnb-chain/space';
import { ReactNode, useEffect, useMemo } from 'react';

import {
  setEstimatedAmount,
  setIsRefreshing,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { CBridgeOption } from '@/modules/transfer/components/TransferOverview/CBridgeOption';
import { DeBridgeOption } from '@/modules/transfer/components/TransferOverview/DeBridgeOption';
import { NoRouteFound } from '@/modules/transfer/components/TransferOverview/NoRouteFound';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useLoadingBridgeFees } from '@/modules/transfer/hooks/useLoadingBridgeFees';
import { StarGateOption } from '@/modules/transfer/components/TransferOverview/StarGateOption';
import { LayerZeroOption } from '@/modules/transfer/components/TransferOverview/LayerZeroOption';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { RefreshingButton } from '@/modules/transfer/components/Button/RefreshingButton';
import { RouteSkeleton } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteSkeleton';

export function TransferOverview() {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const { getSortedReceiveAmount } = useGetReceiveAmount();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const toTokenInfo = useAppSelector((state) => state.transfer.toToken);
  const bridgeType = useAppSelector((state) => state.transfer.transferActionInfo)?.bridgeType;
  const theme = useTheme();

  const { loadingBridgeFees } = useLoadingBridgeFees();

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);

  useEffect(() => {
    if (sendValue === debouncedSendValue) {
      dispatch(setTransferActionInfo(undefined));
      if (!selectedToken || !Number(debouncedSendValue)) {
        dispatch(setEstimatedAmount(undefined));
        dispatch(setIsRefreshing(false));
        return;
      }
      loadingBridgeFees();
      dispatch(setIsRefreshing(true));
    }
  }, [selectedToken, debouncedSendValue, dispatch, sendValue, loadingBridgeFees]);

  const sortedReceivedAmt = useMemo(() => getSortedReceiveAmount(), [getSortedReceiveAmount]);
  const options = useMemo(() => {
    if (
      !Number(debouncedSendValue) ||
      !estimatedAmount ||
      !sortedReceivedAmt ||
      Object.values(sortedReceivedAmt).every((value) => value === null || value === undefined)
    ) {
      return [];
    }
    const routes = [];
    for (const bridge in sortedReceivedAmt) {
      if (bridge === 'cBridge' && estimatedAmount?.['cBridge']) {
        routes.push(<CBridgeOption key={'cbridge-option'} />);
      }
      if (bridge === 'deBridge' && estimatedAmount?.['deBridge']) {
        routes.push(<DeBridgeOption key={'debridge-option'} />);
      }
      if (bridge === 'stargate' && estimatedAmount['stargate']) {
        routes.push(<StarGateOption key={'stargate-option'} />);
      }
      if (bridge === 'layerZero' && estimatedAmount['layerZero']) {
        routes.push(<LayerZeroOption key={'layerZero-option'} />);
      }
    }
    return routes;
  }, [sortedReceivedAmt, debouncedSendValue, estimatedAmount]);

  // console.log('sorted received amount', sortedReceivedAmt, options);

  const showRoute = selectedToken && sendValue && toTokenInfo;

  const sortedOptions = useMemo(() => {
    if (!options?.length) return options;

    return options.sort((a) => {
      return a.key === bridgeType ? -1 : 0;
    });
  }, [options]);

  return (
    <Flex flexDir="column" ml={'24px'} gap={'24px'}>
      {showRoute && (
        <Box overflow={'hidden'}>
          <Box
            position={'relative'}
            py={'24px'}
            borderRadius={'24px'}
            background={theme.colors[colorMode].background.route}
            minW="384px"
          >
            <Flex flexDir={'column'} gap={'12px'}>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                px={'24px'}
                color={theme.colors[colorMode].text.route.title}
                fontSize={'14px'}
                h={'32px'}
                sx={{
                  svg: {
                    w: '32px',
                    h: '32px',
                  },
                }}
              >
                {formatMessage({ id: 'route.title' })}
                <RefreshingButton />
              </Flex>
              <Box
                px={'24px'}
                pb={'24px'}
                flex={1}
                overflow={'auto'}
                overscrollBehavior={'contain'}
                maxHeight={'500px'}
              >
                {!isGlobalFeeLoading &&
                sortedOptions?.length === 0 &&
                !!debouncedSendValue &&
                !!selectedToken &&
                toChain ? (
                  <NoRouteFound />
                ) : !sortedOptions.length || isGlobalFeeLoading ? (
                  <RouteSkeleton />
                ) : (
                  <Flex
                    flexDir={'column'}
                    gap={'24px'}
                    display={isGlobalFeeLoading ? 'none' : 'flex'}
                  >
                    {sortedOptions?.map((bridge: ReactNode) => {
                      return bridge;
                    })}
                  </Flex>
                )}
              </Box>
            </Flex>
          </Box>
        </Box>
      )}
    </Flex>
  );
}
