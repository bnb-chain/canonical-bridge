import { useCallback } from 'react';
import { Quote } from '@mayanfinance/swap-sdk';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setRouteFees } from '@/modules/transfer/action';
import { formatNumber } from '@/core/utils/number';
import { formatFeeAmount } from '@/core/utils/string';

export const useGetMayanFees = () => {
  const dispatch = useAppDispatch();
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  // todo gas fee check?
  const mayanFeeSorting = useCallback(
    async (quote: Quote) => {
      let feeContent = '';
      const feeBreakdown = [];

      // solanaRelayerFee
      if (quote.solanaRelayerFee) {
        feeBreakdown.push({
          label: 'SolanaRelayerFee',
          value: `${formatNumber(Number(quote.solanaRelayerFee), 8)} ${
            quote.type === 'WH' ? selectedToken?.symbol : 'USDC'
          }`,
          name: 'solanaRelayerFee',
        });
      }

      // redeemRelayerFee
      if (quote.redeemRelayerFee) {
        feeBreakdown.push({
          label: 'RedeemRelayerFee',
          value: `${formatNumber(Number(quote.redeemRelayerFee), 8)} ${
            quote.type === 'WH' ? selectedToken?.symbol : 'USDC'
          }`,
          name: 'redeemRelayerFee',
        });
      }

      // clientRelayerFeeSuccess
      if (quote.clientRelayerFeeSuccess) {
        feeContent = `${String(
          formatFeeAmount((quote.solanaRelayerFee || 0) + (quote.redeemRelayerFee || 0)),
        )} ${quote.type === 'WH' ? selectedToken?.symbol : 'USDC'}`;
      }

      dispatch(
        setRouteFees({
          mayan: {
            summary: !!feeContent ? feeContent : '--',
            breakdown: feeBreakdown,
          },
        }),
      );

      return {
        summary: !!feeContent ? feeContent : '--',
        breakdown: feeBreakdown,
        isFailedToGetGas: false,
        isDisplayError: false,
      };
    },
    [dispatch, selectedToken?.symbol],
  );

  return { mayanFeeSorting };
};
