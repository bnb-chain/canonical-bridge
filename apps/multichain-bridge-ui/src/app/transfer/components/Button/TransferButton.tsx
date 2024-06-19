import { setSendValue } from '@/app/transfer/action';
import { useCBridgeTransferParams } from '@/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useGetEstimatedGas } from '@/contract/hooks/useGetEstimatedGas';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAccount } from '@bridge/wallet';
import { Box, Button, Flex } from '@node-real/uikit';
import { useCallback, useEffect, useState } from 'react';
import { useSendTransaction, useWalletClient } from 'wagmi';

export function TransferButton() {
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const dispatch = useAppDispatch();
  const { data: walletClient } = useWalletClient();
  const { args } = useCBridgeTransferParams();
  const { getEstimatedGas } = useGetEstimatedGas();
  const { address } = useAccount();
  const transferActionInfo = useAppSelector(
    (state) => state.transfer.transferActionInfo
  );
  const { data: hash, sendTransaction } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [cBridgeHash, setCBridgeHash] = useState<string | null>(null);
  const [deBridgeHash, setDeBridgeHash] = useState<string | null>(null);

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const sendTx = useCallback(async () => {
    if (
      !walletClient ||
      !args ||
      !selectedToken ||
      !address ||
      !transferActionInfo ||
      !transferActionInfo.bridgeType ||
      !transferActionInfo.bridgeAddress
    ) {
      return;
    }
    try {
      setCBridgeHash(null);
      setIsLoading(true);
      // CBridge transfer
      if (transferActionInfo.bridgeType === 'cbridge') {
        const { gas, gasPrice } = await getEstimatedGas(args as any);
        const hash = await walletClient.writeContract({
          ...args,
          gas,
          gasPrice,
        });
        setCBridgeHash(hash);
        console.log(hash);
      } else if (
        transferActionInfo.bridgeType === 'debridge' &&
        transferActionInfo.value
      ) {
        sendTransaction({
          to: transferActionInfo.bridgeAddress as string,
          data: transferActionInfo.data,
          value: BigInt(transferActionInfo.value),
        });
      } else {
        console.log('Unsupported bridge type', transferActionInfo?.bridgeType);
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e, e.message);
    } finally {
      setIsLoading(false);
      dispatch(setSendValue('0'));
    }
  }, [
    address,
    args,
    dispatch,
    getEstimatedGas,
    selectedToken,
    sendTransaction,
    transferActionInfo,
    walletClient,
  ]);

  useEffect(() => {
    if (sendValue === '0') {
      setCBridgeHash(null);
      setDeBridgeHash(null);
    }
  }, [sendValue]);

  useEffect(() => {
    if (hash) {
      setDeBridgeHash(hash.hash);
    }
  }, [hash]);

  return (
    <Flex flexDir="column" w={'100%'}>
      <Button
        onClick={sendTx}
        isDisabled={!sendValue || sendValue === '0'}
        color="light.readable.normal"
        w="100%"
        mb={'8px'}
      >
        Transfer
      </Button>
      {deBridgeHash && (
        <Box padding={'4px'}>{`deBridge Tx Hash` + deBridgeHash}</Box>
      )}
      {cBridgeHash && (
        <Box padding={'4px'}>{`cBridge Tx Hash` + cBridgeHash}</Box>
      )}
    </Flex>
  );
}
