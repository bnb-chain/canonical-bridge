import { ArrowTopRightIcon } from '@bnb-chain/icons';
import {
  Box,
  ComponentWithAs,
  Flex,
  FlexProps,
  forwardRef,
  Image,
  useColorMode,
} from '@chakra-ui/react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { theme } from '../../../modules/theme';
import { CLASS_NAMES } from '../../constants';
import { Space } from '../../Space';
import { Typography } from '../../Typography';

type Nullable<T> = T | null;

type Props = Omit<FlexProps, 'children'> & {
  // Copy Ghost's props.
  data: {
    title?: string | undefined;
    slug: string;
    feature_image?: Nullable<string> | undefined;
    published_at?: Nullable<string> | undefined;
    reading_time?: number | undefined;
  };
};

export const BlogCard: ComponentWithAs<'div', Props> = forwardRef<Props, 'div'>(
  ({ data, ...otherProps }, ref) => {
    const { colorMode } = useColorMode();

    return (
      <Flex
        ref={ref}
        as="a"
        href={`https://www.bnbchain.org/en/blog/${data.slug}`}
        target="_blank"
        flexDirection={{ base: 'column', md: 'row' }}
        py={{ base: theme.sizes['10'], md: theme.sizes['10'], lg: theme.sizes['12'] }}
        borderY={`1px solid ${theme.colors[colorMode].border[3]}`}
        transitionProperty="border-color"
        transitionDelay={theme.transition.duration['ultra-fast']}
        transitionTimingFunction="ease-in"
        _hover={{
          cursor: 'pointer',
          borderY: `1px solid ${theme.colors[colorMode].border.brand}`,
          zIndex: 1,
          [`.${CLASS_NAMES.ICON}`]: {
            transform: 'rotate(45deg)',
          },
          img: {
            transform: 'scale(1.05)',
          },
        }}
        sx={{
          ':not(:first-of-type)': {
            mt: '-1px',
          },
        }}
        {...otherProps}
      >
        <Box
          w={{ base: '100%', md: '212px', lg: '284px' }}
          borderRadius={theme.sizes['2']}
          overflow="hidden"
        >
          <Image
            src={data.feature_image as string}
            alt={data.title}
            transitionProperty="transform"
            transitionDuration={theme.transition.duration['ultra-slow']}
            transitionTimingFunction="ease-out"
          />
        </Box>
        <Space size={{ base: theme.sizes['6'], md: theme.sizes['10'], lg: theme.sizes['20'] }} />
        <Flex flexDirection="column" justifyContent="center" flexShrink={0} flex={1}>
          <Flex justifyContent="space-between" w="100%">
            <Typography
              variant="heading"
              size={{ base: 'xs', md: 'sm' }}
              fontWeight="500"
              color={theme.colors[colorMode].text.primary}
              noOfLines={2}
            >
              {data.title}
            </Typography>
            <ArrowTopRightIcon
              fontSize={theme.sizes['8']}
              color={theme.colors[colorMode].text.primary}
              ml={theme.sizes['4']}
              transitionProperty="transform"
              transitionDuration={theme.transition.duration['ultra-slow']}
              transitionTimingFunction="ease"
            />
          </Flex>
          <Space size={theme.sizes['5']} />
          <Typography
            variant="label"
            size={{ base: 'md', md: 'lg' }}
            color={theme.colors[colorMode].text.secondary}
          >
            <FormattedDate value={data.published_at as string} day="2-digit" month="short" />
            &nbsp;·&nbsp;
            <FormattedMessage
              id="component.blog-card.reading-time"
              values={{ value: data.reading_time || 3 }}
            />
          </Typography>
        </Flex>
      </Flex>
    );
  },
);
