import { setReceiveValue, setSendValue } from '@/app/transfer/action';
import { useCBridgeTransferParams } from '@/bridges/cbridge/hooks/useCBridgeTransferParams';
import { useGetEstimatedGas } from '@/contract/hooks/useGetEstimatedGas';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAccount } from '@bridge/wallet';
import { Box, Button, Flex, Link } from '@node-real/uikit';
import { useCallback, useEffect, useState } from 'react';
import { usePublicClient, useSendTransaction, useWalletClient } from 'wagmi';

export function TransferButton() {
  const dispatch = useAppDispatch();
  const { data: walletClient } = useWalletClient();
  const { args } = useCBridgeTransferParams();
  const { getEstimatedGas } = useGetEstimatedGas();
  const { address } = useAccount();
  const { data: hash, sendTransaction } = useSendTransaction();
  const publicClient = usePublicClient();

  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const transferActionInfo = useAppSelector(
    (state) => state.transfer.transferActionInfo
  );
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const [isLoading, setIsLoading] = useState(false);
  const [cBridgeHash, setCBridgeHash] = useState<string | null>(null);
  const [deBridgeHash, setDeBridgeHash] = useState<string | null>(null);

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
      setDeBridgeHash(null);
      setIsLoading(true);
      if (transferActionInfo.bridgeType === 'cbridge') {
        const { gas, gasPrice } = await getEstimatedGas(args as any);
        const hash = await walletClient.writeContract({
          ...args,
          gas,
          gasPrice,
        });
        await publicClient.waitForTransactionReceipt({
          hash: hash,
        });
        setCBridgeHash(hash);
        console.log('cBridge tx', hash);
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
      dispatch(setSendValue(''));
      dispatch(setReceiveValue(''));
    }
  }, [
    address,
    args,
    publicClient,
    dispatch,
    getEstimatedGas,
    selectedToken,
    sendTransaction,
    transferActionInfo,
    walletClient,
  ]);

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
        disabled={isLoading}
      >
        Transfer
      </Button>
      {deBridgeHash && address && (
        <Box padding={'4px'}>
          {`Your transaction hash: `}
          <Flex>{deBridgeHash}</Flex>
          {`View deBridge transaction history at: `}
          <Link
            href={`https://app.debridge.finance/orders?s=${address}`}
            target="_blank"
          >
            deExplorer
          </Link>
        </Box>
      )}
      {cBridgeHash && (
        <Box padding={'4px'}>
          {`Your transaction hash: `}
          <Flex>{cBridgeHash}</Flex>
          {`View cBridge transaction history at `}
          <Link
            href={`https://celerscan.com/tx/${cBridgeHash}`}
            target="_blank"
          >
            {`CelerScan`}
          </Link>
        </Box>
      )}
    </Flex>
  );
}
