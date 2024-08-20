import { Box, Flex, Skeleton, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { ReactNode, useEffect, useMemo } from 'react';

import {
  setEstimatedAmount,
  setIsRefreshing,
  setReceiveValue,
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
import { DeBridgeSolanaOption } from '@/modules/transfer/solana/DeBridgeSolanaOption';
import { useSolanaTransferInfo } from '@/modules/transfer/hooks/useSolanaTransferInfo';

export function TransferOverview() {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading);
  const receiveValue = useAppSelector((state) => state.transfer.receiveValue);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { loadingBridgeFees } = useLoadingBridgeFees();

  const debouncedSendValue = useDebounce(sendValue, DEBOUNCE_DELAY);

  const { isSolanaTransfer, isAvailableAccount } = useSolanaTransferInfo();

  useEffect(() => {
    if (sendValue === debouncedSendValue) {
      if (isSolanaTransfer && !isAvailableAccount) {
        return;
      }

      dispatch(setTransferActionInfo(undefined));
      if (!selectedToken || !Number(debouncedSendValue)) {
        dispatch(setEstimatedAmount(undefined));
        dispatch(setReceiveValue(undefined));
        dispatch(setIsRefreshing(false));
        return;
      }
      loadingBridgeFees();
      dispatch(setIsRefreshing(true));
    }
  }, [
    selectedToken,
    debouncedSendValue,
    dispatch,
    sendValue,
    isSolanaTransfer,
    isAvailableAccount,
    loadingBridgeFees,
  ]);

  const options = useMemo(() => {
    if (!receiveValue || !Number(debouncedSendValue) || !estimatedAmount) {
      return [];
    }
    const bridges = [];
    const sortedReceivedAmt = Object.fromEntries(
      Object.entries(receiveValue).sort(([, a], [, b]) => b - a),
    );

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
        if (fromChain?.chainType === 'solana') {
          if (isAvailableAccount) {
            bridges.push(<DeBridgeSolanaOption key={'debridge-solana-option'} />);
          }
        } else {
          bridges.push(<DeBridgeOption key={'debridge-option'} />);
        }
      }
      if (
        bridge === 'stargate' &&
        estimatedAmount['stargate']?.[2]?.amountReceivedLD &&
        Number(estimatedAmount['stargate']?.[2]?.amountReceivedLD) > 0
      ) {
        bridges.push(<StarGateOption key={'stargate-option'} />);
      }
    }
    return bridges;
  }, [receiveValue, debouncedSendValue, estimatedAmount, fromChain?.chainType, isAvailableAccount]);

  if ((isSolanaTransfer && !isAvailableAccount) || !toChain) {
    return null;
  }

  return selectedToken && sendValue && receiveValue && Object.keys(receiveValue)?.length > 0 ? (
    <Flex flexDir={'column'} gap={theme.sizes['3']} mt={theme.sizes['6']}>
      <Box color={theme.colors[colorMode].text.tertiary} fontSize={theme.sizes['3.5']}>
        {formatMessage({ id: 'route.title' })}
      </Box>
      {isGlobalFeeLoading && selectedToken && <Skeleton height={'144px'} />}
      {!isGlobalFeeLoading &&
        options?.length === 0 &&
        !!debouncedSendValue &&
        !!selectedToken &&
        toChain && <NoRouteFound />}
      <Flex flexDir={'row'} gap={theme.sizes['2']} display={isGlobalFeeLoading ? 'none' : 'flex'}>
        {options?.map((bridge: ReactNode) => {
          return bridge;
        })}
      </Flex>
    </Flex>
  ) : null;
}
