import { BaseWallet, useConnectModal, useWalletKit } from '@node-real/walletkit';
import { Center, Flex, theme } from '@bnb-chain/space';
import { useEffect, useMemo } from 'react';

import { NetworkIcon } from '@/core/components/icons/NetworkIcon';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useWalletModal() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { isOpen, onClose, onOpen } = useConnectModal();
  useUpdateWallets();

  return {
    isOpen,
    onClose,
    onOpen() {
      onOpen({
        initialChainId: fromChain?.id,
      });
    },
  };
}

export function useUpdateWallets() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { evmConfig, tronConfig, setWallets } = useWalletKit();

  const wallets = useMemo(() => {
    const wallets: BaseWallet[] = [];
    if (evmConfig?.wallets) {
      wallets.push(...evmConfig.wallets);
    }
    if (tronConfig?.wallets) {
      wallets.push(...tronConfig?.wallets);
    }
    return wallets;
  }, [evmConfig?.wallets, tronConfig?.wallets]);

  useEffect(() => {
    const availableWalletIds: string[] = [];
    const chainType = fromChain?.chainType ?? 'evm';

    const nextWallets: BaseWallet[] = [];
    wallets.forEach((item) => {
      const count = wallets.filter((e) => e.name === item.name).length;

      nextWallets.push({
        ...item,
        isVisible: count === 1 || (count > 1 && item.walletType === chainType),
        render: ({ wallet, onClick }) => {
          const isAvailable = availableWalletIds.includes(wallet.id as any);

          return (
            <Flex className="wk-wallet-option" onClick={onClick}>
              <Flex flexDir="column">
                <Flex>{wallet.name}</Flex>
                {!isAvailable && (
                  <Flex
                    color={theme.colors.light.support.warning[3]}
                    fontSize={theme.sizes['3.5']}
                    lineHeight={theme.sizes['4']}
                    fontWeight={400}
                    gap={theme.sizes['1']}
                    textAlign="left"
                  >
                    <NetworkIcon boxSize={theme.sizes['4']} />
                    Incompatible with current network
                  </Flex>
                )}
              </Flex>
              <Center flexShrink={0} boxSize="52px">
                {wallet.logo}
              </Center>
            </Flex>
          );
        },
      });
    });

    nextWallets.sort((a, b) => {
      const aId = a.id as any;
      const bId = b.id as any;

      const aIndex = wallets.findIndex((id) => id === aId);
      const bIndex = wallets.findIndex((id) => id === bId);

      const isA = availableWalletIds.includes(aId);
      const isB = availableWalletIds.includes(bId);

      if (isA && !isB) return -1;
      if (!isA && isB) return 1;
      if ((isA && isB) || (!isA && !isB)) return aIndex - bIndex;

      return 0;
    });

    setWallets(nextWallets);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromChain]);
}
