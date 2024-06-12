// import { useCBridgePoolBasedTransfer, useCBridgeSendMaxMin } from '@/app/hooks';
// import { useFetchCBridgeEstimateAmount } from '@/bridges/cbridge/api/useFetchCBridgeEstimateAmount';
// // import { useGetAllowance } from '@/contract/hooks/useGetAllowance';
// import { useStore } from '@/providers/StoreProvider/hooks/useStore';
// import { useAccount } from '@bridge/wallet';
// import { Button, Flex } from '@node-real/uikit';
// import { formatUnits, parseUnits } from 'viem';

// export function TransferOverview() {
//   const { fromChainId, fromTokenInfo, toChainId, toTokenInfo, transferValue } =
//     useStore();
//   const { address } = useAccount();
//   // const { allowance, isError, error, isLoading } = useGetAllowance({
//   //   tokenAddress: fromTokenInfo.fromTokenAddress as `0x${string}`,
//   //   sender: fromTokenInfo.bridgeAddress as `0x${string}`,
//   // });
//   // console.log('allowance', allowance);

//   const transaction = useCBridgePoolBasedTransfer({
//     tokenAddress: fromTokenInfo.fromTokenAddress as `0x${string}`,
//     bridgeAddress: fromTokenInfo.bridgeAddress as `0x${string}`,
//     fromChainId,
//     toChainId,
//     amount: transferValue,
//     decimal: fromTokenInfo.fromTokenDecimal,
//     enable: fromTokenInfo.fromTokenMethod === 'CB_POOL_BASED',
//     max_slippage: 3000, // TODO: Get from user input
//   });

//   // Min & max input amount
//   const res = useCBridgeSendMaxMin({
//     bridgeAddress: fromTokenInfo.bridgeAddress as `0x${string}`,
//     tokenAddress: fromTokenInfo.fromTokenAddress as `0x${string}`,
//   });
//   console.log('res', transaction);

//   const { data: estimateAmt } = useFetchCBridgeEstimateAmount({
//     srcChainId: Number(fromChainId),
//     dstChainId: Number(toChainId),
//     tokenSymbol: fromTokenInfo.fromTokenSymbol,
//     amount: Number(parseUnits(transferValue, fromTokenInfo.fromTokenDecimal)),
//     userAddress: address as `0x${string}`, // Not required for multi-chain token transfer
//     slippageTolerance: 30000, // 0.03%, slippage_tolerance / 1M
//     isPegged: fromTokenInfo.fromTokenMethod !== 'CB_POOL_BASED',
//   });
//   // console.log('esti amount', estimateAmt);

//   return (
//     <>
//       <Flex flexDir="column" mt={32}>
//         <Button
//           onClick={transaction.data?.send}
//           isDisabled={false}
//           color="light.readable.normal"
//           w="100%"
//         >
//           Transfer
//         </Button>
//       </Flex>
//       <Flex
//         flexDir="column"
//         borderBottomRadius={16}
//         p={24}
//         position="absolute"
//         bottom={0}
//         left={24}
//         transform="translateY(100%)"
//         border="1px solid readable.border"
//         bg="bg.top.normal"
//         w="calc(100% - 48px)"
//         gap={8}
//       >
//         <InfoRow
//           label="Bridge Rate"
//           value={
//             fromTokenInfo.fromTokenMethod?.includes('CB_')
//               ? `${estimateAmt?.bridge_rate}`
//               : '-'
//           }
//         />
//         <InfoRow
//           label="Gas Fee"
//           value={
//             transaction?.data
//               ? `${formatUnits(
//                   transaction.data.gasFee * transaction.data.gasPrice,
//                   fromTokenInfo.fromTokenDecimal
//                 )} BNB` //TODO: Use native token symbol
//               : '-'
//           }
//         />
//         <InfoRow
//           label="Other Fee"
//           value={
//             estimateAmt && fromTokenInfo.fromTokenMethod?.includes('CB_')
//               ? `${formatUnits(
//                   BigInt(estimateAmt.base_fee),
//                   toTokenInfo.toTokenDecimal
//                 )} ${toTokenInfo.toTokenSymbol} + ` +
//                 `${formatUnits(
//                   BigInt(estimateAmt.perc_fee),
//                   toTokenInfo.toTokenDecimal
//                 )} ${toTokenInfo.toTokenSymbol}`
//               : '-'
//           }
//         />
//         <InfoRow
//           label="Estimated Token Received"
//           value={`${
//             estimateAmt?.estimated_receive_amt
//               ? formatUnits(
//                   BigInt(estimateAmt?.estimated_receive_amt),
//                   toTokenInfo.toTokenDecimal
//                 )
//               : '-'
//           } ${toTokenInfo.toTokenSymbol}`}
//         />
//         <InfoRow label="Estimated Time of Arrival" value={'-'} />
//       </Flex>
//     </>
//   );
// }

// interface InfoRowProps {
//   label: React.ReactNode;
//   value: React.ReactNode;
// }

// function InfoRow(props: InfoRowProps) {
//   const { label, value } = props;

//   return (
//     <Flex alignItems="center" justifyContent="space-between">
//       <Flex>{label}</Flex>
//       <Flex>{value}</Flex>
//     </Flex>
//   );
// }
