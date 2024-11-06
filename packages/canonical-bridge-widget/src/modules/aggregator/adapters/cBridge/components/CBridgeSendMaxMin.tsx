import { memo, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setCBridgeMaxMinSendAmt } from '@/modules/aggregator/action';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams.ts';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK.ts';

interface CBridgeSendMaxMinProps {
  isDisabled?: boolean;
}

export const CBridgeSendMaxMin = memo<CBridgeSendMaxMinProps>(function CBridgeSendMaxMin({
  isDisabled = false,
}) {
  const { bridgeAddress } = useCBridgeTransferParams();
  const bridgeSDK = useBridgeSDK();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publicClient = usePublicClient({ chainId: fromChain?.id }) as any;
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        if (
          selectedToken?.isPegged ||
          !publicClient ||
          !bridgeAddress ||
          !selectedToken?.address ||
          isDisabled ||
          !bridgeSDK?.cBridge
        ) {
          dispatch(setCBridgeMaxMinSendAmt({ min: '0', max: '0' }));
          return;
        }

        const { min, max } = await bridgeSDK.cBridge.getSendRange({
          bridgeAddress: bridgeAddress as `0x${string}`,
          tokenAddress: selectedToken?.address as `0x${string}`,
          client: publicClient,
        });

        dispatch(
          setCBridgeMaxMinSendAmt({
            min: formatUnits(min, selectedToken?.decimals),
            max: formatUnits(max, selectedToken?.decimals),
          }),
        );

        // eslint-disable-next-line
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error);
      }
    })();
  }, [
    dispatch,
    selectedToken?.address,
    selectedToken?.isPegged,
    selectedToken?.decimals,
    publicClient,
    bridgeAddress,
    isDisabled,
    bridgeSDK?.cBridge,
  ]);

  return null;
});
