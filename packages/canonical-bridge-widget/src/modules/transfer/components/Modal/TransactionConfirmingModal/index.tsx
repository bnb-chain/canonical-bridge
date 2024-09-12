import { StateModal, StateModalProps } from '@/core/components/StateModal';

export function TransactionConfirmingModal(props: Omit<StateModalProps, 'title'>) {
  const { ...restProps } = props;

  return (
    <StateModal
      type="confirming"
      title="Waiting For Confirmation"
      description={'Confirm this transaction in your wallet'}
      closeButton={<></>}
      bodyProps={{
        pb: 0,
      }}
      {...restProps}
    />
  );
}
