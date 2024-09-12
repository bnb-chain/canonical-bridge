import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { isSameAddress } from '@/core/utils/address';
import { useBridgeConfigs, isAvailableChainOrToken } from '@/modules/bridges';
import { setFromChain, setSelectedToken, setToChain, setToToken } from '@/modules/transfer/action';

interface SetSelectionInfoParams {
  direction?: 'from' | 'to';
  fromChainId?: number;
  toChainId?: number;
  tokenSymbol?: string;
  tokenAddress?: string;
}

export function useSetSelectInfo() {
  const { getSupportedFromChains, getSupportedToChains, getSupportedTokens, getSelectedToToken } =
    useBridgeConfigs();

  const dispatch = useAppDispatch();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  return {
    setSelectInfo(params: SetSelectionInfoParams) {
      const fromChainId = params.fromChainId ?? fromChain?.id;
      const toChainId = params.toChainId ?? toChain?.id;
      const tokenSymbol = params.tokenSymbol ?? selectedToken?.symbol;
      const tokenAddress = params.tokenAddress ?? selectedToken?.address;

      const fromChains = getSupportedFromChains({
        toChainId,
      });
      const toChains = getSupportedToChains({
        fromChainId,
        tokenSymbol,
        tokenAddress,
      });
      const tokens = getSupportedTokens({
        fromChainId,
        toChainId,
      });

      const toToken = getSelectedToToken({
        fromChainId,
        toChainId,
        tokenSymbol,
        tokenAddress,
      });

      const nextFromChain = fromChains.find((chain) => chain.id === fromChainId);
      const nextToChain = toChains.find((chain) => chain.id === toChainId);
      const nextSelectedToken = tokens.find((token) => isSameAddress(token.address, tokenAddress));

      if (params.direction === 'from') {
        if (
          !isAvailableChainOrToken(nextFromChain) ||
          !isAvailableChainOrToken(nextSelectedToken)
        ) {
          dispatch(setToChain());
        } else {
          dispatch(setToChain(nextToChain));
        }
        dispatch(setFromChain(nextFromChain));
        dispatch(setSelectedToken(nextSelectedToken));
      }

      if (params.direction === 'to') {
        if (!isAvailableChainOrToken(nextToChain)) {
          dispatch(setFromChain());
          dispatch(setSelectedToken());
        } else {
          dispatch(setFromChain(nextFromChain));
          dispatch(setSelectedToken(nextSelectedToken));
        }
        dispatch(setToChain(nextToChain));
      }

      if (params.direction === undefined) {
        dispatch(setFromChain(nextFromChain));
        dispatch(setToChain(nextToChain));
        dispatch(setSelectedToken(nextSelectedToken));
      }

      dispatch(setToToken(toToken));
    },
  };
}
