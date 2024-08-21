import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';

import { ICBridgeMaxMinSendAmt } from '@/modules/bridges/cbridge/types';
import { bridgeSDK } from '@/core/constants/bridgeSDK';

export const useCBridgeSendMaxMin = ({
  bridgeAddress,
  tokenAddress,
  isPegged = false,
}: {
  bridgeAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  isPegged?: boolean;
}) => {
  const [minMaxSendAmt, setMinMaxSendAmt] = useState<ICBridgeMaxMinSendAmt>({
    min: 0n,
    max: 0n,
  });
  const publicClient = usePublicClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (isPegged || !publicClient) {
          return;
        }
        const { min, max } = await bridgeSDK.cBridge.getSendRange({
          bridgeAddress,
          tokenAddress,
          client: publicClient,
        });

        setMinMaxSendAmt({
          min,
          max,
        });
      } catch (error: any) {
        setError(error.message);
        // eslint-disable-next-line no-console
        console.log('error', error);
      }
    })();
  }, [tokenAddress, isPegged, bridgeAddress, publicClient]);

  return {
    minMaxSendAmt,
    error,
  };
};
