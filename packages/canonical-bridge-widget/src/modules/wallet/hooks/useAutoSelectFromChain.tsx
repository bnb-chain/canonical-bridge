import { useAccount } from 'wagmi';
import { ChainType } from '@bnb-chain/canonical-bridge-sdk';

import { useSelection } from '@/modules/aggregator/hooks/useSelection';
import { useEvmSwitchChain } from '@/modules/wallet/hooks/useEvmSwitchChain';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useTronSwitchChain } from '@/modules/wallet/hooks/useTronSwitchChain';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';

interface UseAutoSelectFromChainProps {
  onPending?: () => void;
  onSettle?: () => void;
}

export function useAutoSelectFromChain(props: UseAutoSelectFromChainProps = {}) {
  const { onClickConnectWalletButton } = useBridgeConfig();
  const { selectFromChain } = useSelection();

  const evmAccount = useAccount();
  const tronAccount = useTronAccount();
  const solanaAccount = useSolanaAccount();

  const { switchChain: evmSwitchChain } = useEvmSwitchChain({
    mutation: {
      onMutate() {
        props.onPending?.();
      },
      onSettled() {
        props.onSettle?.();
      },
      onSuccess(_, { chainId }) {
        selectFromChain(chainId);
      },
    },
  });
  const { switchChain: tronSwitchChain } = useTronSwitchChain({
    mutation: {
      onMutate() {
        props.onPending?.();
      },
      onSettled() {
        props.onSettle?.();
      },
      onSuccess({ chainId }) {
        selectFromChain(chainId);
      },
    },
  });

  return {
    async autoSelectFromChain({ chainType, chainId }: { chainType: ChainType; chainId: number }) {
      const connectWallet = () => {
        onClickConnectWalletButton?.({
          chainType,
          chainId,
          onConnected({ walletType } = {}) {
            if (walletType === chainType) {
              selectFromChain(chainId);
            }
          },
        });
      };

      if (chainType === 'evm') {
        if (evmAccount.isConnected) {
          if (evmAccount.chainId !== chainId) {
            evmSwitchChain({
              chainId,
            });
          } else {
            selectFromChain(chainId);
          }
        } else {
          connectWallet();
        }
      } else if (chainType === 'tron') {
        if (tronAccount.isConnected) {
          if (tronAccount.chainId !== chainId) {
            tronSwitchChain({
              chainId,
            });
          } else {
            selectFromChain(chainId);
          }
        } else {
          connectWallet();
        }
      } else if (chainType === 'solana') {
        if (solanaAccount.isConnected) {
          selectFromChain(chainId);
        } else {
          connectWallet();
        }
      }
    },
  };
}
