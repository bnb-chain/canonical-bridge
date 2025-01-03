import { useAccount } from 'wagmi';
import { ChainType } from '@bnb-chain/canonical-bridge-sdk';

import { useFromChains } from '@/modules/aggregator/hooks/useFromChains';
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

  const supportedChains = useFromChains();
  const evmAccount = useAccount();
  const tronAccount = useTronAccount();
  const solanaAccount = useSolanaAccount();

  const selectChain = (chainId: number) => {
    const chain = supportedChains.find((e) => e.id === chainId);
    if (chain) {
      selectFromChain(chain);
    }
  };

  const { switchChain: evmSwitchChain } = useEvmSwitchChain({
    mutation: {
      onMutate() {
        props.onPending?.();
      },
      onSettled() {
        props.onSettle?.();
      },
      onSuccess(_, { chainId }) {
        selectChain(chainId);
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
        selectChain(chainId);
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
              selectChain(chainId);
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
            selectChain(chainId);
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
            selectChain(chainId);
          }
        } else {
          connectWallet();
        }
      } else if (chainType === 'solana') {
        if (solanaAccount.isConnected) {
          selectChain(chainId);
        } else {
          connectWallet();
        }
      }
    },
  };
}
