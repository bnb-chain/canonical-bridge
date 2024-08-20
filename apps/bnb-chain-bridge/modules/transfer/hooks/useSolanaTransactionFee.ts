import { useConnection } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/core/store/hooks';

export function useSolanaTransactionFee() {
  const [fee, setFee] = useState<number | null>();
  const { connection } = useConnection();
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);

  useEffect(() => {
    if (!transferActionInfo?.data) return;
    const calcFee = async () => {
      const data = (transferActionInfo.data as string)?.slice(2);

      const tx = VersionedTransaction.deserialize(Buffer.from(data, 'hex'));
      const { blockhash } = await connection.getLatestBlockhash();
      tx.message.recentBlockhash = blockhash;

      const result = await connection.getFeeForMessage(tx.message);
      setFee(result.value);
    };
    calcFee();
  }, [connection, transferActionInfo?.data]);

  return { transactionFee: fee };
}
