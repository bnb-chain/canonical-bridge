import { STARGATE_POOL } from '@/src/stargate/abi/stargatePool';
import { type PublicClient, pad } from 'viem';

interface IStargateOFTQuote {
  publicClient: PublicClient;
  bridgeAddress: `0x${string}`;
  endPointId: number;
  receiver: `0x${string}`;
  amount: bigint;
  minAmount: bigint;
}

// https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/integrate-with-stargate/estimating-fees#quotesend
export const getStargateQuoteSend = async ({
  publicClient,
  bridgeAddress,
  endPointId,
  receiver,
  amount,
  minAmount,
}: IStargateOFTQuote) => {
  const sendParams = {
    dstEid: endPointId,
    to: pad(receiver, { size: 32 }) as `0x${string}`,
    amountLD: amount,
    minAmountLD: minAmount,
    extraOptions: '0x' as `0x${string}`,
    composeMsg: '0x' as `0x${string}`,
    oftCmd: '0x01' as `0x${string}`, // '0x01' for bus, '' for taxi
  };
  try {
    const quoteSendResponse = await publicClient?.readContract({
      address: bridgeAddress,
      abi: STARGATE_POOL,
      functionName: 'quoteSend',
      args: [sendParams, false] as any, // false for not paying lzToken
    });
    return quoteSendResponse;
  } catch (error: any) {
    throw new Error('Failed to get quote send', error);
  }
};
