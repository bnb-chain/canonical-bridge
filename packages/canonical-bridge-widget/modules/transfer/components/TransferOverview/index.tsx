import { Box, Flex, Skeleton, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { ReactNode, useEffect, useMemo } from 'react';

import {
  setEstimatedAmount,
  setIsRefreshing,
  setTransferActionInfo,
} from '@/modules/transfer/action';
import { useAppDispatch, useAppSelector } from '@/core/store/hooks';
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
    const bridges = [];
    for (const bridge in sortedReceivedAmt) {
      if (bridge === 'cBridge' && Number(estimatedAmount?.['cBridge']?.estimated_receive_amt) > 0) {
        bridges.push(<CBridgeOption key={'cbridge-option'} />);
      }
      if (
        bridge === 'deBridge' &&
        estimatedAmount?.['deBridge'] &&
        estimatedAmount?.['deBridge']?.estimation?.dstChainTokenOut?.amount &&
        Number(estimatedAmount?.['deBridge']?.estimation?.dstChainTokenOut?.amount) > 0
      ) {
        bridges.push(<DeBridgeOption key={'debridge-option'} />);
      }
      if (
        bridge === 'stargate' &&
        estimatedAmount['stargate']?.[2]?.amountReceivedLD &&
        Number(estimatedAmount['stargate']?.[2]?.amountReceivedLD) > 0
      ) {
        bridges.push(<StarGateOption key={'stargate-option'} />);
      }
      if (bridge === 'layerZero' && Number(estimatedAmount['layerZero']) > 0) {
        bridges.push(<LayerZeroOption key={'layerZero-option'} />);
      }
    }
    return bridges;
  }, [sortedReceivedAmt, debouncedSendValue, estimatedAmount]);

  const showRoute = selectedToken && sendValue && toTokenInfo;

  const sortedOptions = useMemo(() => {
    if (!options?.length) return options;

    return options.sort((a) => {
      return a.key === bridgeType ? -1 : 0;
    });
  }, [options, bridgeType]);

  return (
    <Flex flexDir="column" ml={theme.sizes['6']} gap={theme.sizes['6']}>
      {showRoute && (
        <Box overflow={'hidden'}>
          <Box
            position={'relative'}
            py={theme.sizes['6']}
            borderRadius={theme.sizes['6']}
            background={theme.colors[colorMode].layer['3'].default}
            minW="384px"
          >
            <Flex flexDir={'column'} gap={theme.sizes['3']}>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                px={theme.sizes['6']}
                color={theme.colors[colorMode].text.tertiary}
                fontSize={theme.sizes['3.5']}
                h={theme.sizes['8']}
                sx={{
                  svg: {
                    w: theme.sizes['8'],
                    h: theme.sizes['8'],
                  },
                }}
              >
                {formatMessage({ id: 'route.title' })}
                {/* <RefreshingButton /> */}
              </Flex>
              <Box
                px={theme.sizes['6']}
                pb={theme.sizes['6']}
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
                  <Skeleton height={'144px'} />
                ) : (
                  <Flex
                    flexDir={'column'}
                    gap={theme.sizes['6']}
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
