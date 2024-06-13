import { useAppSelector } from '@/store/hooks';
import { Button } from '@node-real/uikit';

export function TransferButton({ onSubmit }: { onSubmit: () => void }) {
  const sendValue = useAppSelector((state) => state.transfer.sendValue);
  return (
    <Button
      onClick={onSubmit}
      isDisabled={!sendValue || sendValue === '0'}
      color="light.readable.normal"
      w="100%"
    >
      Transfer
    </Button>
  );
}
