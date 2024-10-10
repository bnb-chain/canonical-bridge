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

type UseEvmSwitchChainProps = Parameters<typeof useSwitchChain>[0];

// walletConnect:
// An error occurred when attempting to switch chain. Details: The JSON sent is not a valid Request object. Version: viem@2.0.10

export function useEvmSwitchChain(props?: UseEvmSwitchChainProps) {
  const toast = useToast();

  const { connector } = useAccount();
  const { formatMessage } = useIntl();

  const res = useSwitchChain({
    ...props,
    mutation: {
      ...props?.mutation,
      onError: (err: any, ...params) => {
        const switchErrorMsg = formatMessage({ id: 'wallet.error.switch-network' });

        let message = '';
        if (
          connector?.id === 'walletConnect' ||
          connector?.id === 'trust' ||
          connector?.id === 'binanceWeb3Wallet'
        ) {
          if (
            err?.message?.includes('The JSON sent is not a valid Request object') ||
            err?.message?.includes('Error Calling Method: switchEthereumChain') ||
            err?.details?.includes('not support')
          ) {
            message = switchErrorMsg;
          }
        }

        if (message) {
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

        props?.mutation?.onError?.(err, ...params);
      },
    },
  });

  return res;
}
