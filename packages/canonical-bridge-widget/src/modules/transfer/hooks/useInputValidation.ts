import { formatUnits } from 'viem';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { useCallback } from 'react';

import { formatNumber } from '@/core/utils/number';
import { ICBridgeMaxMinSendAmt } from '@/modules/aggregator/adapters/cBridge/types';

export const useInputValidation = () => {
  const validateInput = useCallback(
    ({
      balance,
      decimal,
      minMaxSendAmt,
      value,
      isConnected,
      bridgeType,
      isPegged = false,
      estimatedAmount,
      nativeBalance,
    }: {
      balance: null | bigint;
      decimal: number;
      minMaxSendAmt: ICBridgeMaxMinSendAmt;
      value: number;
      isConnected: boolean;
      bridgeType?: BridgeType;
      isPegged?: boolean;
      estimatedAmount?: any;
      nativeBalance: any;
    }) => {
      try {
        if (!decimal || !value) {
          return null;
        }
        if (balance && value > Number(formatUnits(balance, decimal))) {
          return { text: `You have insufficient balance`, isError: true };
        }
        if (estimatedAmount?.stargate && bridgeType === 'stargate' && value) {
          const stargateMax = formatUnits(estimatedAmount.stargate[0].maxAmountLD, decimal);
          if (value > Number(stargateMax)) {
            return {
              text: `The amount should be less than ${formatNumber(Number(stargateMax))}.`,
              isError: true,
            };
          }
        }
        if (estimatedAmount?.deBridge && bridgeType === 'deBridge' && nativeBalance && value) {
          const deBridgeProtocolFee = estimatedAmount.deBridge?.fixFee;
          if (BigInt(deBridgeProtocolFee) > nativeBalance.value) {
            return { text: `Your balance can not cover protocol fee.`, isError: true };
          }
        }
        const maxAmt = Number(formatUnits(BigInt(minMaxSendAmt.max), decimal));
        const minAmt = Number(formatUnits(BigInt(minMaxSendAmt.min), decimal));

        if (!isConnected && maxAmt > 0 && minAmt > 0) {
          if (bridgeType === 'cBridge' && !isPegged) {
            if (value <= minAmt) {
              return { text: `The amount should be greater than ${minAmt}.`, isError: true };
            } else if (value >= maxAmt) {
              return { text: `The amount should be less than ${maxAmt}.`, isError: true };
            }
          }
          return { text: '', isError: false };
        } else if (balance) {
          if (value <= minAmt && bridgeType === 'cBridge' && !isPegged) {
            return { text: `The amount should be greater than ${minAmt}.`, isError: true };
          } else if (value >= maxAmt && bridgeType === 'cBridge' && !isPegged) {
            return { text: `The amount should be less than ${maxAmt}.`, isError: true };
          }
          return { text: `${formatNumber(Number(formatUnits(balance, decimal)))}`, isError: false };
        } else {
          return { isError: true, text: 'You have insufficient balance' };
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    [],
  );

  return {
    validateInput,
  };
};
