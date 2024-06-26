import { BnbChainButton } from '@/app/transfer/components/BNBChain/BnbChainButton';
import { useAppSelector } from '@/store/hooks';
import { toast } from '@node-real/uikit';
import { useSwitchNetwork } from 'wagmi';

export const SwitchNetworkButton = () => {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { switchNetwork } = useSwitchNetwork({
    onError: (err: any) => {
      toast.error({
        description: err.message,
      });
    },
  });
  return (
    <BnbChainButton
      onClick={() => {
        if (fromChain?.id && switchNetwork) {
          switchNetwork(fromChain?.id);
        }
      }}
      color="light.readable.normal"
      w="100%"
    >
      Switch Network
    </BnbChainButton>
  );
};
