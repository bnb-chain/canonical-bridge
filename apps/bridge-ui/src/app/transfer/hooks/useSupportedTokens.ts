import { useTransferConfigs } from '@/providers/TransferConfigsProvider';
import { useAppSelector } from '@/store/hooks';

export function useSupportedTokens() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const { tokens } = useTransferConfigs();

  return tokens[fromChain.id] ?? [];
}
