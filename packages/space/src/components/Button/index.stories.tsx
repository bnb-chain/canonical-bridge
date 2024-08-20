import { BNBChainIcon, CaretDownIcon } from '@bnb-chain/icons';
import { ButtonProps, Flex, FlexProps, StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { COLOR_SCHEMES } from '../../modules/theme/components/button';
import { IconButton } from '../IconButton';
import { Space } from '..';

import { Button, ButtonRightAddon } from '.';

const BUTTON_VARIANTS = ['solid', 'subtle', 'ghost', 'outline', 'text'] as const;
const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const BUTTON_COLOR_SCHEMES = COLOR_SCHEMES;

export default {
  title: 'Components/Atoms/Button',
  component: Button,
} as Meta;

const Stack = (props: StackProps) => {
  return (
    <VStack
      alignItems="start"
      w="min-content"
      spacing={theme.sizes['8']}
      sx={{
        button: {
          w: 'min-content',
        },
      }}
      {...props}
    />
  );
};

const ColorSchemeGrid = (props: FlexProps) => {
  return (
    <Flex
      alignItems="center"
      sx={{
        button: {
          _notLast: {
            mr: theme.sizes['8'],
          },
        },
      }}
      {...props}
    />
  );
};

export const Default = (props: ButtonProps) => {
  return (
    <Stack>
      {BUTTON_COLOR_SCHEMES.map((colorScheme) => {
        return (
          <ColorSchemeGrid key={colorScheme}>
            {BUTTON_VARIANTS.map((it) => {
              return (
                <Button key={it} colorScheme={colorScheme} variant={it} {...props}>
                  {it}
                </Button>
              );
            })}
          </ColorSchemeGrid>
        );
      })}
    </Stack>
  );
};

export const Sizes = (props: ButtonProps) => {
  return (
    <Stack>
      {BUTTON_SIZES.map((it) => {
        return (
          <Button key={it} size={it} {...props}>
            {it}
          </Button>
        );
      })}
    </Stack>
  );
};

export const Disabled = () => {
  return <Sizes isDisabled />;
};

export const Loading = () => {
  return (
    <>
      <Default isLoading />
      <Space size={theme.sizes['8']} />
      <Sizes isLoading />
    </>
  );
};

export const Icon = () => {
  return (
    <Stack>
      {BUTTON_COLOR_SCHEMES.map((colorScheme) => {
        return (
          <ColorSchemeGrid key={colorScheme}>
            {BUTTON_VARIANTS.map((it) => {
              return (
                <IconButton
                  key={it}
                  colorScheme={colorScheme}
                  variant={it}
                  icon={<BNBChainIcon />}
                  aria-label="BNB Chain"
                />
              );
            })}
          </ColorSchemeGrid>
        );
      })}
      {BUTTON_SIZES.map((it) => {
        return (
          <IconButton key={it} size={it} icon={<BNBChainIcon />} aria-label="BNB Chain">
            {it}
          </IconButton>
        );
      })}
    </Stack>
  );
};

export const WithLeftIcon = () => {
  return (
    <Stack>
      {BUTTON_COLOR_SCHEMES.map((colorScheme) => {
        return (
          <ColorSchemeGrid key={colorScheme}>
            {BUTTON_VARIANTS.map((it) => {
              return (
                <Button key={it} colorScheme={colorScheme} variant={it} leftIcon={<BNBChainIcon />}>
                  Button
                </Button>
              );
            })}
          </ColorSchemeGrid>
        );
      })}
      {BUTTON_SIZES.map((it) => {
        return (
          <Button key={it} size={it} leftIcon={<BNBChainIcon />}>
            {it}
          </Button>
        );
      })}
    </Stack>
  );
};

export const WithRightAddon = () => {
  return (
    <Stack>
      {BUTTON_COLOR_SCHEMES.map((colorScheme) => {
        return (
          <ColorSchemeGrid key={colorScheme}>
            {BUTTON_VARIANTS.map((it) => {
              return (
                <Button key={it} colorScheme={colorScheme} variant={it}>
                  Button
                  <ButtonRightAddon colorScheme={colorScheme} variant={it}>
                    <CaretDownIcon fontSize={theme.sizes['6']} />
                  </ButtonRightAddon>
                </Button>
              );
            })}
          </ColorSchemeGrid>
        );
      })}
      {BUTTON_SIZES.map((it) => {
        return (
          <Button key={it} size={it}>
            {it}
            <ButtonRightAddon size={it}>
              <CaretDownIcon fontSize={theme.sizes['6']} />
            </ButtonRightAddon>
          </Button>
        );
      })}
    </Stack>
  );
};
