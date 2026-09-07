import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { formatUnits } from 'viem';
import { useCallback } from 'react';

import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useGetCBridgeFees } from '@/modules/aggregator/adapters/cBridge/hooks/useGetCBridgeFees';

export const useGetReceiveAmount = () => {
  const { isAllowSendError } = useGetCBridgeFees();

  const estimatedAmount = useAppSelector((state) => state.transfer.estimatedAmount);
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  const routeError = useAppSelector((state) => state.transfer.routeError);
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
        } else if (bridgeType === 'layerZero' && sendValue && estimatedAmount?.['layerZero']) {
          return sendValue;
        } else if (bridgeType === 'meson' && estimatedAmount?.['meson']) {
          return estimatedAmount?.['meson'];
        } else if (bridgeType === 'mayan' && estimatedAmount?.['mayan']) {
          return estimatedAmount?.['mayan'].value;
        }
      }
      return null;
    },
    [estimatedAmount, sendValue, getToDecimals],
  );

  const getSortedReceiveAmount = useCallback(() => {
    const receiveAmountObj = {
      deBridge: {
        value: Number(getReceiveAmount('deBridge')) ?? 0,
        isSorting: !routeError?.['deBridge'],
      },
      cBridge: {
        value: Number(getReceiveAmount('cBridge')) ?? 0,
        isSorting: !routeError?.['cBridge'] && !isAllowSendError,
      },
      stargate: {
        value: Number(getReceiveAmount('stargate')) ?? 0,
        isSorting: !routeError?.['stargate'],
      },
      layerZero: {
        value: Number(getReceiveAmount('layerZero')) ?? 0,
        isSorting: !routeError?.['layerZero'],
      },
      meson: {
        value: Number(getReceiveAmount('meson')) ?? 0,
        isSorting: !routeError?.['meson'],
      },
      mayan: {
        value: Number(getReceiveAmount('mayan')) ?? 0,
        isSorting: !routeError?.['mayan'],
      },
    };

    const sortedReceivedAmt = Object.fromEntries(
      Object.entries(receiveAmountObj).sort(([, a], [, b]) => {
        if (a.isSorting !== b.isSorting) {
          return a.isSorting === true ? -1 : 1;
        }
        return b.value - a.value;
      }),
    );
    return sortedReceivedAmt;
  }, [getReceiveAmount, routeError, isAllowSendError]);

  return { getReceiveAmount, getSortedReceiveAmount };
};
