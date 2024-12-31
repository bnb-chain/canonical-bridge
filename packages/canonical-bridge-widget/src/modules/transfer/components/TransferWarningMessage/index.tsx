import { Flex, theme, useColorMode } from '@bnb-chain/space';
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
        {`At least ${MIN_SOL_TO_ENABLED_TX} SOL is required to proceed with this transaction.`}
      </Flex>
    );
  }
  return null;
};
