import { formatUnits } from 'viem';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { useCallback } from 'react';

import { formatNumber } from '@/core/utils/number';
import { useIsWalletCompatible } from '@/modules/wallet/hooks/useIsWalletCompatible';

export const useInputValidation = () => {
  const isWalletCompatible = useIsWalletCompatible();
  const validateInput = useCallback(
    ({
      balance,
      decimal,
      value,
      bridgeType,
      estimatedAmount,
    }: {
      balance?: number;
      decimal: number;
      value: number;
      bridgeType?: BridgeType;
      isPegged?: boolean;
      estimatedAmount?: any;
    }) => {
      try {
        if (!decimal || !value) {
          return null;
        }
        // check if send amount is smaller than lowest possible token amount
        if (Number(value) < Math.pow(10, -decimal)) {
          return {
            text: `The amount is too small. Please enter a valid amount to transfer.`,
            isError: true,
          };
        }
        // check if send amount is greater than token balance
        if (!!balance && value > balance) {
          return { text: `You have insufficient balance`, isError: true };
        }
        // check Stargate max amount
        if (estimatedAmount?.stargate && bridgeType === 'stargate' && value) {
          const stargateMax = formatUnits(estimatedAmount.stargate[0].maxAmountLD, decimal);
          if (value > Number(stargateMax)) {
            return {
              text: `The amount should be less than ${formatNumber(Number(stargateMax))}.`,
              isError: true,
            };
          }
        }

        if (!!balance) {
          return { text: `${formatNumber(balance)}`, isError: false };
        } else if (isWalletCompatible) {
          return { isError: true, text: 'You have insufficient balance' };
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    [isWalletCompatible],
  );

  return {
    validateInput,
  };
};
