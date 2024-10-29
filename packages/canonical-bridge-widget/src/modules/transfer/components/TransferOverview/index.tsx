import {
  Box,
  Flex,
  SkeletonCircle,
  useBreakpointValue,
  useColorMode,
  useIntl,
  useTheme,
  Collapse,
} from '@bnb-chain/space';
import { ReactNode, useEffect, useMemo } from 'react';

import {
  setEstimatedAmount,
  setIsGlobalFeeLoading,
  setIsRefreshing,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { DEBOUNCE_DELAY } from '@/core/constants';
import { useDebounce } from '@/core/hooks/useDebounce';
import { useLoadingBridgeFees } from '@/modules/transfer/hooks/useLoadingBridgeFees';
import { useGetReceiveAmount } from '@/modules/transfer/hooks/useGetReceiveAmount';
import { RefreshingButton } from '@/modules/transfer/components/Button/RefreshingButton';
import { RouteSkeleton } from '@/modules/transfer/components/TransferOverview/RouteInfo/RouteSkeleton';
import { CBridgeOption } from '@/modules/aggregator/adapters/cBridge/components/CBridgeOption';
import { DeBridgeOption } from '@/modules/aggregator/adapters/deBridge/components/DeBridgeOption';
import { StarGateOption } from '@/modules/aggregator/adapters/stargate/components/StarGateOption';
import { LayerZeroOption } from '@/modules/aggregator/adapters/layerZero/components/LayerZeroOption';
import { MesonOption } from '@/modules/aggregator/adapters/meson/components/MesonOption';

export function TransferOverview({ routeContentBottom }: { routeContentBottom?: ReactNode }) {
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

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);

  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;

  useEffect(() => {
    if (isBase) return;
    if (sendValue === debouncedSendValue) {
      dispatch(setTransferActionInfo(undefined));
      if (!selectedToken || !Number(debouncedSendValue)) {
        dispatch(setEstimatedAmount(undefined));
        dispatch(setIsRefreshing(false));
        dispatch(setIsGlobalFeeLoading(false));
        return;
      }
      dispatch(setIsGlobalFeeLoading(true));
      dispatch(setIsRefreshing(true));
      loadingBridgeFees();
      dispatch(setIsRefreshing(false));
    } else {
      dispatch(setIsGlobalFeeLoading(true));
    }
  }, [selectedToken, debouncedSendValue, dispatch, sendValue, loadingBridgeFees, isBase]);

  const sortedReceivedAmt = useMemo(() => getSortedReceiveAmount(), [getSortedReceiveAmount]);
  const options = useMemo(() => {
    if (
      !Number(debouncedSendValue) ||
      !estimatedAmount ||
      !sortedReceivedAmt ||
      Object.values(sortedReceivedAmt).every(
        (routeAmt) => routeAmt.value === null || routeAmt.value === undefined,
      )
    ) {
      return [];
    }
    const routes = [];
    for (const bridge in sortedReceivedAmt) {
      if (bridge === 'cBridge' && estimatedAmount?.['cBridge']) {
        routes.push(<CBridgeOption key={'cBridge-option'} />);
      }
      if (bridge === 'deBridge' && estimatedAmount?.['deBridge']) {
        routes.push(<DeBridgeOption key={'deBridge-option'} />);
      }
      if (bridge === 'stargate' && estimatedAmount['stargate']) {
        routes.push(<StarGateOption key={'stargate-option'} />);
      }
      if (bridge === 'layerZero' && estimatedAmount['layerZero']) {
        routes.push(<LayerZeroOption key={'layerZero-option'} />);
      }
      if (bridge === 'meson' && estimatedAmount['meson']) {
        routes.push(<MesonOption key={'meson-option'} />);
      }
    }
    return routes;
  }, [sortedReceivedAmt, debouncedSendValue, estimatedAmount]);

  const showRoute =
    selectedToken && !!Number(sendValue) && toTokenInfo && options && !!options?.length;

  return (
    <Flex
      flexDir="column"
      gap={['12px', '12px', '12px', '24px']}
      w={{ base: 'auto', lg: showRoute || !!routeContentBottom ? '408px' : 0 }}
      transition={'width 0.15s'}
    >
      <Box ml={{ base: 0, lg: '24px' }}>
        <Collapse in={!routeContentBottom ? true : showRoute} animateOpacity>
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
                <Flex
                  display={{ base: 'none', lg: 'flex' }}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  px={['0', '0', '0', '24px']}
                  color={theme.colors[colorMode].text.route.title}
                  fontSize={'14px'}
                  fontWeight={500}
                  h={'32px'}
                  sx={{
                    svg: {
                      w: '32px',
                      h: '32px',
                    },
                  }}
                >
                  {formatMessage({ id: 'route.title' })}
                  {!options.length || isGlobalFeeLoading ? (
                    <SkeletonCircle w={'32px'} h={'32px'} />
                  ) : !isBase ? (
                    <RefreshingButton />
                  ) : null}
                </Flex>
                <Box
                  px={['0', '0', '0', '24px']}
                  flex={1}
                  overflow={'auto'}
                  overscrollBehavior={'contain'}
                  maxHeight={'698px'}
                  w={['auto', 'auto', 'auto', '384px']}
                >
                  {!options || !options?.length || isGlobalFeeLoading ? (
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
                      {options?.map((bridge: ReactNode) => bridge)}
                    </Flex>
                  )}
                </Box>
              </Flex>
            </Box>
          </Box>
        </Collapse>
        <Box>{routeContentBottom ? routeContentBottom : null}</Box>
      </Box>
    </Flex>
  );
}
