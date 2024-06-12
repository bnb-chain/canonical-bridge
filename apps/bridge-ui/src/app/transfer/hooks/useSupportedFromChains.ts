import { useTransferConfigs } from '@/providers/TransferConfigsProvider';

export function useSupportedFromChains() {
  const { chains } = useTransferConfigs();
  return chains;
}
