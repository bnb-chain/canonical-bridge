import {
  Toast,
  ToastContent,
  ToastIcon,
  ToastLeftContent,
  ToastTitle,
  useIntl,
  useToast,
} from '@bnb-chain/space';
import { useAccount, useSwitchChain } from 'wagmi';

import { ERROR_TYPES } from '@/core/constants/error';
import { useBridgeConfig } from '@/index';

type UseEvmSwitchChainProps = Parameters<typeof useSwitchChain>[0];

// walletConnect:
// An error occurred when attempting to switch chain. Details: The JSON sent is not a valid Request object. Version: viem@2.0.10

export function useEvmSwitchChain(props?: UseEvmSwitchChainProps) {
  const toast = useToast();

  const { connector } = useAccount();
  const { formatMessage } = useIntl();
  const { onError } = useBridgeConfig();

  const res = useSwitchChain({
    ...props,
    mutation: {
      ...props?.mutation,
      onError: (err: any, ...params) => {
        const switchErrorMsg = formatMessage({ id: 'wallet.error.switch-network' });

        let message: string | undefined = undefined;
        if (
          connector?.id === 'walletConnect' ||
          connector?.id === 'trust' ||
          connector?.id === 'binanceWeb3Wallet' ||
          connector?.id === 'BinanceW3WSDK'
        ) {
          if (
            err?.message?.includes('The JSON sent is not a valid Request object') ||
            err?.message?.includes('Error Calling Method: switchEthereumChain') ||
            err?.details?.includes('not support') ||
            (connector?.id === 'BinanceW3WSDK' && err.code === 4902)
          ) {
            message = switchErrorMsg;
          }
        }

        if (message && !onError) {
          toast({
            render() {
              return (
                <Toast variant="bottom-accent" status="info">
                  <ToastLeftContent>
                    <ToastIcon />
                  </ToastLeftContent>
                  <ToastContent>
                    <ToastTitle>{message}</ToastTitle>
                  </ToastContent>
                </Toast>
              );
            },
          });
        }

        onError?.({
          type: ERROR_TYPES.SWITCH_EVM_CHAIN,
          message,
          error: err,
        });

        props?.mutation?.onError?.(err, ...params);
      },
    },
  });

  return res;
}
