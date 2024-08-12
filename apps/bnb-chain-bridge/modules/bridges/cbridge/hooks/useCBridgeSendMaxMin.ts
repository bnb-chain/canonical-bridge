import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

import { CBRIDGE } from '@/modules/bridges/cbridge/abi/bridge';
import { ICBridgeMaxMinSendAmt } from '@/modules/bridges/cbridge/types';
import { useAppSelector } from '@/core/store/hooks';
import { useRpcUrl } from '@/modules/bridges/main';

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
  const [error, setError] = useState<string | null>(null);

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const rpcLink = useRpcUrl(fromChain?.id);

  const rpcProvider = useMemo(
    () => (rpcLink ? new ethers.providers.JsonRpcProvider(rpcLink, 'any') : null),
    [rpcLink],
  );
  const contractInst = useMemo(
    () =>
      rpcProvider && bridgeAddress
        ? new ethers.Contract(bridgeAddress, CBRIDGE, rpcProvider)
        : null,
    [bridgeAddress, rpcProvider],
  );
  useEffect(() => {
    (async () => {
      try {
        if (!contractInst || isPegged) {
          return;
        }
        const min = await contractInst.minSend(tokenAddress);
        const max = await contractInst.maxSend(tokenAddress);

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
  }, [tokenAddress, contractInst, isPegged]);

  return {
    minMaxSendAmt,
    error,
  };
};
