import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { formatUnits } from 'viem';

import { bridgeSDK } from '@/core/constants/bridgeSDK';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useCBridgeTransferParams } from '@/modules/aggregator/adapters/cBridge/hooks/useCBridgeTransferParams';
import { ICBridgeMaxMinSendAmt } from '@/modules/aggregator/adapters/cBridge/types';

export const useCBridgeSendMaxMin = (isDisabled = false) => {
  const { bridgeAddress } = useCBridgeTransferParams();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const publicClient = usePublicClient({ chainId: fromChain?.id });
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const [minMaxSendAmt, setMinMaxSendAmt] = useState<ICBridgeMaxMinSendAmt>({
    min: '0',
    max: '0',
  });
  useEffect(() => {
    (async () => {
      try {
        if (
          selectedToken?.isPegged ||
          !publicClient ||
          !bridgeAddress ||
          !selectedToken?.address ||
          isDisabled
        ) {
          return;
        }
        const { min, max } = await bridgeSDK.cBridge.getSendRange({
          bridgeAddress: bridgeAddress as `0x${string}`,
          tokenAddress: selectedToken?.address as `0x${string}`,
          client: publicClient,
        });

        setMinMaxSendAmt({
          min: formatUnits(min, selectedToken?.decimals),
          max: formatUnits(max, selectedToken?.decimals),
        });
        // eslint-disable-next-line
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error);
      }
    })();
  }, [selectedToken, publicClient, bridgeAddress, isDisabled]);

  return {
    minMaxSendAmt,
  };
};
