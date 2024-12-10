import React, { useContext, useMemo } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';

interface ExportsContextProps {
  isGlobalFeeLoading: boolean;
  isRefreshing: boolean;
}

const ExportsContext = React.createContext({} as ExportsContextProps);

export function ExportsProvider(props: React.PropsWithChildren) {
  const { children } = props;

  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading) ?? false;
  const isRefreshing = useAppSelector((state) => state.transfer.isRefreshing) ?? false;

  const value = useMemo(() => {
    return {
      isGlobalFeeLoading,
      isRefreshing,
    };
  }, [isGlobalFeeLoading, isRefreshing]);

  return <ExportsContext.Provider value={value}>{children}</ExportsContext.Provider>;
}

export function useBridge() {
  return useContext(ExportsContext);
}
