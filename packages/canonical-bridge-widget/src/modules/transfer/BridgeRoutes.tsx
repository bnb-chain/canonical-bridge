import { useBreakpointValue, useIntl } from '@bnb-chain/space';

import { TransferOverview } from '@/modules/transfer/components/TransferOverview';
import { RoutesModal } from '@/modules/transfer/components/TransferOverview/modal/RoutesModal';
import { useBridgeConfig } from '@/CanonicalBrideProvider';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setIsRoutesModalOpen } from '@/modules/transfer/action';

export function BridgeRoutes() {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const isBase = useBreakpointValue({ base: true, lg: false }) ?? false;
  const bridgeConfig = useBridgeConfig();
  const isRoutesModalOpen = useAppSelector((state) => state.transfer.isRoutesModalOpen);

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
