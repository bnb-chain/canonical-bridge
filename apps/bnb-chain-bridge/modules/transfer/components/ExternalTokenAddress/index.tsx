import { Flex, theme, Typography, useColorMode, useIntl } from '@bnb-chain/space';

import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { formatAppAddress } from '@/core/utils/address';

export const ExternalAddress = ({
  address,
  tokenUrl,
}: {
  address: `0x${string}` | string;
  tokenUrl?: string;
}) => {
  const { colorMode } = useColorMode();
  const { formatMessage } = useIntl();

  return (
    <Flex
      gap={theme.sizes['1']}
      alignItems={'center'}
      color={theme.colors[colorMode].text.placeholder}
    >
      <Typography variant="body" size={'sm'} flexDir={'row'}>
        {formatMessage({ id: 'main.address.link.text' })}
      </Typography>
      <Flex
        gap={theme.sizes['1']}
        alignItems={'center'}
        color={theme.colors[colorMode].text.placeholder}
        cursor={'pointer'}
        _hover={{
          color: theme.colors[colorMode].text.primary,
          textDecoration: 'underline',
        }}
        onClick={() => {
          if (tokenUrl) {
            window.open(tokenUrl, '_blank');
          }
        }}
      >
        <Typography variant="body" size={'sm'} flexDir={'row'} fontWeight={500}>
          {formatAppAddress({ address, transform: 'lowerCase' })}
        </Typography>
        {tokenUrl && <ExLinkIcon w={theme.sizes['4']} h={theme.sizes['4']} />}
      </Flex>
    </Flex>
  );
};
