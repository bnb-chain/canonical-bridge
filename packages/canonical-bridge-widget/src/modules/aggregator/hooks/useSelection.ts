import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { IBridgeChain, IBridgeToken } from '@/modules/aggregator/types';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setFromChain, setSelectedToken, setToChain, setToToken } from '@/modules/transfer/action';

export function useSelection() {
  const { getFromChains, getToChains, getTokens, getToToken, adapters } = useAggregator();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const dispatch = useAppDispatch();

  const updateToToken = ({
    fromChainId = fromChain?.id,
    toChainId = toChain?.id,
    token = selectedToken,
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

  const updateSelectedInfo = ({
    nextFromChain = fromChain,
    nextToChain = toChain,
    nextToken = selectedToken,
  }: {
    nextFromChain?: IBridgeChain;
    nextToChain?: IBridgeChain;
    nextToken?: IBridgeToken;
  }) => {
    const newToken = getTokens({
      fromChainId: nextFromChain?.id,
      toChainId: nextToChain?.id,
    }).find((t) => t.displaySymbol === nextToken?.displaySymbol);

    const newFromChain = getFromChains({
      toChainId: nextToChain?.id,
      token: newToken,
    }).find((c) => c.id === nextFromChain?.id);

    const newToChain = getToChains({
      fromChainId: nextFromChain?.id,
      token: newToken,
    }).find((c) => c.id === nextToChain?.id);

    dispatch(setFromChain(newFromChain));
    dispatch(setToChain(newToChain));
    dispatch(setSelectedToken(newToken));

    updateToToken({
      fromChainId: newFromChain?.id,
      toChainId: newToChain?.id,
      token: newToken,
    });
  };

  return {
    selectDefault({
      fromChainId,
      toChainId,
      tokenSymbol,
    }: {
      fromChainId: number;
      toChainId: number;
      tokenSymbol: string;
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
      const newToken = tokens.find(
        (item) => item.symbol.toUpperCase() === tokenSymbol.toUpperCase(),
      );

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
      const isCompatible = isChainOrTokenCompatible(fromChain);

      if (isCompatible) {
        updateSelectedInfo({
          nextFromChain: fromChain,
        });
      } else {
        const toChain = getToChains({
          fromChainId: fromChain.id,
        }).find((chain) => isChainOrTokenCompatible(chain) && chain.chainType !== 'link');

        const newToken = getTokens({
          fromChainId: fromChain.id,
          toChainId: toChain?.id,
        }).find((token) => isChainOrTokenCompatible(token));

        const newFromChain = getFromChains({
          toChainId: toChain?.id,
          token: newToken,
        }).find((chain) => chain.id === fromChain.id);

        const newToChain = getToChains({
          fromChainId: fromChain?.id,
          token: newToken,
        }).find((chain) => chain.id === toChain?.id);

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
      updateSelectedInfo({
        nextToChain: toChain,
      });
    },

    selectToken(newToken: IBridgeToken) {
      updateSelectedInfo({
        nextToken: newToken,
      });
    },
  };
}
