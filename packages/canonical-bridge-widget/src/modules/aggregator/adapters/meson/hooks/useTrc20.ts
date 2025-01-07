import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useCallback } from 'react';

import { useTronWeb } from '@/core/hooks/useTronWeb';

export const useTrc20 = () => {
  const { address, signTransaction } = useTronWallet();
  const tronWeb = useTronWeb();

  const approveTrc20 = async ({
    tronBridgeAddress,
    trc20Address,
    amount,
  }: {
    tronBridgeAddress: string;
    trc20Address: string;
    amount: string;
  }) => {
    if (!address || !tronWeb) return;

    const parameter = [
      { type: 'address', value: tronBridgeAddress },
      { type: 'uint256', value: tronWeb.toSun(Number(amount)) },
    ];
    // triggerConstantContract readonly function
    // triggerSmartContract return unsigned transaction
    // create unsigned transaction
    const txWrapper = await tronWeb.transactionBuilder.triggerSmartContract(
      trc20Address,
      'approve(address,uint256)',
      {},
      parameter,
      address,
    );
    // sign transaction
    const signedTransaction = await signTransaction(txWrapper.transaction as any);
    // send tx
    const res = await tronWeb.trx.sendRawTransaction(signedTransaction as any);
    // eslint-disable-next-line no-console
    console.log(txWrapper.transaction, signedTransaction, res);
    return res;
  };

  const getTrc20Balance = useCallback(
    async ({ trc20Address }: { trc20Address: string }) => {
      if (!address || !tronWeb) return;
      tronWeb.setAddress(address);
      const contract = await tronWeb.contract().at(trc20Address);
      const balance = await contract.methods.balanceOf(address).call();

      return balance;
    },
    [address, tronWeb],
  );

  const getTrc20Allowance = useCallback(
    async ({
      trc20Address,
      tronBridgeAddress,
    }: {
      trc20Address: string;
      tronBridgeAddress: string;
    }) => {
      if (!address || !tronWeb) return;
      tronWeb.setAddress(address);
      const contract = await tronWeb.contract().at(trc20Address);
      const allowance = await contract.methods.allowance(address, tronBridgeAddress).call();
      return allowance;
    },
    [address, tronWeb],
  );

  return { approveTrc20, getTrc20Balance, getTrc20Allowance };
};
