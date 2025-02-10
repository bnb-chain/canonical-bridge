import { useIntl } from '@bnb-chain/space';

import { StateModal, StateModalProps } from '@/core/components/StateModal';

export const FeeTimeoutModal = (props: Omit<StateModalProps, 'title'>) => {
  const { ...restProps } = props;
  const { formatMessage } = useIntl();

  return (
    <StateModal
      className="bccb-widget-fee-timeout-modal"
      type="error"
      title={formatMessage({ id: 'modal.fee-timeout.error.title' })}
      description={formatMessage({ id: 'modal.fee-timeout.error.desc' })}
      buttonText={formatMessage({ id: 'modal.fee-timeout.error.button.close' })}
      bodyProps={{
        px: ['16px', '16px', '40px'],
      }}
      footerProps={{
        pb: ['32px', '32px', '40px'],
        px: ['16px', '16px', '40px'],
      }}
      {...restProps}
    />
  );
};
