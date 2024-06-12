// 'use client';

// import { useFetchCBridgeEstimateAmount } from '@/bridges/cbridge/api/useFetchCBridgeEstimateAmount';
// import { useApprove } from '@/contract/hooks';
// import { useBridgeConfig } from '@/providers/BridgeConfigProvider/hooks/useBridgeConfig';
// import { Box, Button, Flex } from '@node-real/uikit';
// import { useCallback, useEffect, useMemo } from 'react';
// import { useAccount } from '@bridge/wallet';
// import { usePublicClient, useContractReads, useWalletClient } from 'wagmi';
// import { getTransferId } from '@/bridges/cbridge/utils';
// import { formatUnits, parseUnits } from 'viem';
// import { useGetAllowance } from '@/contract/hooks/useGetAllowance';
// import { CBRIDGE } from '@/bridges/cbridge/abi/bridge';
// import { useGetEstimatedGas } from '@/contract/hooks/useGetEstimatedGas';
// import { useCBridgeSendMaxMin } from '@/bridges/cbridge/hooks';
// import { CBridgeTokenInfo } from '@/bridges/cbridge/types';

// // interface CBridgeEstimateAmount {
// //   data: {
// //     err: { code: number; msg: string };
// //     base_fee: string;
// //     bridge_rate: 1; // Rate between srcChain and dstChain https://cbridge-docs.celer.network/reference/faq#bridge-rate
// //     eq_value_token_amt: string; // Token amount in destination chain
// //     estimated_receive_amt: '3684870'; // Receiving amount estimation on destination chain
// //     max_slippage: 568026; // Only used for xLiquidity transfer. Slippage will be used to submit on-chain transaction.
// //     perc_fee: '15000'; // Protocol fee
// //     slippage_tolerance: 300000;
// //   };
// // }

// export default function Index() {
//   const { address } = useAccount();
//   const { chainsMap, chainTokensMap, peggedPairConfigs } = useBridgeConfig();
//   const { approveErc20Token } = useApprove();
//   const { getEstimatedGas } = useGetEstimatedGas();

//   const { data: walletClient } = useWalletClient();
//   const publicClient = usePublicClient();

//   const amount = 19.88;

//   const availableTokens = new Map<number, CBridgeTokenInfo[]>();
//   chainTokensMap.forEach((value, key) => {
//     const tempTokenList = [] as CBridgeTokenInfo[];
//     value.forEach((token) => {
//       if (
//         token.transfer_disabled === false &&
//         token.token.xfer_disabled === false
//       ) {
//         tempTokenList.push(token);
//       }
//     });
//     if (tempTokenList.length > 0) {
//       availableTokens.set(key, tempTokenList);
//     }
//   });

//   console.log(availableTokens);

//   const tokenInfo = useMemo(() => {
//     const decimal = 18;
//     return {
//       fromChainId: 137,
//       fromTokenInfo: {
//         tokenSymbol: 'ATL',
//         tokenAddress:
//           '0xb98e169C37ce30Dd47Fdad1f9726Fb832191e60b' as `0x${string}`,
//         decimal: decimal,
//       },
//       toChainId: 56,
//       amt: amount * Math.pow(10, decimal), // with decimal
//     };
//   }, []);

//   const { allowance } = useGetAllowance({
//     tokenAddress: tokenInfo.fromTokenInfo.tokenAddress,
//     sender: '0x4d58FDC7d0Ee9b674F49a0ADE11F26C3c9426F7A' as `0x${string}`,
//   });

//   const { data: estimateAmt } = useFetchCBridgeEstimateAmount({
//     srcChainId: Number(tokenInfo.fromChainId),
//     dstChainId: Number(tokenInfo.toChainId),
//     tokenSymbol: tokenInfo.fromTokenInfo.tokenSymbol,
//     amount: tokenInfo.amt,
//     userAddress: address as `0x${string}`, // Not required for multi-chain token transfer
//     slippageTolerance: 30000, // 0.03%, slippage_tolerance / 1M
//     isPegged: true,
//   });
//   console.log(estimateAmt, estimateAmt?.err);

//   const { minMaxSendAmt } = useCBridgeSendMaxMin({
//     bridgeAddress: chainsMap.get(Number(tokenInfo.fromChainId))
//       ?.contract_addr as `0x${string}`,
//     tokenAddress: tokenInfo.fromTokenInfo.tokenAddress,
//   });

//   const poolBasedCBridgeTransfer = useCallback(async () => {
//     /// Send
//     try {
//       if (walletClient && publicClient && address && estimateAmt) {
//         const nonce = new Date().getTime();
//         const params = [
//           address as `0x${string}`,
//           tokenInfo.fromTokenInfo.tokenAddress,
//           tokenInfo.amt,
//           tokenInfo.toChainId,
//           nonce,
//           estimateAmt.max_slippage,
//         ];
//         const args = {
//           address: chainsMap.get(Number(tokenInfo.fromChainId))
//             ?.contract_addr as `0x${string}`, // Bridge.sol
//           abi: CBRIDGE as any,
//           functionName: 'send',
//           account: address as `0x${string}`,
//           args: params,
//         };
//         console.log(args);

//         // Get estimated gas
//         const { gas, gasPrice } = await getEstimatedGas(args);

//         const transfer_id = getTransferId('pool', [
//           address,
//           address,
//           tokenInfo.fromTokenInfo.tokenAddress,
//           String(tokenInfo.amt),
//           String(tokenInfo.toChainId),
//           String(nonce),
//           String(tokenInfo.fromChainId),
//         ]);
//         console.log('transfer id', transfer_id);

//         const hash = await walletClient.writeContract({
//           ...args,
//           gas,
//           gasPrice,
//         });
//         console.log('transfer hash', hash);
//       }
//     } catch (e: any) {
//       console.log(e, e.message);
//     }
//   }, [
//     address,
//     chainsMap,
//     tokenInfo,
//     walletClient,
//     publicClient,
//     estimateAmt,
//     getEstimatedGas,
//   ]);

//   return (
//     <Box>
//       <Box as="h1" mb={'8px'}>
//         Cbridge Transfer API Test
//       </Box>
//       {minMaxSendAmt && (
//         <Flex flexDir={'column'} gap={'8px'}>
//           <Box>
//             Min amount:{' '}
//             {formatUnits(
//               (minMaxSendAmt[0]?.result || 0) as bigint,
//               tokenInfo.fromTokenInfo.decimal
//             )}
//           </Box>
//           <Box>
//             Min amount:{' '}
//             {formatUnits(
//               (minMaxSendAmt[1]?.result || 0) as bigint,
//               tokenInfo.fromTokenInfo.decimal
//             )}
//           </Box>
//         </Flex>
//       )}
//       <Flex flexDir={'column'} gap="8px">
//         <Button
//           disabled={!estimateAmt || estimateAmt.err !== null}
//           onClick={async () => {
//             if (availableTokens) {
//               console.log('cbridge allowance', allowance);
//             }
//           }}
//         >
//           Get Allowance
//         </Button>
//         <Button
//           onClick={async () => {
//             const approveHash = await approveErc20Token(
//               tokenInfo.fromTokenInfo.tokenAddress,
//               '0x4d58FDC7d0Ee9b674F49a0ADE11F26C3c9426F7A' as `0x${string}`,
//               parseUnits(String(amount), tokenInfo.fromTokenInfo.decimal)
//             );
//             console.log(approveHash);
//           }}
//         >
//           Approve
//         </Button>
//         {/* <Button
//           disabled={!estimateAmt || estimateAmt.err !== null}
//           onClick={poolBasedErc20Transfer}
//         >
//           Pool-based Transfer
//         </Button> */}
//         {/* <Button
//           disabled={!estimateAmt || estimateAmt.err !== null}
//           onClick={peggedErc20Deposit}
//         >
//           Pegged Deposit
//         </Button> */}
//         {/* <Button
//           disabled={!estimateAmt || estimateAmt.err !== null}
//           onClick={peggedErc20Withdraw}
//         >
//           Pegged Withdraw
//         </Button> */}
//       </Flex>
//     </Box>
//   );
// }

// // let filteredToken = null;
// // if (peggedPairConfigs.length > 0) {
// //   filteredToken = peggedPairConfigs.filter((item) => {
// //     return (
// //       item.org_chain_id === Number(tokenInfo.fromChainId) &&
// //       item.pegged_chain_id === Number(tokenInfo.toChainId)
// //     );
// //   });
// // }

// // const transfer_id = ethers.utils.solidityKeccak256(
// //   [
// //     'address',
// //     'address',
// //     'address',
// //     'uint256',
// //     'uint64',
// //     'uint64',
// //     'uint64',
// //   ],
// //   [
// //     '0xdad9d86885d217b92a47370e1e785897dd09a4f3', /// User's wallet address,
// //     '0xdad9d86885d217b92a47370e1e785897dd09a4f3', /// User's wallet address,
// //     '0x855fc87f7f14db747ef27603b02bae579ba947b6', /// Wrap token address/ ERC20 token address
// //     '25000000', /// Send amount in String
// //     '5', /// Destination chain id
// //     '1717400924592', /// Nonce
// //     '359994', /// Source chain id
// //   ]
// // );
// // console.log(transfer_id);

// // vault_version = 2  ===> OriginalTokenVaultV2
