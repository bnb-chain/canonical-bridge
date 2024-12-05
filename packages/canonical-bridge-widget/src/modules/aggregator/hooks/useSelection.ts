import { useAccount, useChains } from 'wagmi';
import { useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import {
  ChainType,
  IBridgeChain,
  IBridgeToken,
  IBridgeTokenWithBalance,
} from '@/modules/aggregator/types';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setFromChain, setSelectedToken, setToChain, setToToken } from '@/modules/transfer/action';
import { useTokenPrice } from '@/modules/aggregator/hooks/useTokenPrice';
import { getTokenBalances } from '@/modules/aggregator/shared/getTokenBalances';
import { sortTokens } from '@/modules/aggregator/shared/sortTokens';
import { useTronWeb } from '@/core/hooks/useTronWeb';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { isSameAddress } from '@/core/utils/address';

export function useSelection() {
  const { getFromChains, getToChains, getTokens, getToToken, adapters } = useAggregator();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const dispatch = useAppDispatch();

  const { getSortedTokens } = useSortedTokens();

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
    tmpFromChain = fromChain,
    tmpToChain = toChain,
    tmpToken = selectedToken,
  }: {
    tmpFromChain?: IBridgeChain;
    tmpToChain?: IBridgeChain;
    tmpToken?: IBridgeToken;
  }) => {
    const newToken = getTokens({
      fromChainId: tmpFromChain?.id,
      toChainId: tmpToChain?.id,
    }).find((t) => isSameAddress(t.address, tmpToken?.address));

    const newFromChain = getFromChains({
      toChainId: tmpToChain?.id,
      token: newToken,
    }).find((c) => c.id === tmpFromChain?.id);

    const newToChain = getToChains({
      fromChainId: tmpFromChain?.id,
      token: newToken,
    }).find((c) => c.id === tmpToChain?.id);

    dispatch(setFromChain(newFromChain));
    dispatch(setToChain(newToChain));
    dispatch(setSelectedToken(newToken));

    updateToToken({
      fromChainId: newFromChain?.id,
      toChainId: newToChain?.id,
      token: newToken,
    });
  };

  const selectFromChain = async (tmpFromChain: IBridgeChain) => {
    // After selecting fromChain, if toChain becomes incompatible, reselect the first compatible network in toChain list.
    const toChains = getToChains({
      fromChainId: tmpFromChain.id,
    });
    const tmpToChain =
      toChains.find((c) => isChainOrTokenCompatible(c) && c.id === toChain?.id) ??
      toChains.find((c) => isChainOrTokenCompatible(c) && c.chainType !== 'link');

    const tmpTokens = await getSortedTokens({
      chainType: tmpFromChain.chainType,
      fromChainId: tmpFromChain.id,
      tokens: getTokens({
        fromChainId: tmpFromChain.id,
        toChainId: tmpToChain?.id,
      }),
    });

    const newToken =
      tmpTokens.find(
        (t) => isChainOrTokenCompatible(t) && isSameAddress(t.address, selectedToken?.address),
      ) ?? tmpTokens.find((t) => isChainOrTokenCompatible(t));

    updateSelectedInfo({
      tmpToken: newToken,
      tmpFromChain,
      tmpToChain,
    });
  };

  return {
    async selectDefault({
      walletChainId,
      fromChainId,
      toChainId,
      tokenSymbol,
    }: {
      walletChainId?: number;
      fromChainId: number;
      toChainId: number;
      tokenSymbol: string;
    }) {
      const bridgeTypes = adapters.map((item) => item.bridgeType);
      const token = Object.fromEntries(
        bridgeTypes.map((item) => [item, { symbol: tokenSymbol }]),
      ) as any as IBridgeToken;

      if (walletChainId) {
        const fromChains = getFromChains({});
        const chain = fromChains.find((chain) => chain.id === walletChainId);
        if (chain) {
          selectFromChain(chain);
          return;
        }
        if (fromChain?.id) return;
      }

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
        (item) => item.displaySymbol.toUpperCase() === tokenSymbol.toUpperCase(),
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
    selectFromChain,
    async selectToChain(tmpToChain: IBridgeChain) {
      const fromChainId = fromChain!.id;

      const tmpTokens = await getSortedTokens({
        fromChainId,
        tokens: getTokens({
          fromChainId,
          toChainId: tmpToChain?.id,
        }),
      });

      const newToken =
        tmpTokens.find(
          (t) =>
            isChainOrTokenCompatible(t) &&
            t.displaySymbol.toUpperCase() === selectedToken?.displaySymbol.toUpperCase(),
        ) ?? tmpTokens.find((t) => isChainOrTokenCompatible(t));

      updateSelectedInfo({
        tmpToken: newToken,
        tmpFromChain: fromChain,
        tmpToChain,
      });
    },

    async selectToken(newToken: IBridgeToken) {
      updateSelectedInfo({
        tmpToken: newToken,
      });
    },
  };
}

function useSortedTokens() {
  const { transferConfig } = useAggregator();
  const { getTokenPrice } = useTokenPrice();

  const { address } = useAccount();
  const { address: solanaAddress } = useSolanaAccount();
  const { address: tronAddress } = useTronAccount();

  const chains = useChains();
  const { connection } = useConnection();
  const tronWeb = useTronWeb();

  const getSortedTokens = useCallback(
    async ({
      fromChainId,
      chainType,
      tokens,
    }: {
      fromChainId: number;
      chainType?: ChainType;
      tokens: IBridgeToken[];
    }) => {
      const balances = await getTokenBalances({
        chainType,
        tokens,
        evmParams: {
          account: address,
          chain: chains?.find((item) => item.id === fromChainId),
        },
        solanaParams: {
          account: solanaAddress,
          connection,
        },
        tronParams: {
          account: tronAddress,
          tronWeb,
        },
      });

      const tmpTokens = tokens.map((item) => {
        const balance = balances[item.address?.toLowerCase()];
        const price = getTokenPrice(item);

        let value: number | undefined;
        if (balance !== undefined && price !== undefined) {
          value = Number(balance) * price;
        }

        return {
          ...item,
          balance,
          value,
        } as IBridgeTokenWithBalance;
      });

      return sortTokens({
        tokens: tmpTokens,
        orders: transferConfig.order?.tokens,
      });
    },
    [
      address,
      chains,
      solanaAddress,
      connection,
      tronAddress,
      tronWeb,
      transferConfig.order?.tokens,
      getTokenPrice,
    ],
  );

  return {
    getSortedTokens,
  };
}
