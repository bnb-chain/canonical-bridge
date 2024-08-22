import { Box } from '@bnb-chain/space';
import { useAccount, usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import { bridgeSDK } from '@/core/constants/bridgeSDK';

// A test page for bridge sdk methods
export default function Index() {
  const publicClient = usePublicClient();

  const { address } = useAccount();
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!publicClient || !address || !mounted) {
      return;
    }
    (async () => {
      // get token balance
      const tokenBalance = await bridgeSDK.getTokenBalance({
        publicClient: publicClient,
        tokenAddress: '0x55d398326f99059ff775485246999027b3197955', // change this token address to get balance of another token
        owner: address,
      });
      setBalance(tokenBalance);

      // Get deBridge order history
      const history = await bridgeSDK.deBridge.getStatsHistory({
        address: '0x4DcfAF0ae6034e31191390c04006d0169326DEc7',
        pageId: 0,
        pageSize: 20,
        fromChainIds: [1, 56], // from Chain IDs
        toChainIds: [137],
      });
      // eslint-disable-next-line no-console
      console.log(history);

      // Get order info
      const order = await bridgeSDK.deBridge.getOrder({
        id: '0x4cb96c88916d5f08a979750c54f3001ffb4069762326705d431a83f946b3ba64',
      });
      // eslint-disable-next-line no-console
      console.log('deBridge order', order);
    })();
    return () => {
      mounted = false;
    };
  }, [publicClient, address]);

  return (
    <Box p={'20px'}>
      {Number(balance) && balance ? (
        <Box>Your have {formatUnits(balance, 18)} USDT on BSC</Box>
      ) : null}
    </Box>
  );
}
