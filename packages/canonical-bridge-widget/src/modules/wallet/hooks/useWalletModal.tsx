import { BaseWallet, useConnectModal, useWalletKit } from '@node-real/walletkit';
import { Center, Flex, theme } from '@bnb-chain/space';
import { useEffect, useMemo } from 'react';

import { NetworkIcon } from '@/core/components/icons/NetworkIcon';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useWalletModal() {
  const { isOpen, onClose, onOpen } = useConnectModal();
  useUpdateWallets();

  return {
    isOpen,
    onClose,
    onOpen,
  };
}

export function useUpdateWallets() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { evmConfig, tronConfig, solanaConfig, setWallets } = useWalletKit();

  const { evmWalletIds, tronWalletIds, solanaWalletIds, wallets } = useMemo(() => {
    const wallets: BaseWallet[] = [];
    if (evmConfig?.wallets) wallets.push(...evmConfig.wallets);
    if (tronConfig?.wallets) wallets.push(...tronConfig?.wallets);
    if (solanaConfig?.wallets) wallets.push(...solanaConfig.wallets);

    return {
      evmWalletIds: evmConfig?.wallets.map((e) => e.id) ?? [],
      tronWalletIds: tronConfig?.wallets.map((e) => e.id) ?? [],
      solanaWalletIds: solanaConfig?.wallets.map((e) => e.id) ?? [],
      wallets,
    };
  }, [evmConfig?.wallets, tronConfig?.wallets, solanaConfig?.wallets]);

  useEffect(() => {
    const chainType = fromChain?.chainType ?? 'evm';

    let availableWalletIds: string[];
    if (chainType === 'evm') availableWalletIds = [...evmWalletIds];
    if (chainType === 'tron') availableWalletIds = [...tronWalletIds];
    if (chainType === 'solana') availableWalletIds = [...solanaWalletIds];

    const newWallets: BaseWallet[] = [];
    wallets.forEach((item) => {
      const count = wallets.filter((e) => e.name === item.name).length;

      newWallets.push({
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
                    fontSize={'12px'}
                    lineHeight={'16px'}
                    fontWeight={500}
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

    newWallets.sort((a, b) => {
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

    setWallets(newWallets);
  }, [evmWalletIds, fromChain, setWallets, solanaWalletIds, tronWalletIds, wallets]);
}
