import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks';

interface UseTronSwitchChainProps {
  mutation?: {
    onSuccess?: (params: { chainId: number }) => void;
    onError?: (err: any) => void;
  };
}

export function useTronSwitchChain(props?: UseTronSwitchChainProps) {
  const { wallet } = useTronWallet();

  return {
    async switchChain({ chainId }: { chainId: number }) {
      const hexChainId = `0x${chainId?.toString(16)}`;
      try {
        const res = await wallet?.adapter?.switchChain(hexChainId);
        if (!res) {
          props?.mutation?.onSuccess?.({ chainId });
        }
      } catch (err) {
        props?.mutation?.onError?.(err);
      }
    },
  };
}
