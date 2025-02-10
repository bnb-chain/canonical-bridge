import { useAccount, useChains } from 'wagmi';
import { useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import {
  ChainType,
  IBridgeToken,
  IBridgeTokenWithBalance,
  isSameAddress,
} from '@bnb-chain/canonical-bridge-sdk';

import { useAggregator } from '@/modules/aggregator/providers/AggregatorProvider';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { getTokenBalances } from '@/modules/aggregator/shared/getTokenBalances';
import { sortTokens } from '@/modules/aggregator/shared/sortTokens';
import { useTronWeb } from '@/core/hooks/useTronWeb';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { useTokenPrice } from '@/modules/aggregator/providers/TokenPricesProvider';
import { useBridgeConfig } from '@/index';
import {
  setFromChain,
  setSelectedToken,
  setSendValue,
  setToAccount,
  setToChain,
  setToToken,
  setToTokens,
} from '@/modules/transfer/action';

export function useSelection() {
  const aggregator = useAggregator();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const dispatch = useAppDispatch();

  const updateSelectedInfo = (params: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
    toTokenAddress?: string;
  }) => {
    if (!aggregator) return;

    const options = {
      fromChainId: params.fromChainId,
      toChainId: params.toChainId,
      tokenAddress: params.tokenAddress,
    };

    const newFromChain = aggregator.getFromChainDetail(options);
    const newToChain = aggregator.getToChainDetail(options);
    const newToken = aggregator.getTokenDetail(options);

    dispatch(setFromChain(newFromChain));
    dispatch(setToChain(newToChain));
    dispatch(setSelectedToken(newToken));

    const updateToTokenInfo = (toTokenAddress: string) => {
      const newToToken = aggregator.getToTokenDetail({
        fromChainId: params.fromChainId,
        toChainId: params.toChainId,
        fromTokenAddress: params.tokenAddress,
        toTokenAddress,
      });
      dispatch(setToToken(newToToken));
    };

    if (params.toTokenAddress) {
      updateToTokenInfo(params.toTokenAddress);
    } else {
      const toTokens = aggregator.getToTokens(options);
      if (toTokens.length > 1) {
        // eslint-disable-next-line no-console
        console.log('[aggregator]', `has multiple toTokens (${toTokens.length})`);
        dispatch(setToTokens(toTokens));
        dispatch(setToToken(undefined));
      } else {
        dispatch(setToTokens([]));
        dispatch(setToToken(undefined));
      }

      if (toTokens.length === 1) {
        updateToTokenInfo(toTokens[0].address);
      } else {
        dispatch(setToToken(undefined));
      }
    }
  };

  const selectDefault = async (params: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) => {
    if (!aggregator) return;

    const { fromChainId, toChainId, tokenAddress } = params;

    const fromChains = aggregator.getFromChains();
    const toChains = aggregator.getToChains({ fromChainId });
    const tokens = aggregator.getTokens({
      fromChainId,
      toChainId,
    });

    const newFromChain = fromChains.find((e) => e.id === fromChainId);
    const newToChain = toChains.find((e) => e.id === toChainId);
    const token = tokens.find((e) => isSameAddress(e.address, tokenAddress));

    if (!newFromChain) {
      if (fromChains?.[0]?.id) {
        selectFromChain(fromChains?.[0].id);
      }
      return;
    }

    if (!newToChain || !token) {
      selectFromChain(fromChainId);
      return;
    }

    updateSelectedInfo({
      fromChainId,
      toChainId,
      tokenAddress,
    });
  };

  const selectFromChain = async (fromChainId: number) => {
    if (!aggregator) return;

    const fromChains = aggregator.getFromChains();
    const newFromChain = fromChains.find((e) => e.id === fromChainId)!;

    const toChains = aggregator.getToChains({ fromChainId });
    const newToChain =
      toChains.find((e) => e.isCompatible && e.id === toChain?.id) ??
      toChains.find((e) => e.isCompatible && e.chainType !== 'link');

    const sortedTokens = await getSortedTokens({
      chainType: newFromChain.chainType,
      fromChainId: newFromChain.id,
      tokens: aggregator.getTokens({
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
      fromChainId,
      toChainId: newToChain!.id,
      tokenAddress: newToken!.address,
    });
  };

  const selectToChain = async (toChainId: number) => {
    if (!aggregator) return;

    const fromChainId = fromChain!.id;

    const sortedTokens = await getSortedTokens({
      fromChainId,
      tokens: aggregator.getTokens({
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

  const selectToken = async (tokenAddress: string) => {
    if (!aggregator) return;

    const fromChainId = fromChain!.id;
    const toChainId = toChain!.id;

    updateSelectedInfo({
      tokenAddress,
      fromChainId,
      toChainId,
    });
  };

  const selectToToken = async (toTokenAddress: string) => {
    if (!aggregator) return;

    const fromChainId = fromChain!.id;
    const toChainId = toChain!.id;
    const tokenAddress = selectedToken!.address;

    updateSelectedInfo({
      fromChainId,
      toChainId,
      tokenAddress,
      toTokenAddress,
    });
  };

  const exchange = async () => {
    if (!aggregator) return;

    dispatch(setSendValue(''));
    dispatch(setToAccount({ address: '' }));

    const fromChainId = toChain!.id;
    const toChainId = fromChain!.id;

    const fromChains = aggregator.getFromChains();
    const newFromChain = fromChains.find((e) => e.id === fromChainId);
    if (!newFromChain) {
      if (fromChains?.[0].id) {
        selectFromChain(fromChains?.[0].id);
      }
      return;
    }

    const toChains = aggregator.getFromChains();
    const newToChain = toChains.find((e) => e.id === toChainId);
    if (!newToChain) {
      selectFromChain(fromChainId);
      return;
    }

    const sortedTokens = await getSortedTokens({
      fromChainId,
      tokens: aggregator.getTokens({
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

    if (!newToken) {
      selectFromChain(fromChainId);
      return;
    }

    updateSelectedInfo({
      fromChainId,
      toChainId,
      tokenAddress: newToken.address,
    });
  };

  const { getSortedTokens } = useSortedTokens();

  return {
    selectDefault,
    selectFromChain,
    selectToChain,
    selectToken,
    selectToToken,
    exchange,
  };
}

function useSortedTokens() {
  const bridgeConfig = useBridgeConfig();

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
        chainConfig: bridgeConfig.transfer.chainConfigs?.find((item) => item.id === fromChainId),
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
        const price = getTokenPrice({
          chainId: fromChainId,
          chainType,
          tokenAddress: item?.address,
          tokenSymbol: item?.symbol,
        });

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
      });
    },
    [
      bridgeConfig.transfer.chainConfigs,
      address,
      chains,
      solanaAddress,
      connection,
      tronAddress,
      tronWeb,
      getTokenPrice,
    ],
  );

  return {
    getSortedTokens,
  };
}
