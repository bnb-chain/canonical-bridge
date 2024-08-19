import { STARGATE_POOL } from '@/src/stargate/abi/stargatePool';
import { type PublicClient, pad } from 'viem';

interface IStargateQuoteOFT {
  publicClient: PublicClient;
  bridgeAddress: `0x${string}`;
  endPointId: number;
  receiver: `0x${string}`;
  amount: bigint;
}

// https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/integrate-with-stargate/estimating-fees#quoteoft
export const getStargateQuoteOFT = async ({
  publicClient,
  bridgeAddress,
  endPointId,
  receiver,
  amount,
}: IStargateQuoteOFT) => {
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
    const quoteOFTResponse = await publicClient?.readContract({
      address: bridgeAddress,
      abi: STARGATE_POOL,
      functionName: 'quoteOFT',
      args: [sendParams] as any,
    });
    return quoteOFTResponse;
  } catch (error: any) {
    throw new Error('Failed to get quote OFT', error);
  }
};
