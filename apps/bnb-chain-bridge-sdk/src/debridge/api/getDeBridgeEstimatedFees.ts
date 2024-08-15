// import { createDeBridgeTxQuote } from '@/src/debridge/api/createDeBridgeTxQuote';
// import { ethers } from 'ethers';

/**
 * Get estimated fees from transaction quote API
 */
export const getDeBridgeEstimatedFees = async () => {
  // if (
  //   !fromChain ||
  //   !toChain ||
  //   !selectedToken ||
  //   !sendValue ||
  //   !Number(sendValue) ||
  //   !toTokenInfo
  // ) {
  //   return null;
  // }
  // try {
  //   const deBridgeParams = {
  //     srcChainId: fromChain.id,
  //     srcChainTokenIn: selectedToken?.address as `0x${string}`,
  //     srcChainTokenInAmount: ethers.utils.parseUnits(sendValue, selectedToken.decimal),
  //     dstChainId: toChain.id,
  //     dstChainTokenOut: toTokenInfo?.rawData.deBridge?.address,
  //     prependOperatingExpenses: false,
  //     affiliateFeePercent: 0,
  //   } as any;
  //   if (address) {
  //     deBridgeParams.dstChainTokenOutRecipient = address;
  //     deBridgeParams.dstChainOrderAuthorityAddress = address;
  //     deBridgeParams.srcChainOrderAuthorityAddress = address;
  //   }
  //   const urlParams = new URLSearchParams(deBridgeParams as any);
  //   const deBridgeQuote = await createDeBridgeTxQuote(urlParams);
  //   return deBridgeQuote;
  // } catch (error: any) {
  //   // eslint-disable-next-line no-console
  //   console.log(error, error.message);
  //   return null;
  // }
};
