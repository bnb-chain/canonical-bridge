import { BNBChainIcon } from '@bnb-chain/icons';
import { HStack, StackProps, Tag, TagLabel, TagLeftIcon, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { COLOR_SCHEMES } from '../../modules/theme/components/badge';

import { TagLeftBullet } from './TagLeftBullet';

const TAG_VARIANTS = ['solid', 'outline', 'subtle', 'grayscale'] as const;
const TAG_SIZES = ['sm', 'md', 'lg'] as const;
const TAG_COLOR_SCHEMES = COLOR_SCHEMES;

export default {
  title: 'Components/Atoms/Tag',
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" w="min-content" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  return (
    <Stack>
      {TAG_COLOR_SCHEMES.map((colorScheme) => {
        return (
          <HStack key={colorScheme}>
            {TAG_VARIANTS.map((it) => {
              return (
                <Tag key={it} colorScheme={colorScheme} variant={it}>
                  {it}
                </Tag>
              );
            })}
          </HStack>
        );
      })}
    </Stack>
  );
};

export const Sizes = () => {
  return (
    <Stack>
      {TAG_SIZES.map((it) => {
        return (
          <Tag key={it} size={it}>
            {it}
          </Tag>
        );
      })}
    </Stack>
  );
};

export const WithLeftBullet = () => {
  return (
    <Stack>
      {TAG_COLOR_SCHEMES.map((colorScheme) => {
        return (
          <HStack key={colorScheme}>
            {TAG_VARIANTS.map((it) => {
              return (
                <Tag key={it} colorScheme={colorScheme} variant={it}>
                  <TagLeftBullet />
                  {it}
                </Tag>
              );
            })}
          </HStack>
        );
      })}
    </Stack>
  );
};

export const WithLeftIcon = () => {
  return (
    <Stack>
      {TAG_COLOR_SCHEMES.map((colorScheme) => {
        return (
          <HStack key={colorScheme}>
            {TAG_VARIANTS.map((it) => {
              return (
                <Tag key={it} colorScheme={colorScheme} variant={it}>
                  <TagLeftIcon as={BNBChainIcon} />
                  <TagLabel>Tag</TagLabel>
                </Tag>
              );
            })}
          </HStack>
        );
      })}
      {TAG_SIZES.map((it) => {
        return (
          <Tag key={it} size={it}>
            <TagLeftIcon as={BNBChainIcon} />
            <TagLabel>{it}</TagLabel>
          </Tag>
        );
      })}
    </Stack>
  );
};
