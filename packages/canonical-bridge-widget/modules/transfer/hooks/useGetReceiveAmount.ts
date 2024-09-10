import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { parseUnits } from 'viem';
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
        if (bridgeType === 'deBridge') {
          return estimatedAmount[bridgeType]?.estimation.dstChainTokenOut.amount;
        } else if (bridgeType === 'cBridge') {
          return estimatedAmount[bridgeType]?.estimated_receive_amt;
        } else if (bridgeType === 'stargate') {
          return String(estimatedAmount[bridgeType]?.[2].amountReceivedLD);
        } else if (bridgeType === 'layerZero') {
          if (getToDecimals()['layerZero']) {
            return String(parseUnits(sendValue, getToDecimals()['layerZero']));
          } else {
            return null;
          }
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
