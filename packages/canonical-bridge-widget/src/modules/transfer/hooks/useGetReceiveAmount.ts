import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { formatUnits } from 'viem';
import { useCallback } from 'react';

import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const useGetReceiveAmount = () => {
  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const { getToDecimals } = useToTokenInfo();

  const getReceiveAmount = useCallback(
    (bridgeType: BridgeType) => {
      if (estimatedAmount) {
        if (
          bridgeType === 'deBridge' &&
          estimatedAmount[bridgeType]?.estimation &&
          getToDecimals()['deBridge']
        ) {
          return formatUnits(
            BigInt(estimatedAmount?.['deBridge']?.estimation?.dstChainTokenOut?.amount),
            getToDecimals().deBridge,
          );
        } else if (
          bridgeType === 'cBridge' &&
          estimatedAmount?.['cBridge']?.estimated_receive_amt &&
          getToDecimals()['cBridge']
        ) {
          return formatUnits(
            estimatedAmount?.['cBridge']?.estimated_receive_amt,
            getToDecimals()['cBridge'],
          );
        } else if (
          bridgeType === 'stargate' &&
          estimatedAmount?.['stargate']?.[2].amountReceivedLD &&
          getToDecimals()['stargate']
        ) {
          return formatUnits(
            BigInt(estimatedAmount?.['stargate']?.[2].amountReceivedLD),
            getToDecimals()['stargate'] || 18,
          );
        } else if (bridgeType === 'layerZero' && sendValue) {
          return sendValue;
        }
      }
      return null;
    },
    [estimatedAmount, sendValue, getToDecimals],
  );

  const getSortedReceiveAmount = useCallback(() => {
    const receiveAmountObj = {
      deBridge: Number(getReceiveAmount('deBridge')) || 0,
      cBridge: Number(getReceiveAmount('cBridge')) || 0,
      stargate: Number(getReceiveAmount('stargate')) || 0,
      layerZero: Number(getReceiveAmount('layerZero')) || 0,
    };
    const sortedReceivedAmt = Object.fromEntries(
      Object.entries(receiveAmountObj).sort(([, a], [, b]) => b - a),
    );
    return sortedReceivedAmt;
  }, [getReceiveAmount]);

  return { getReceiveAmount, getSortedReceiveAmount };
};
