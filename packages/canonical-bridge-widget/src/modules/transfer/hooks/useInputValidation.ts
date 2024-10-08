import { formatUnits } from 'viem';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import { formatNumber } from '@/core/utils/number';
import { useAppSelector } from '@/modules/store/StoreProvider';

export const useInputValidation = () => {
  const { chain } = useAccount();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const validateInput = useCallback(
    ({
      balance,
      decimal,
      value,
      bridgeType,
      estimatedAmount,
      nativeBalance,
    }: {
      balance: null | bigint;
      decimal: number;
      value: number;
      bridgeType?: BridgeType;
      isPegged?: boolean;
      estimatedAmount?: any;
      nativeBalance: any;
    }) => {
      try {
        if (!decimal || !value) {
          return null;
        }
        if (!!balance && value > Number(formatUnits(balance, decimal))) {
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

        if (!!balance) {
          return { text: `${formatNumber(Number(formatUnits(balance, decimal)))}`, isError: false };
        } else {
          if (fromChain?.id === chain?.id && chain) {
            return { isError: true, text: 'You have insufficient balance' };
          }
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    [chain, fromChain?.id],
  );

  return {
    validateInput,
  };
};
