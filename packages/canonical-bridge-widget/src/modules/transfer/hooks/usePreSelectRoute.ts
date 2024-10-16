import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setTransferActionInfo } from '@/modules/transfer/action';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';

export const usePreSelectRoute = () => {
  const dispatch = useAppDispatch();
  const { bridgeAddress: cBridgeAddress } = useCBridgeTransferParams();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const preSelectRoute = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response: any, bridgeType: BridgeType) => {
      const [debridgeEst, cbridgeEst, stargateEst, layerZeroEst, mesonEst] = response;

      if (bridgeType === 'deBridge' && debridgeEst.status === 'fulfilled') {
        dispatch(
          setTransferActionInfo({
            bridgeType: 'deBridge',
            bridgeAddress: debridgeEst.value.tx?.to as `0x${string}`,
            data: debridgeEst.value.tx?.data,
            value: debridgeEst.value.tx?.value,
            orderId: debridgeEst.value.orderId,
          }),
        );
      } else if (bridgeType === 'cBridge' && cBridgeAddress && cbridgeEst.status === 'fulfilled') {
        dispatch(
          setTransferActionInfo({
            bridgeType: 'cBridge',
            bridgeAddress: cBridgeAddress as `0x${string}`,
          }),
        );
      } else if (
        bridgeType === 'stargate' &&
        selectedToken?.stargate?.raw?.bridgeAddress &&
        stargateEst.status === 'fulfilled'
      ) {
        dispatch(
          setTransferActionInfo({
            bridgeType: 'stargate',
            bridgeAddress: selectedToken?.stargate?.raw?.bridgeAddress as `0x${string}`,
          }),
        );
      } else if (bridgeType === 'layerZero' && layerZeroEst.status === 'fulfilled') {
        dispatch(
          setTransferActionInfo({
            bridgeType: 'layerZero',
            bridgeAddress: selectedToken?.layerZero?.raw?.bridgeAddress as `0x${string}`,
          }),
        );
      } else if (
        bridgeType === 'meson' &&
        mesonEst.status === 'fulfilled' &&
        fromChain?.meson?.raw?.address
      ) {
        dispatch(
          setTransferActionInfo({
            bridgeType: 'meson',
            bridgeAddress: fromChain?.meson?.raw?.address as `0x${string}`,
          }),
        );
      }
    },
    [
      dispatch,
      selectedToken?.layerZero?.raw?.bridgeAddress,
      selectedToken?.stargate?.raw?.bridgeAddress,
      cBridgeAddress,
      fromChain?.meson?.raw,
    ],
  );

  return { preSelectRoute };
};
