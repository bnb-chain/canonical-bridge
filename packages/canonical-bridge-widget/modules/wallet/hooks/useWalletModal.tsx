import { BaseWallet, useConnectModal, useWallets } from '@node-real/walletkit';
import { Center, Flex, theme } from '@bnb-chain/space';
import { useEffect, useRef } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { NetworkIcon } from '@/core/components/icons/NetworkIcon';

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
  const { wallets, setWallets } = useWallets();

  const originalWalletsRef = useRef<BaseWallet[]>(wallets);
  useEffect(() => {
    if (!originalWalletsRef.current && wallets.length) {
      originalWalletsRef.current = wallets;
    }

    const originalWalletIds = originalWalletsRef.current.map((item) => item.id);
    const availableWalletIds = fromChain?.supportedWallets ?? originalWalletIds;
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
                    fontSize={'14px'}
                    lineHeight={'16px'}
                    fontWeight={400}
                    gap={'4px'}
                    textAlign="left"
                  >
                    <NetworkIcon boxSize={'16px'} />
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

      const aIndex = originalWalletIds.findIndex((id) => id === aId);
      const bIndex = originalWalletIds.findIndex((id) => id === bId);

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
