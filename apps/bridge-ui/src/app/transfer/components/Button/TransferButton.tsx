import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { Button } from '@node-real/uikit';

export function TransferButton({ onSubmit }: { onSubmit: () => void }) {
  const { transferValue } = useStore();
  return (
    <Button
      onClick={onSubmit}
      isDisabled={!transferValue || transferValue === '0'}
      color="light.readable.normal"
      w="100%"
    >
      Transfer
    </Button>
  );
}
