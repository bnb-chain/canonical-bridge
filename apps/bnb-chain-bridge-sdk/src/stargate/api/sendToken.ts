export const sendToken = async () => {
  // if (!address || !estimatedAmount?.stargate || !args || !selectedToken) return;
  // try {
  //   const bridgeAddress = selectedToken.rawData.stargate?.bridgeAddress as `0x${string}`;
  //   const amountReceivedLD = estimatedAmount?.stargate[2].amountReceivedLD;
  //   const sendParams = { ...args };
  //   if (amountReceivedLD) {
  //     sendParams.minAmountLD = BigInt(amountReceivedLD);
  //   }

  //   const quoteSendResponse = await publicClient?.readContract({
  //     address: bridgeAddress,
  //     abi: STARGATE_POOL,
  //     functionName: 'quoteSend',
  //     args: [sendParams, false] as any, // false for not paying lzToken
  //   });

  //   let nativeFee = quoteSendResponse.nativeFee;
  //   if (
  //     selectedToken.rawData.stargate?.address === '0x0000000000000000000000000000000000000000'
  //   ) {
  //     nativeFee += sendParams.amountLD;
  //   }
  //   const sendTokenArgs = {
  //     address: bridgeAddress,
  //     abi: STARGATE_POOL,
  //     functionName: 'sendToken',
  //     args: [sendParams, quoteSendResponse, address],
  //     value: nativeFee,
  //     account: address,
  //   };
  //   const hash = await walletClient?.writeContract({
  //     ...(sendTokenArgs as any),
  //   });

  //   const tx = await publicClient.waitForTransactionReceipt({
  //     hash: hash as `0x${string}`,
  //   });
  //   // eslint-disable-next-line no-console
  //   console.log('send token response', tx);
  //   return hash;
  // } catch (e: any) {
  //   // eslint-disable-next-line no-console
  //   console.log(e, e.message);
  // }
}