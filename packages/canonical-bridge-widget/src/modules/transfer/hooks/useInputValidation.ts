import { formatUnits } from 'viem';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { useCallback } from 'react';

import { formatNumber } from '@/core/utils/number';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useSolanaBalance } from '@/modules/wallet/hooks/useSolanaBalance';
import { MIN_SOL_TO_ENABLED_TX } from '@/core/constants';
import { useIsWalletCompatible } from '@/modules/wallet/hooks/useIsWalletCompatible';
import { useTokenUpperLimit } from '@/modules/aggregator/hooks/useTokenUpperLimit';
import { useBridgeConfig } from '@/index';

export const useInputValidation = () => {
  const { data } = useSolanaBalance();
  const isWalletCompatible = useIsWalletCompatible();
  const {
    transfer: { dollarUpperLimit },
  } = useBridgeConfig();
  const solBalance = Number(data?.formatted);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const priceInfo = useTokenUpperLimit();
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

        // Check upper limit
        if (priceInfo?.isError) {
          return {
            text: `This token is not available at the moment. Please try again later.`,
            isError: true,
          };
        }

        if (priceInfo?.upperLimit && Number(value) > Number(priceInfo?.upperLimit)) {
          return {
            text: `Transfer value over $${formatNumber(dollarUpperLimit)} (${formatNumber(
              priceInfo.upperLimit,
            )} ${selectedToken?.symbol}) is not allowed`,
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
          if (fromChain?.chainType === 'solana' && solBalance < MIN_SOL_TO_ENABLED_TX) {
            return {
              text: ``, // Error message has been moved to send button section
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
    [
      fromChain?.chainType,
      solBalance,
      isWalletCompatible,
      priceInfo,
      dollarUpperLimit,
      selectedToken?.symbol,
    ],
  );

  return {
    validateInput,
  };
};
