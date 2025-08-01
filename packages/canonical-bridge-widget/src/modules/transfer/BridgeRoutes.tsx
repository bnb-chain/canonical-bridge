import { useBreakpointValue, useIntl } from '@bnb-chain/space';
import { useEffect } from 'react';

import { TransferOverview } from '@/modules/transfer/components/TransferOverview';
import { RoutesModal } from '@/modules/transfer/components/TransferOverview/modal/RoutesModal';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import {
  setIsGlobalFeeLoading,
  setIsManuallyReload,
  setIsRefreshing,
  setIsRoutesModalOpen,
} from '@/modules/transfer/action';
import { TriggerType, useLoadingBridgeFees } from '@/modules/transfer/hooks/useLoadingBridgeFees';

export function BridgeRoutes() {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;
  const { loadingBridgeFees } = useLoadingBridgeFees();
  const bridgeConfig = useBridgeConfig();
  const isRoutesModalOpen = useAppSelector((state) => state.transfer.isRoutesModalOpen);
  const transferActionInfo = useAppSelector((state) => state.transfer.transferActionInfo);
  const isManuallyReload = useAppSelector((state) => state.transfer.isManuallyReload);
  const toToken = useAppSelector((state) => state.transfer.toToken);

  // Load estimated bridge fees every 30 seconds when there is bridge route available
  useEffect(() => {
    let mount = true;
    if (!mount || !toToken) return;

    if (transferActionInfo?.bridgeAddress) {
      const params = {
        triggerType: 'refresh' as TriggerType,
      };

      let interval = setInterval(() => {
        dispatch(setIsGlobalFeeLoading(true));
        loadingBridgeFees(params);
      }, bridgeConfig.http.refetchingInterval ?? 30000);

      // Stop and restart fee loading
      if (isManuallyReload === true) {
        dispatch(setIsManuallyReload(false));
        dispatch(setIsRefreshing(true));
        if (interval) {
          clearInterval(interval);
          dispatch(setIsGlobalFeeLoading(true));
          loadingBridgeFees(params);
          dispatch(setIsRefreshing(false));
          interval = setInterval(() => {
            dispatch(setIsGlobalFeeLoading(true));
            loadingBridgeFees(params);
          }, bridgeConfig.http?.refetchingInterval ?? 30000);
        }
      }

      return () => {
        mount = false;
        interval && clearInterval(interval);
        dispatch(setIsManuallyReload(false));
      };
    } else {
      dispatch(setIsManuallyReload(false));
      mount = false;
    }
  }, [
    transferActionInfo?.bridgeAddress,
    loadingBridgeFees,
    dispatch,
    bridgeConfig.http.refetchingInterval,
    isManuallyReload,
    toToken,
  ]);

  if (isBase) {
    return (
      <RoutesModal
        title={formatMessage({ id: 'route.title.select.routes' })}
        isOpen={isRoutesModalOpen}
        onClose={() => dispatch(setIsRoutesModalOpen(false))}
      >
        <TransferOverview />
      </RoutesModal>
    );
  }

  return <TransferOverview routeContentBottom={bridgeConfig.components.routeContentBottom} />;
}
