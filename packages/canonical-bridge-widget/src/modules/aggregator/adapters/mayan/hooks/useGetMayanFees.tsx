import { useCallback } from 'react';

import { useAppDispatch } from '@/modules/store/StoreProvider';
import { setRouteFees } from '@/modules/transfer/action';

// todo
export const useGetMayanFees = () => {
  const dispatch = useAppDispatch();
  // const { formatMessage } = useIntl();
  //
  // const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const mayanFeeSorting = useCallback(() => {
    dispatch(
      setRouteFees({
        mayan: {
          summary: '--',
          breakdown: [],
        },
      }),
    );

    return {
      summary: '--',
      breakdown: [],
      isFailedToGetGas: false,
      isDisplayError: false,
    };
  }, [dispatch]);

  return { mayanFeeSorting };
};
