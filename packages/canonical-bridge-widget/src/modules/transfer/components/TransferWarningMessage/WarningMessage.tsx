import { Flex, useColorMode, useTheme } from '@bnb-chain/space';
import { rgba } from 'polished';

import { InfoIcon } from '@/core/components/icons/InfoIcon';

export const WarningMessage = ({ text, ...restProps }: { text: React.ReactNode }) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
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
      fontSize={'12px'}
      fontWeight={400}
      w={'100%'}
      {...restProps}
    >
      <InfoIcon
        transform={'rotate(180deg)'}
        w={'16px'}
        h={'16px'}
        iconcolor={theme.colors[colorMode].text.warning}
        iconbgcolor={theme.colors[colorMode].support.warning[4]}
      />
      {text}
    </Flex>
  );
};
