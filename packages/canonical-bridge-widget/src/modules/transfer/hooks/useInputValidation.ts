import { formatUnits } from 'viem';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { useCallback } from 'react';

import { formatNumber } from '@/core/utils/number';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useSolanaBalance } from '@/modules/wallet/hooks/useSolanaBalance';
import { MIN_SOL_TO_ENABLED_TX } from '@/core/constants';
import { useIsWalletCompatible } from '@/modules/wallet/hooks/useIsWalletCompatible';

export const useInputValidation = () => {
  const { data } = useSolanaBalance();
  const isWalletCompatible = useIsWalletCompatible();
  const solBalance = Number(data?.formatted);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
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
        if (Number(value) < Math.pow(10, -decimal)) {
          return {
            text: `The amount is too small. Please enter a valid amount to transfer.`,
            isError: true,
          };
        }
        if (!!balance && value > balance) {
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

        if (!!balance) {
          if (fromChain?.chainType === 'solana' && solBalance < MIN_SOL_TO_ENABLED_TX) {
            return {
              text: `You should have at least ${MIN_SOL_TO_ENABLED_TX} SOL in your balance to perform this trade.`,
              isError: true,
            };
          } else {
            return { text: `${formatNumber(balance)}`, isError: false };
          }
        } else if (isWalletCompatible) {
          return { isError: true, text: 'You have insufficient balance' };
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    [fromChain?.chainType, solBalance, isWalletCompatible],
  );

  return {
    validateInput,
  };
};
