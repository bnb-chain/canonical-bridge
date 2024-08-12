import {
  Toast,
  ToastContent,
  ToastIcon,
  ToastLeftContent,
  ToastTitle,
  useIntl,
  useToast,
} from '@bnb-chain/space';
import { useAccount, useSwitchNetwork } from 'wagmi';

type UseAppSwitchNetworkProps = Parameters<typeof useSwitchNetwork>[0];

// walletConnect:
// An error occurred when attempting to switch chain. Details: The JSON sent is not a valid Request object. Version: viem@2.0.10

export function useAppSwitchNetwork(props?: UseAppSwitchNetworkProps) {
  const toast = useToast();

  const { connector } = useAccount();
  const { formatMessage } = useIntl();

  const res = useSwitchNetwork({
    ...props,
    onError: (err, ...params) => {
      const switchErrorMsg = formatMessage({ id: 'wallet.error.switch-network' });

      let message = '';
      if (connector?.id === 'walletConnect') {
        if (err?.message?.includes('The JSON sent is not a valid Request object')) {
          message = switchErrorMsg;
        }
      }

      if (connector?.id === 'trust') {
        if (err?.message?.includes('Error Calling Method: switchEthereumChain')) {
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

      props?.onError?.(err, ...params);
    },
  });

  return res;
}
