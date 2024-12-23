import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks';

import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { ERROR_TYPES } from '@/core/constants/error';

interface UseTronSwitchChainProps {
  mutation?: {
    onMutate?: () => void;
    onSuccess?: (params: { chainId: number }) => void;
    onError?: (err: any) => void;
    onSettled?: () => void;
  };
}

export function useTronSwitchChain(props?: UseTronSwitchChainProps) {
  const { wallet } = useTronWallet();

  const { onError } = useBridgeConfig();

  return {
    async switchChain({ chainId }: { chainId: number }) {
      const hexChainId = `0x${chainId?.toString(16)}`;
      try {
        props?.mutation?.onMutate?.();
        const res = await wallet?.adapter?.switchChain(hexChainId);
        if (!res) {
          props?.mutation?.onSuccess?.({ chainId });
        }
      } catch (err: any) {
        onError?.({
          type: ERROR_TYPES.SWITCH_TRON_CHAIN,
          message: undefined,
          error: err,
        });
        props?.mutation?.onError?.(err);
      }
      props?.mutation?.onSettled?.();
    },
  };
}
