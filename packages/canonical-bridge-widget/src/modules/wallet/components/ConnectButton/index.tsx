import { Button, Flex, useTheme, useColorMode, useIntl, FlexProps } from '@bnb-chain/space';

// import { useDelay } from '@/core/hooks/useDelay';
import { NetworkList, NetworkListProps, Profile, ProfileProps, useBridgeConfig } from '@/index';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useIsWalletCompatible } from '@/modules/wallet/hooks/useIsWalletCompatible';

export interface ConnectButtonProps extends FlexProps {
  walletIcons?: ProfileProps['walletIcons'];
  onClickNetwork?: NetworkListProps['onClickNetwork'];
}

export function ConnectButton(props: ConnectButtonProps) {
  const { walletIcons, onClickNetwork, ...restProps } = props;

  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { onClickConnectWallet } = useBridgeConfig();

  const isReady = true; //useDelay();
  const isWalletCompatible = useIsWalletCompatible();
  const isConnected = isReady && isWalletCompatible;

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
            onClickConnectWallet({
              chainType: fromChain!.chainType,
              chainId: fromChain!.id,
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
          <NetworkList onClickNetwork={onClickNetwork} />
          <Profile walletIcons={walletIcons} />
        </>
      )}
    </Flex>
  );
}
