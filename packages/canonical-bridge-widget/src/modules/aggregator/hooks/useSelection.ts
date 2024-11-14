import { useChains } from 'wagmi';
import { useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ChainType, IBridgeChain, IBridgeToken } from '@bnb-chain/canonical-bridge-sdk';

import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { IBridgeTokenWithBalance } from '@/modules/aggregator/types';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setFromChain, setSelectedToken, setToChain, setToToken } from '@/modules/transfer/action';
import { useTokenPrice } from '@/modules/aggregator/hooks/useTokenPrice';
import { getTokenBalances } from '@/modules/aggregator/shared/getTokenBalances';
import { sortTokens } from '@/modules/aggregator/shared/sortTokens';
import { useTronWeb } from '@/core/hooks/useTronWeb';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';
import { useBridgeSDK } from '@/core/hooks/useBridgeSDK';

export function useSelection() {
  const { chainId } = useCurrentWallet();

  const bridgeSDK = useBridgeSDK();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const dispatch = useAppDispatch();

  const { getSortedTokens } = useSortedTokens();

  const updateSelectedInfo = (params: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) => {
    const newFromChain = bridgeSDK.getFromChainDetail(params);
    const newToChain = bridgeSDK.getToChainDetail(params);
    const newToken = bridgeSDK.getTokenDetail(params);
    const newToToken = bridgeSDK.getToTokenDetail(params);

    dispatch(setFromChain(newFromChain));
    dispatch(setToChain(newToChain));
    dispatch(setSelectedToken(newToken));
    dispatch(setToToken(newToToken));
  };

  const selectDefault = async ({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) => {
    if (chainId) {
      const fromChains = bridgeSDK.getFromChains();
      const chain = fromChains.find((chain) => chain.id === chainId);
      if (chain) {
        selectFromChain(chain);
        return;
      }
      if (fromChain?.id) return;
    }

    updateSelectedInfo({
      fromChainId,
      toChainId,
      tokenAddress,
    });
  };

  const selectFromChain = async (newFromChain: IBridgeChain) => {
    // After selecting fromChain, if toChain becomes incompatible,
    // reselect the first compatible network in toChain list.
    const toChains = bridgeSDK.getToChains({
      fromChainId: newFromChain.id,
    });

    const newToChain =
      toChains.find((c) => c.isCompatible && c.id === toChain?.id) ??
      toChains.find((c) => c.isCompatible && c.chainType !== 'link');

    const sortedTokens = await getSortedTokens({
      chainType: newFromChain.chainType,
      fromChainId: newFromChain.id,
      tokens: bridgeSDK.getTokens({
        fromChainId: newFromChain.id,
        toChainId: newToChain!.id,
      }),
    });

    const newToken =
      sortedTokens.find(
        (t) =>
          t.isCompatible &&
          t.displaySymbol.toUpperCase() === selectedToken?.displaySymbol.toUpperCase(),
      ) ?? sortedTokens.find((t) => t.isCompatible);

    updateSelectedInfo({
      tokenAddress: newToken!.address,
      fromChainId: newFromChain.id,
      toChainId: newToChain!.id,
    });
  };

  const selectToChain = async (newToChain: IBridgeChain) => {
    const fromChainId = fromChain!.id;
    const toChainId = newToChain.id;

    const sortedTokens = await getSortedTokens({
      fromChainId,
      tokens: bridgeSDK.getTokens({
        fromChainId,
        toChainId,
      }),
    });

    const newToken =
      sortedTokens.find(
        (t) =>
          t.isCompatible &&
          t.displaySymbol.toUpperCase() === selectedToken?.displaySymbol.toUpperCase(),
      ) ?? sortedTokens.find((t) => t.isCompatible);

    updateSelectedInfo({
      tokenAddress: newToken!.address,
      fromChainId,
      toChainId,
    });
  };

  const selectToken = async (newToken: IBridgeToken) => {
    updateSelectedInfo({
      tokenAddress: newToken.address,
      fromChainId: fromChain!.id,
      toChainId: toChain!.id,
    });
  };

  return {
    selectDefault,
    selectFromChain,
    selectToChain,
    selectToken,
  };
}

function useSortedTokens() {
  const { transferConfig } = useAggregator();
  const chains = useChains();

  const { address, walletType } = useCurrentWallet();
  const { getTokenPrice } = useTokenPrice();
  const tronWeb = useTronWeb();
  const { connection } = useConnection();

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
        walletType,
        chainType,
        account: address,
        tokens,
        chain: chains.find((e) => e.id === fromChainId),
        tronWeb,
        connection,
      });

      const tmpTokens = tokens.map((item) => {
        const balance = balances[item.displaySymbol];
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
    [walletType, address, chains, tronWeb, connection, transferConfig.order?.tokens, getTokenPrice],
  );

  return {
    getSortedTokens,
  };
}
