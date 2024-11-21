import { BaseWallet, useConnectModal, useWalletKit } from '@node-real/walletkit';
import { Center, Flex, theme } from '@bnb-chain/space';
import { ChainType } from '@bnb-chain/canonical-bridge-widget';

import { NetworkIcon } from '@/core/components/icons/NetworkIcon';

export function useWalletModal() {
  const { isOpen, onClose, onOpen } = useConnectModal();
  const { evmConfig, tronConfig, solanaConfig, setWallets } = useWalletKit();

  return {
    isOpen,
    onClose,
    onOpen({
      chainType = 'evm',
      chainId,
      onConnected,
    }: {
      chainType: ChainType;
      chainId: number;
      onConnected?: (params: { walletType?: ChainType; chainId?: number }) => void;
    }) {
      const wallets: BaseWallet[] = [];
      if (evmConfig?.wallets) wallets.push(...evmConfig.wallets);
      if (tronConfig?.wallets) wallets.push(...tronConfig?.wallets);
      if (solanaConfig?.wallets) wallets.push(...solanaConfig.wallets);

      const evmWalletIds = evmConfig?.wallets.map((e) => e.id) ?? [];
      const tronWalletIds = tronConfig?.wallets.map((e) => e.id) ?? [];
      const solanaWalletIds = solanaConfig?.wallets.map((e) => e.id) ?? [];

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
      setTimeout(() => {
        const onWalletConnected = ({ wallet }: { wallet: BaseWallet }) => {
          onConnected?.({ walletType: wallet.walletType });
        };

        if (chainType === 'evm') {
          onOpen({
            initialChainId: chainId,
            onConnected: onWalletConnected,
          });
        } else if (chainType === 'tron') {
          onOpen({
            onConnected: onWalletConnected,
            tronConfig: {
              initialChainId: chainId,
            },
          });
        } else {
          onOpen({
            onConnected: onWalletConnected,
          });
        }
      }, 100);
    },
  };
}
