import { STARGATE_POOL } from '@/src/stargate/abi/stargatePool';
import { getStargateQuoteOFT } from '@/src/stargate/api/getStargateQuoteOFT';
import { getStargateQuoteSend } from '@/src/stargate/api/getStargateQuoteSend';
import { type WalletClient, type PublicClient, pad } from 'viem';

interface ISendTokenInput {
  walletClient: WalletClient;
  publicClient: PublicClient;
  bridgeAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  endPointId: number;
  receiver: `0x${string}`;
  amount: bigint;
}

export const sendStargateToken = async ({
  walletClient,
  publicClient,
  bridgeAddress,
  tokenAddress,
  endPointId,
  receiver,
  amount,
}: ISendTokenInput) => {
  const sendParams = {
    dstEid: endPointId,
    to: pad(receiver, { size: 32 }) as `0x${string}`,
    amountLD: amount,
    minAmountLD: amount,
    extraOptions: '0x' as `0x${string}`,
    composeMsg: '0x' as `0x${string}`,
    oftCmd: '0x01' as `0x${string}`, // '0x01' for bus, '' for taxi
  };
  try {
    const quoteOFTResponse = await getStargateQuoteOFT({
      publicClient,
      bridgeAddress,
      endPointId,
      receiver,
      amount,
    });
    if (quoteOFTResponse?.[2].amountReceivedLD) {
      sendParams.minAmountLD = BigInt(quoteOFTResponse[2].amountReceivedLD);
    }
    const quoteSendResponse = await getStargateQuoteSend({
      publicClient,
      bridgeAddress,
      endPointId,
      receiver,
      amount,
      minAmount: sendParams.minAmountLD,
    });
    let nativeFee = quoteSendResponse.nativeFee;
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      nativeFee += sendParams.amountLD;
    }
    const sendTokenArgs = {
      address: bridgeAddress,
      abi: STARGATE_POOL,
      functionName: 'sendToken',
      args: [sendParams, quoteSendResponse, receiver],
      value: nativeFee,
      account: receiver,
    };
    const hash = await walletClient?.writeContract({
      ...(sendTokenArgs as any),
    });
    await publicClient.waitForTransactionReceipt({
      hash: hash as `0x${string}`,
    });
    return hash;
  } catch (e: any) {
    throw new Error('Failed to send token', e);
  }
};
