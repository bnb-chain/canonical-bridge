import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';

import { ICBridgeMaxMinSendAmt } from '@/modules/bridges/cbridge/types';
import { bridgeSDK } from '@/core/constants/bridgeSDK';
import { useAppSelector } from '@/core/store/hooks';

export const useCBridgeSendMaxMin = ({
  bridgeAddress,
  tokenAddress,
  isPegged = false,
}: {
  bridgeAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  isPegged?: boolean;
}) => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const publicClient = usePublicClient({ chainId: fromChain?.id });
  const [minMaxSendAmt, setMinMaxSendAmt] = useState<ICBridgeMaxMinSendAmt>({
    min: 0n,
    max: 0n,
  });
  useEffect(() => {
    (async () => {
      try {
        if (isPegged || !publicClient || !bridgeAddress || !tokenAddress) return;
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
        // eslint-disable-next-line no-console
        console.log('error', error);
      }
    })();
  }, [tokenAddress, isPegged, bridgeAddress, publicClient]);

  return {
    minMaxSendAmt,
  };
};
