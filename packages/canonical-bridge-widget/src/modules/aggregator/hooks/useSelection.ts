import { isSameAddress } from '@/core/utils/address';
import { useBridgeConfig } from '@/modules/aggregator/components/BridgeConfigProvider';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { IBridgeChain, IBridgeToken } from '@/modules/aggregator/types';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setFromChain, setSelectedToken, setToChain, setToToken } from '@/modules/transfer/action';

export function useSelection() {
  const { getFromChains, getToChains, getTokens, getToToken, adapters } = useBridgeConfig();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectToken = useAppSelector((state) => state.transfer.selectedToken);
  const dispatch = useAppDispatch();

  const updateToToken = ({
    fromChainId = fromChain?.id,
    toChainId = toChain?.id,
    token = selectToken,
  }: {
    fromChainId?: number;
    toChainId?: number;
    token?: IBridgeToken;
  }) => {
    const newToToken = getToToken({
      fromChainId: fromChainId!,
      toChainId: toChainId!,
      token: token!,
    });
    dispatch(setToToken(newToToken));
  };

  return {
    selectDefault({
      fromChainId,
      toChainId,
      tokenSymbol,
      tokenAddress,
    }: {
      fromChainId: number;
      toChainId: number;
      tokenSymbol: string;
      tokenAddress: string;
    }) {
      const bridgeTypes = adapters.map((item) => item.bridgeType);
      const token = Object.fromEntries(
        bridgeTypes.map((item) => [item, { symbol: tokenSymbol }]),
      ) as any as IBridgeToken;

      const fromChains = getFromChains({
        toChainId,
        token,
      });
      const toChains = getToChains({
        fromChainId,
        token,
      });
      const tokens = getTokens({
        fromChainId,
        toChainId,
      });

      const newFromChain = fromChains.find((item) => item.id === fromChainId);
      const newToChain = toChains.find((item) => item.id === toChainId);
      const newToken = tokens.find((item) => isSameAddress(item.address, tokenAddress));

      dispatch(setFromChain(newFromChain));
      dispatch(setToChain(newToChain));
      dispatch(setSelectedToken(newToken));

      updateToToken({
        fromChainId: newFromChain?.id,
        toChainId: newToChain?.id,
        token: newToken,
      });
    },

    selectFromChain(fromChain: IBridgeChain) {
      const isIncompatible = isChainOrTokenCompatible(fromChain);

      if (isIncompatible) {
        dispatch(setFromChain(fromChain));
        updateToToken({
          fromChainId: fromChain?.id,
        });
      } else {
        const toChains = getToChains({
          fromChainId: fromChain.id,
        });
        const newToChain = toChains.find((chain) => isChainOrTokenCompatible(chain));

        const tokens = getTokens({
          fromChainId: fromChain.id,
          toChainId: newToChain?.id,
        });
        const newToken = tokens.find((token) => isChainOrTokenCompatible(token));

        const fromChains = getFromChains({
          toChainId: toChain?.id,
          token: newToken,
        });

        const newFromChain = fromChains.find((chain) => chain.id === fromChain.id);

        dispatch(setFromChain(newFromChain));
        dispatch(setToChain(newToChain));
        dispatch(setSelectedToken(newToken));

        updateToToken({
          fromChainId: newFromChain?.id,
          toChainId: newToChain?.id,
          token: newToken,
        });
      }
    },

    selectToChain(toChain: IBridgeChain) {
      dispatch(setToChain(toChain));
      updateToToken({
        toChainId: toChain?.id,
      });
    },

    selectToken(token: IBridgeToken) {
      dispatch(setSelectedToken(token));
      updateToToken({
        token,
      });
    },
  };
}