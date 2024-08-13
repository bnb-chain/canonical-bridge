import { Box, Button, Flex, FlexProps, Image, useColorMode } from '@chakra-ui/react';

import { theme } from '../../../modules/theme';
import { Typography } from '../../Typography';
import { useMedia } from '../../../hooks/useMedia';

type Props = FlexProps & {
  title: string;
  description: string;
  analyticsId: string;
  link: {
    name: string;
    href: string;
  };
  videoSrc?: string;
  id?: string;
  image?: {
    src: string;
    alt: string;
  };
  onMouseEnter?: () => void;
};

export const SubItemMainTopWithImage = ({
  title,
  link,
  analyticsId,
  description,
  image,
  onMouseEnter,
  ...otherProps
}: Props) => {
  const { colorMode } = useColorMode();
  const { isPc } = useMedia();

  return (
    <Flex
      pl={theme.sizes['6']}
      justifyContent={'space-between'}
      data-analytics-id={analyticsId}
      cursor={'pointer'}
      _hover={{
        '.accordion__level3-item-link': {
          textDecoration: 'underline',
        },
      }}
      onMouseEnter={onMouseEnter}
      {...otherProps}
    >
      <Flex flexDir={'column'} flex={'1'} py={theme.sizes['4']}>
        {isPc ? (
          <Typography
            variant="body"
            size={'lg'}
            fontWeight={'700'}
            marginBottom={theme.sizes['1']}
            color={theme.colors[colorMode].button.primary.default}
          >
            {title}
          </Typography>
        ) : (
          <Typography
            variant="heading"
            size={'sm'}
            fontWeight={'700'}
            marginBottom={theme.sizes['1']}
            color={theme.colors[colorMode].button.primary.default}
          >
            {title}
          </Typography>
        )}
        <Typography
          variant="label"
          size={'sm'}
          marginBottom={theme.sizes['3']}
          color={theme.colors[colorMode].text.tertiary}
        >
          {description}
        </Typography>
        <Button
          as={'a'}
          variant={'link'}
          color={theme.colors[colorMode].background.brand}
          minW={'unset'}
          width={'fit-content'}
          textAlign={'left'}
          className={'accordion__level3-item-link'}
          fontSize={theme.sizes['3.5']}
          lineHeight={theme.sizes['4']}
          href={link.href}
          target={'_self'}
          padding={0}
        >
          {link.name}
        </Button>
      </Flex>
      {!!image && (
        <Box
          width={{ base: '100px', md: '164px', lg: '108px' }}
          height={{ base: '100px', md: '164px', lg: '108px' }}
          marginX={{ base: 'auto', md: 'auto', lg: 'unset' }}
        >
          <Image src={image.src} alt={image.alt} loading={'lazy'} />
        </Box>
      )}
    </Flex>
  );
};
