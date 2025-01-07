import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useTrc20 } from '@/modules/aggregator/adapters/meson/hooks/useTrc20';

export const useGetTronAllowance = () => {
  const { getTrc20Allowance } = useTrc20();

  const [allowance, setAllowance] = useState<bigint | null>(null);

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);

  const getAllowance = useCallback(async () => {
    if (
      fromChain?.chainType !== 'tron' ||
      !selectedToken?.address ||
      !transferActionInfo?.bridgeAddress ||
      !Number(sendValue)
    ) {
      return;
    }

    try {
      const allowance = await getTrc20Allowance({
        trc20Address: selectedToken?.address,
        tronBridgeAddress: transferActionInfo?.bridgeAddress,
      });
      if (typeof allowance === 'bigint' && allowance !== null) {
        setAllowance(allowance);
      } else if (typeof allowance?.[0] === 'bigint') {
        setAllowance(allowance?.[0]);
      }
      // eslint-disable-next-line no-console
      console.log('Tron token allowance', allowance);
      return { allowance };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }, [
    fromChain,
    selectedToken?.address,
    transferActionInfo?.bridgeAddress,
    getTrc20Allowance,
    sendValue,
  ]);

  useEffect(() => {
    let mount = true;
    if (!mount) return;
    getAllowance();
    const interval = setInterval(() => {
      getAllowance();
    }, 5000);
    return () => {
      interval && clearInterval(interval);
      mount = false;
    };
  }, [getAllowance]);

  return allowance;
};
