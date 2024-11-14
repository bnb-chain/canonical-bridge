import { useIntl } from '@bnb-chain/space';

import { StateModal, StateModalProps } from '@/core/components/StateModal';

export function TransactionConfirmingModal(props: Omit<StateModalProps, 'title'>) {
  const { ...restProps } = props;

  const { formatMessage } = useIntl();

  return (
    <StateModal
      className="bccb-widget-transaction-confirming-modal"
      type="confirming"
      title={formatMessage({ id: 'modal.confirm.title' })}
      description={formatMessage({ id: 'modal.confirm.desc' })}
      closeButton={<></>}
      bodyProps={{
        pb: 0,
      }}
      {...restProps}
    />
  );
}
