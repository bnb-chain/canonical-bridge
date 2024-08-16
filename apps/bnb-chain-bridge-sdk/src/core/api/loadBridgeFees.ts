
export const loadBridgeFees = async () => {
  // const promiseArr = [];
  // const valueArr = [];
  // try {
  //   if (toToken?.rawData.deBridge) {
  //     // promiseArr.push(getDeBridgeEstimate());
  //   } else {
  //     promiseArr.push(new Promise((reject) => reject(null)));
  //   }
  //   if (toToken?.rawData.cBridge) {
  //     // promiseArr.push(getCBridgeEstimated());
  //   } else {
  //     promiseArr.push(new Promise((reject) => reject(null)));
  //   }
  //   if (toToken?.rawData.stargate) {
  //     // promiseArr.push(getQuoteOFT());
  //   } else {
  //     promiseArr.push(new Promise((reject) => reject(null)));
  //   }
  //   const response = await Promise.allSettled(promiseArr);
  //   // eslint-disable-next-line no-console
  //   console.log('API response deBridge[0], cBridge[1], stargate[2]', response);
  //   const debridgeEst = response?.[0];
  //   const cbridgeEst = response?.[1];
  //   const stargateEst = response?.[2];
  //   if (
  //     debridgeEst?.status === 'fulfilled' &&
  //     cbridgeEst?.status === 'fulfilled' &&
  //     stargateEst?.status === 'fulfilled'
  //   ) {
  //     if (debridgeEst.value) {
  //       // dispatch(setEstimatedAmount({ deBridge: debridgeEst.value }));
  //       valueArr.push({
  //         type: 'deBridge',
  //         value: formatUnits(
  //           BigInt(debridgeEst.value?.estimation.dstChainTokenOut.amount),
  //           getToDecimals()['deBridge'],
  //         ),
  //       });
  //     } else {
  //       // dispatch(setEstimatedAmount({ deBridge: undefined }));
  //     }
  //     if (cbridgeEst.value) {
  //       // dispatch(setEstimatedAmount({ cBridge: cbridgeEst.value }));
  //       valueArr.push({
  //         type: 'cBridge',
  //         value: formatUnits(
  //           BigInt(cbridgeEst.value?.estimated_receive_amt),
  //           getToDecimals()['cBridge'],
  //         ),
  //       });
  //     } else {
  //       // dispatch(setEstimatedAmount({ cBridge: undefined }));
  //     }
  //     if (stargateEst.value) {
  //       valueArr.push({
  //         type: 'stargate',
  //         value: formatUnits(
  //           stargateEst.value?.quoteOFT?.[2].amountReceivedLD,
  //           selectedToken?.rawData.stargate?.decimals || 18,
  //         ),
  //       });
  //     }
  //   }
  // } catch (error: any) {
  //   // eslint-disable-next-line no-console
  //   console.log(error, error.message);
  // }
};
