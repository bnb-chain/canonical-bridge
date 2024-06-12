import { useTransferConfigs } from '@/providers/TransferConfigsProvider';
import { useAppSelector } from '@/store/hooks';

export function useSupportedToChains() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { chains } = useTransferConfigs();
  return chains;
}
