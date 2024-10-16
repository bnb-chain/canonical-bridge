import { useCallback } from 'react';
import { formatUnits } from 'viem';
import { useIntl } from '@bnb-chain/space';

import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setRouteFees } from '@/modules/transfer/action';
import { formatNumber } from '@/core/utils/number';
import { formatFeeAmount } from '@/core/utils/string';

export const useGetMesonFees = () => {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();

  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const mesonFeeSorting = useCallback(
    async (fees: any) => {
      let feeContent = '';
      const feeBreakdown = [];
      const isDisplayError = false; // API error display

      // service fee
      if (!!fees?.serviceFee) {
        const serviceFee = formatUnits(fees?.serviceFee, selectedToken?.meson?.raw?.decimals || 18);
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.service-fee' }),
          value: `${formatNumber(Number(serviceFee), 8)} ${selectedToken?.symbol}`,
          name: 'baseFee',
        });
      }

      // liquidity providers fee
      if (!!fees?.lpFee) {
        const lpFee = formatUnits(fees?.lpFee, selectedToken?.meson?.raw?.decimals || 18);
        feeBreakdown.push({
          label: formatMessage({ id: 'route.option.info.lp-fee' }),
          value: `${formatNumber(Number(lpFee), 8)} ${selectedToken?.symbol}`,
          name: 'baseFee',
        });
      }

      if (!!fees?.totalFee) {
        const totalFee = formatUnits(fees?.totalFee, selectedToken?.meson?.raw?.decimals || 18);
        feeContent = `${String(formatFeeAmount(totalFee))} ${selectedToken?.symbol}`;
      }

      dispatch(
        setRouteFees({
          meson: {
            summary: !!feeContent ? feeContent : '--',
            breakdown: feeBreakdown,
          },
        }),
      );
      return {
        summary: !!feeContent ? feeContent : '--',
        breakdown: feeBreakdown,
        isFailedToGetGas: false,
        isDisplayError,
      };
    },
    [dispatch, formatMessage, selectedToken],
  );

  return { mesonFeeSorting };
};
