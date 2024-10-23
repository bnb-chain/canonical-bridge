import { useTronWallet } from '@node-real/walletkit/tron';

interface UseTronSwitchChainProps {
  mutation?: {
    onSuccess?: () => void;
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
          props?.mutation?.onSuccess?.();
        }
      } catch (err) {
        props?.mutation?.onError?.(err);
      }
    },
  };
}
