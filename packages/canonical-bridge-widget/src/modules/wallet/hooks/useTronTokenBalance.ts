import { useQuery } from '@tanstack/react-query';

import { useTronWeb } from '@/core/hooks/useTronWeb';

const abi = [
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const useTronTokenBalance = ({
  accountAddress,
  tokenAddress,
}: {
  accountAddress: string | null;
  tokenAddress: string | undefined | null;
}) => {
  const tronWeb = useTronWeb();

  return useQuery({
    queryKey: ['useTronTokenBalance', { accountAddress, tokenAddress }],
    enabled: !!accountAddress && !!tokenAddress && !!tronWeb,
    queryFn: async () => {
      if (!accountAddress || !tokenAddress || !tronWeb) return '0';
      if (tokenAddress === 'TRON') {
        const balance = await tronWeb.trx.getUnconfirmedBalance(accountAddress);
        return balance?.toString() as string;
      }
      tronWeb.setAddress(tokenAddress);
      const contractInstance = await tronWeb.contract(abi, tokenAddress);
      const balanceOf = await contractInstance.balanceOf(accountAddress).call();
      return balanceOf?.toString() as string;
    },
  });
};
