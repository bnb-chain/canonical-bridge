import { Flex, theme, useColorMode, useIntl } from '@bnb-chain/space';

import { IconImage } from '@/core/components/IconImage';
import { useCurrentWallet } from '@/modules/wallet/hooks/useCurrentWallet';
import { env } from '@/core/configs/env';
import { useAppSelector } from '@/core/store/hooks';

export function HeaderNetworkStatus() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { colorMode } = useColorMode();
  const { chain } = useCurrentWallet();
  const { formatMessage } = useIntl();

  if (!chain) {
    return null;
  }

  const isWrongNetwork = fromChain && fromChain.id !== chain.id;
  const iconUrl = `${env.ASSET_PREFIX}/images/chains/${chain.id}.png`;

  const props = isWrongNetwork
    ? {
        border: '1px',
        borderColor: theme.colors[colorMode].support.warning[3],
        boxShadow: `0 0 0 1px ${theme.colors[colorMode].support.warning[3]}`,
        // cursor: 'pointer',
        // _hover: {
        //   background: theme.colors[colorMode].layer['3'].hover,
        // },
      }
    : {
        border: '1px',
        borderColor: theme.colors[colorMode].border[3],
      };

  return (
    <Flex
      h="40px"
      pl={theme.sizes['2']}
      pr={theme.sizes['4']}
      borderRadius="20px"
      gap={theme.sizes['2']}
      alignItems="center"
      minWidth="130px"
      lineHeight={theme.sizes['4']}
      {...props}
    >
      <IconImage src={iconUrl} boxSize={theme.sizes['6']} />
      <Flex flexDir="column">
        <Flex fontWeight={500} fontSize={theme.sizes['3.5']}>
          {chain.name}
        </Flex>
        {isWrongNetwork && (
          <Flex fontSize={theme.sizes['3']} color={theme.colors[colorMode].support.warning[3]}>
            {formatMessage({ id: 'header.network-status.wrong' })}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
