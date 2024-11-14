import { Button, Flex, useTheme, useColorMode, useIntl } from '@bnb-chain/space';

import { NetworkStatus } from '@/modules/wallet/components/NetworkStatus';
import { ProfileMenu } from '@/modules/wallet/components/ProfileMenu';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';
import { useAppSelector } from '@/modules/store/StoreProvider';

interface ConnectButtonProps {}

export function ConnectButton(props: ConnectButtonProps) {
  const { ...restProps } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  const { isConnected, linkWallet } = useCurrentWallet();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  return (
    <Flex
      className="bccb-widget-header-wallet-connect"
      alignItems="center"
      gap={'16px'}
      {...restProps}
    >
      {!isConnected && (
        <Button
          className="bccb-widget-header-wallet-connect-button"
          variant="outline"
          h={'40px'}
          px={'16px'}
          borderRadius={'8px'}
          fontSize="14px"
          lineHeight="16px"
          fontWeight={500}
          onClick={() => {
            linkWallet({
              targetChainType: fromChain?.chainType,
              targetChainId: fromChain?.id,
            });
          }}
          sx={{
            '@media (hover: none)': {
              _hover: {
                bg: 'transparent',
                color: theme.colors[colorMode].button.primary.default,
                borderColor: theme.colors[colorMode].button.primary.default,
              },
            },
          }}
        >
          {formatMessage({ id: 'wallet.button.connect-wallet' })}
        </Button>
      )}

      {isConnected && (
        <>
          <NetworkStatus />
          <ProfileMenu />
        </>
      )}
    </Flex>
  );
}
