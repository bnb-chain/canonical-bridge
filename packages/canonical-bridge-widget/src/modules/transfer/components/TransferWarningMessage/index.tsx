import { Flex, theme, useColorMode, useIntl } from '@bnb-chain/space';
import { rgba } from 'polished';

import { MIN_SOL_TO_ENABLED_TX } from '@/core/constants';
import { InfoIcon } from '@/core/components/icons/InfoIcon';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { useSolanaBalance } from '@/modules/wallet/hooks/useSolanaBalance';

export const TransferWarningMessage = () => {
  const { colorMode } = useColorMode();
  const { data } = useSolanaBalance();
  const solBalance = Number(data?.formatted);
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { formatMessage } = useIntl();

  if (fromChain?.chainType === 'solana' && solBalance < MIN_SOL_TO_ENABLED_TX) {
    return (
      <Flex
        mt={'12px'}
        px={'8px'}
        py={'4px'}
        gap={'8px'}
        borderRadius={'8px'}
        alignItems={'center'}
        bg={rgba(theme.colors[colorMode].support.warning[4], 0.24)}
        color={theme.colors[colorMode].support.warning[2]}
      >
        <InfoIcon
          iconColor={theme.colors[colorMode].text.warning}
          iconBgColor={theme.colors[colorMode].support.warning[4]}
          fontSize={'12px'}
          fontWeight={400}
        />
        {formatMessage({ id: 'transfer.warning.sol.balance' }, { min: MIN_SOL_TO_ENABLED_TX })}
      </Flex>
    );
  }
  return null;
};
