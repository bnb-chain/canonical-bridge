import { useIntl } from '@bnb-chain/space';

import { StateModal, StateModalProps } from '@/core/components/StateModal';

export const FailedToGetQuoteModal = (props: Omit<StateModalProps, 'title'>) => {
  const { ...restProps } = props;
  const { formatMessage } = useIntl();

  return (
    <StateModal
      className="bccb-widget-quote-error-modal"
      type="error"
      title={formatMessage({ id: 'modal.quote.error.title' })}
      description={formatMessage({ id: 'modal.quote.error.desc' })}
      buttonText={formatMessage({ id: 'modal.quote.error.button.close' })}
      {...restProps}
    />
  );
};
