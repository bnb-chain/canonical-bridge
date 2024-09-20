import {
  Box,
  Flex,
  SkeletonCircle,
  useBreakpointValue,
  useColorMode,
  useIntl,
  useTheme,
} from '@bnb-chain/space';
import { ReactNode, useEffect, useMemo } from 'react';

import {
  setEstimatedAmount,
  setIsGlobalFeeLoading,
  setIsRefreshing,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { CBridgeOption } from '@/modules/transfer/components/TransferOverview/CBridgeOption';
import { DeBridgeOption } from '@/modules/transfer/components/TransferOverview/DeBridgeOption';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useLoadingBridgeFees } from '@/modules/transfer/hooks/useLoadingBridgeFees';
import { StarGateOption } from '@/modules/transfer/components/TransferOverview/StarGateOption';
import { LayerZeroOption } from '@/modules/transfer/components/TransferOverview/LayerZeroOption';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { RefreshingButton } from '@/modules/transfer/components/Button/RefreshingButton';
import { RouteSkeleton } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteSkeleton';

interface TransferOverviewProps {
  routeContentBottom?: React.ReactNode;
}

export function TransferOverview({ routeContentBottom }: TransferOverviewProps) {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const { loadingBridgeFees } = useLoadingBridgeFees();
  const { getSortedReceiveAmount } = useGetReceiveAmount();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const toTokenInfo = useAppSelector((state) => state.transfer.toToken);
  const bridgeType = useAppSelector((state) => state.transfer.transferActionInfo)?.bridgeType;

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);

  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  useEffect(() => {
    if (isBase) return;
    if (sendValue === debouncedSendValue) {
      dispatch(setTransferActionInfo(undefined));
      if (!selectedToken || !Number(debouncedSendValue)) {
        dispatch(setEstimatedAmount(undefined));
        dispatch(setIsRefreshing(false));
        return;
      }
      dispatch(setIsGlobalFeeLoading(true));
      dispatch(setIsRefreshing(true));
      loadingBridgeFees();
      dispatch(setIsRefreshing(false));
    }
  }, [selectedToken, debouncedSendValue, dispatch, sendValue, loadingBridgeFees, isBase]);

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

  const showRoute = selectedToken && !!Number(sendValue) && toTokenInfo;

  const sortedOptions = useMemo(() => {
    if (!options?.length) return options;

    return options.sort((a) => {
      return a.key === bridgeType ? -1 : 0;
    });
  }, [options, bridgeType]);

  return (
    <Flex flexDir="column" ml={['0', '0', '0', '24px']} gap={['12px', '12px', '12px', '24px']}>
      {showRoute && (
        <Box overflow={['auto', 'auto', 'auto', 'hidden']}>
          <Box
            position={'relative'}
            borderRadius={'24px'}
            py={['0', '0', '0', '24px']}
            background={theme.colors[colorMode].background.route}
            maxW={['auto', 'auto', 'auto', '384px']}
            w={'100%'}
          >
            <Flex flexDir={'column'} gap={'12px'}>
              {!isBase ? (
                <Flex
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  px={['0', '0', '0', '24px']}
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
                  {!sortedOptions.length || isGlobalFeeLoading ? (
                    <SkeletonCircle w={'32px'} h={'32px'} />
                  ) : !isBase ? (
                    <RefreshingButton />
                  ) : null}
                </Flex>
              ) : null}
              <Box
                px={['0', '0', '0', '24px']}
                flex={1}
                overflow={'auto'}
                overscrollBehavior={'contain'}
                maxHeight={'698px'}
                w={['auto', 'auto', 'auto', '384px']}
              >
                {!sortedOptions.length || isGlobalFeeLoading ? (
                  <Flex flexDir={'column'} gap={'12px'}>
                    <RouteSkeleton />
                    <RouteSkeleton />
                    <RouteSkeleton />
                  </Flex>
                ) : (
                  <Flex
                    flexDir={'column'}
                    gap={'12px'}
                    display={isGlobalFeeLoading ? 'none' : 'flex'}
                  >
                    {sortedOptions?.map((bridge: ReactNode) => bridge)}
                  </Flex>
                )}
              </Box>
            </Flex>
          </Box>
        </Box>
      )}
      <Box>{routeContentBottom ? routeContentBottom : null}</Box>
    </Flex>
  );
}
