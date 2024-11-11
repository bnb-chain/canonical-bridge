import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useTronWeb } from '@/core/hooks/useTronWeb';
import { useTronTransferInfo } from '@/modules/transfer/hooks/tron/useTronTransferInfo';

export const useTronContract = () => {
  const tronWeb = useTronWeb();
  const [isTronContract, setIsTronContract] = useState<null | boolean>(null);
  const toAccount = useAppSelector((state) => state.transfer.toAccount);

  const { isTronTransfer } = useTronTransferInfo();

  const isTronContractInfo = useCallback(async () => {
    if (!tronWeb || !toAccount?.address || !isTronTransfer) return;
    try {
      const contractInfo = await tronWeb.trx.getContract(toAccount?.address);
      setIsTronContract(!!contractInfo?.bytecode);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setIsTronContract(false);
      return false;
    }
  }, [toAccount, tronWeb, isTronTransfer]);

  useEffect(() => {
    let mount = true;
    if (mount) {
      isTronContractInfo();
    }
    return () => {
      mount = false;
    };
  }, [toAccount, isTronContractInfo]);

  return {
    isTronContract,
  };
};
