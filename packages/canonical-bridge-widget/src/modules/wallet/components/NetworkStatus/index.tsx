import { Flex, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { useAccount } from 'wagmi';

import { IconImage } from '@/core/components/IconImage';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useBridgeConfig } from '@/CanonicalBridgeProvider';

export function HeaderNetworkStatus() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const { assetsPrefix } = useBridgeConfig();

  const { colorMode } = useColorMode();
  const { chain } = useAccount();
  const { formatMessage } = useIntl();

  if (!chain) {
    return null;
  }

  const isWrongNetwork = fromChain && fromChain.id !== chain.id;
  const iconUrl = `${assetsPrefix}/images/chains/${chain.id}.png`;

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
      pl={'8px'}
      pr={'16px'}
      borderRadius="20px"
      gap={'8px'}
      alignItems="center"
      minWidth="130px"
      lineHeight={'16px'}
      {...props}
    >
      <IconImage src={iconUrl} boxSize={'24px'} />
      <Flex flexDir="column">
        <Flex fontWeight={500} fontSize={'14px'}>
          {chain.name}
        </Flex>
        {isWrongNetwork && (
          <Flex fontSize={'12px'} color={theme.colors[colorMode].support.warning[3]}>
            {formatMessage({ id: 'header.network-status.wrong' })}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
