import { useIntl } from '@bnb-chain/space';

import { StateModal } from '@/core/components/StateModal';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setIsOpenSwitchingTipsModal } from '@/modules/wallet/action';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';

// chainId
// TronGrid: 0x2b6653dc
// TronStack: 0x2b6653dc
// Shasta Testnet: 0x94a9059e
// Nile Testnet: 0xcd8690dc

export function SwitchingTipsModal() {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();

  const { walletType } = useCurrentWallet();
  const isOpenSwitchingTipsModal = useAppSelector((state) => state.wallet.isOpenSwitchingTipsModal);

  if (walletType !== 'tron') {
    return null;
  }

  return (
    <StateModal
      title={formatMessage({ id: 'wallet.switching-modal.title' })}
      description={formatMessage({ id: 'wallet.switching-modal.desc' })}
      isOpen={isOpenSwitchingTipsModal}
      type="error"
      onClose={() => {
        dispatch(setIsOpenSwitchingTipsModal(false));
      }}
    />
  );
}
