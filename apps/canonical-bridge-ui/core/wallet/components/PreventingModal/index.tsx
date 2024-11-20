import { StateModal } from '@bnb-chain/canonical-bridge-widget';

interface PreventingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreventingModal(props: PreventingModalProps) {
  const { isOpen, onClose } = props;

  return (
    <StateModal
      title={'Oops!'}
      description={
        'Opening an app is not allowed on this site. Please go to BNB Chain Bridge site on your mobile browser to continue.'
      }
      isOpen={isOpen}
      type="error"
      onClose={onClose}
    />
  );
}
