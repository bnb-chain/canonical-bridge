import { useIntl } from '@bnb-chain/space';

import { StateModal } from '@/core/components/StateModal';

interface SwitchingTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SwitchingTipsModal(props: SwitchingTipsModalProps) {
  const { formatMessage } = useIntl();
  const { isOpen, onClose } = props;

  return (
    <StateModal
      className="bccb-widget-header-switching-tips-modal"
      title={formatMessage({ id: 'wallet.switching-modal.title' })}
      description={formatMessage({ id: 'wallet.switching-modal.desc' })}
      isOpen={isOpen}
      type="error"
      onClose={onClose}
    />
  );
}
