import {
  Button,
  useColorMode,
  useIntl,
  useTheme,
  ButtonProps,
  useDisclosure,
} from '@bnb-chain/space';

import { reportEvent } from '@/core/utils/gtm';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useEvmSwitchChain } from '@/modules/wallet/hooks/useEvmSwitchChain';
import { useTronSwitchChain } from '@/modules/wallet/hooks/useTronSwitchChain';
import { SwitchingTipsModal } from '@/modules/wallet/components/SwitchingTipsModal';
import { isMobile } from '@/core/utils/mobile';

export const SwitchNetworkButton = (props: ButtonProps) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { switchChain: evmSwitchChain } = useEvmSwitchChain();
  const { switchChain: tronSwitchChain } = useTronSwitchChain();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const onSwitchNetwork = () => {
    if (fromChain?.chainType === 'evm') {
      evmSwitchChain({
        chainId: fromChain.id,
      });
    }
    if (fromChain?.chainType === 'tron') {
      if (isMobile()) {
        onOpen();
      } else {
        tronSwitchChain({
          chainId: fromChain.id,
        });
      }
    }
  };

  return (
    <>
      <Button
        className="bccb-widget-switch-network-button"
        size="lg"
        h={'56px'}
        w="100%"
        color={theme.colors[colorMode].button.wallet.text}
        background={theme.colors[colorMode].support.warning['3']}
        _hover={{
          background: theme.colors[colorMode].support.warning['2'],
        }}
        onClick={() => {
          onSwitchNetwork();
          reportEvent({
            id: 'click_bridge_goal',
            params: {
              item_name: 'Switch Network',
            },
          });
        }}
        {...props}
      >
        {formatMessage({ id: 'transfer.button.switch-network' })}
      </Button>

      <SwitchingTipsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
