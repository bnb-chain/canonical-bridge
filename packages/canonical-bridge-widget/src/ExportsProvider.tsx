import React, { useContext, useMemo } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { IBridgeConfig, useBridgeConfig } from '@/index';

interface ExportsContextProps {
  config: IBridgeConfig;
  isGlobalFeeLoading: boolean;
  isRefreshing: boolean;
}

const ExportsContext = React.createContext({} as ExportsContextProps);

export function ExportsProvider(props: React.PropsWithChildren) {
  const { children } = props;

  const isGlobalFeeLoading = useAppSelector((state) => state.transfer.isGlobalFeeLoading) ?? false;
  const isRefreshing = useAppSelector((state) => state.transfer.isRefreshing) ?? false;

  const config = useBridgeConfig();

  const value = useMemo(() => {
    return {
      config,
      isGlobalFeeLoading,
      isRefreshing,
    };
  }, [config, isGlobalFeeLoading, isRefreshing]);

  return <ExportsContext.Provider value={value}>{children}</ExportsContext.Provider>;
}

export function useBridge() {
  return useContext(ExportsContext);
}
