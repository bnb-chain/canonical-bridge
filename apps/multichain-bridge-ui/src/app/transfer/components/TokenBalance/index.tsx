import { useGetTokenBalance } from '@/contract/hooks/useGetTokenBalance';
import { useAppSelector } from '@/store/hooks';
import { useAccount } from '@bridge/wallet';
import { Box, BoxProps, Flex } from '@node-real/uikit';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useNetwork } from 'wagmi';

export const TokenBalance = () => {
  const error = useAppSelector((state) => state.transfer.error);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { balance: initBalance, refetch } = useGetTokenBalance({
    tokenAddress: selectedToken?.address as `0x${string}`,
  });
  const [balance, setBalance] = useState<bigint | null>(null);
  useEffect(() => {
    if (typeof initBalance === 'bigint') {
      setBalance(initBalance);
    } else if (!selectedToken) {
      setBalance(0n);
    }
  }, [initBalance, selectedToken]);

  useEffect(() => {
    let mount = true;
    if (!mount) return;
    try {
      const inter = setInterval(async () => {
        const { data: balance } = await refetch({
          cancelRefetch:
            !address ||
            !selectedToken ||
            chain?.id !== fromChain?.id ||
            !initBalance,
        });
        if (typeof balance === 'bigint') {
          setBalance(balance);
        }
      }, 10000);
      return () => {
        mount = false;
        inter && clearInterval(inter);
      };
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }, [refetch, address, selectedToken, fromChain, chain, initBalance]);

  return (
    <Flex flex={1} flexDir={'column'} gap={4}>
      {error ? (
        <ErrorMsg>{error}</ErrorMsg>
      ) : !balance ? (
        <ErrorMsg>Insufficient balance</ErrorMsg>
      ) : (
        <Box>
          Balance: {formatUnits(balance, selectedToken?.decimal ?? 0) || ''}
        </Box>
      )}
    </Flex>
  );
};

function ErrorMsg(props: BoxProps) {
  return <Box color="scene.danger.normal" {...props} />;
}
