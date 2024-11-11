import { useIntl } from '@bnb-chain/space';

import { StateModal, StateModalProps } from '@/core/components/StateModal';

export function TransactionFailedModal(props: Omit<StateModalProps, 'title'>) {
  const { ...restProps } = props;
  const { formatMessage } = useIntl();

  return (
    <StateModal
      className="bccb-widget-transaction-failed-modal"
      type="error"
      title={formatMessage({ id: 'modal.fail.title' })}
      description={formatMessage({ id: 'modal.fail.desc' })}
      buttonText={formatMessage({ id: 'modal.fail.button.close' })}
      {...restProps}
    />
  );
}
