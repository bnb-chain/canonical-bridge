import { Flex, formatAddress, theme, Typography, useColorMode, useIntl } from '@bnb-chain/space';

import { ExLinkIcon } from '@/core/components/icons/ExLinkIcon';
import { useTokenUrl } from '@/modules/bridges/main';

export const ExternalAddress = ({
  address,
  chain_id,
}: {
  address: `0x${string}` | string;
  chain_id: number;
}) => {
  const { colorMode } = useColorMode();
  const tokenUrl = useTokenUrl(chain_id, address);

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
          {formatAddress({ value: address?.toLowerCase() })}
        </Typography>
        {tokenUrl && <ExLinkIcon w={theme.sizes['4']} h={theme.sizes['4']} />}
      </Flex>
    </Flex>
  );
};
