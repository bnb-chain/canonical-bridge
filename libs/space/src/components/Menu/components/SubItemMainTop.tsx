import { BNBChainIcon, ArrowRightIcon } from '@bnb-chain/icons';
import { Box, Flex, useColorMode, Link } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';
import { Typography } from '../../Typography';

type Props = {
  title: string;
  analyticsId: string;
  link: {
    name: string;
    href: string;
  };
  onMouseEnter?: () => void;
};

export const SubItemMainTop = (data: Props) => {
  const { title, link, analyticsId, onMouseEnter } = data;
  const { colorMode } = useColorMode();

  return (
    <Flex
      mx={{ base: 0, lg: theme.sizes['6'] }}
      mb={theme.sizes['2']}
      pt={theme.sizes['2']}
      pb={theme.sizes['4']}
      borderBottom={`1px solid ${theme.colors[colorMode].border['3']}`}
      cursor={'pointer'}
      justifyContent={'space-between'}
      _hover={{
        '.accordion__level3-item-link': {
          textDecoration: 'underline',
        },
      }}
      onMouseEnter={onMouseEnter}
      alignItems={'center'}
      as={'a'}
      href={link.href}
      target={'_self'}
      data-analytics-id={analyticsId}
    >
      <Flex>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          mr={theme.sizes['3']}
          alignSelf={'flex-start'}
        >
          <BNBChainIcon
            fontSize={theme.sizes['6']}
            color={theme.colors[colorMode].primitives.logo}
          />
        </Box>
        <Box mr={theme.sizes['4']}>
          <Typography
            variant="body"
            size={'lg'}
            fontWeight={'700'}
            color={theme.colors[colorMode].text.primary}
            mb={theme.sizes['1']}
          >
            {title}
          </Typography>
          <Link
            as="div"
            fontSize={theme.sizes['3.5']}
            lineHeight={theme.sizes['4']}
            className={'accordion__level3-item-link'}
            color={theme.colors[colorMode].button.brand.default}
            minW={'unset'}
            width={'fit-content'}
            textAlign={'left'}
            padding={0}
            fontWeight={'500'}
            textDecoration="none"
          >
            {link.name}
          </Link>
        </Box>
      </Flex>
      <ArrowRightIcon fontSize={theme.sizes['6']} color={theme.colors[colorMode].text.brand} />
    </Flex>
  );
};
