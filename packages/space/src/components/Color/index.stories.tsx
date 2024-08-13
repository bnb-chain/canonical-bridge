import { Box, Center, useColorMode } from '@chakra-ui/react';
import { Flex, FlexProps, Text, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';
import { Fragment } from 'react';

import { theme } from '../../modules/theme';
import { primitives } from '../../modules/theme/foundations/colors/primitives';
import { Space } from '../Space';

const spectrum = (value: Object) => {
  return Object.entries(value).filter(([_, v]) => typeof v !== 'string');
};

const single = (value: Object) => {
  return Object.entries(value).filter(([_, v]) => typeof v === 'string');
};

const getPaths = (value: any, path: Array<string>, result: Map<string, string>): any => {
  for (const [k, v] of Object.entries(value)) {
    if (typeof v === 'string') {
      result.set([...path, k].join('.'), v);
      continue;
    }

    getPaths(value[k], [...path, k], result);
  }
};

export default {
  title: 'Foundations/Color',
} as Meta;

const hexToRGB = (value: string) => {
  const bigint = parseInt(value.replace('#', '0x'), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};

const Card = ({
  label,
  hex,
  type,
}: { label: string; hex: string; type: 'hex' | 'path' } & FlexProps) => {
  const { r, g, b } = hexToRGB(hex);

  const map = new Map<string, string>();
  getPaths(primitives, [], map);

  return (
    <Flex
      flexDirection="column"
      alignItems="start"
      justifyContent="end"
      w="100%"
      h={theme.sizes['20']}
      p={theme.sizes['3']}
      overflow="hidden"
      sx={{
        '--red': r.toString(),
        '--green': g.toString(),
        '--blue': b.toString(),
        // Threshold between 0 to 1, recommended 0.5 - 0.6.
        '--threshold': '0.5',

        // Calculate perceived brightness using W3C luma method = (red * 0.299 + green * 0.587 + blue * 0.114) / 255
        // Can also do sRGB method = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255
        '--r': 'calc(var(--red) * 0.299)',
        '--g': 'calc(var(--green) * 0.587)',
        '--b': 'calc(var(--blue) * 0.114)',

        '--sum': 'calc(var(--r) + var(--g) + var(--b))',
        '--perceived-lightness': 'calc(var(--sum) / 255)',

        bg: 'rgb(var(--red), var(--green), var(--blue))',
        color: 'hsl(0, 0%, calc((var(--perceived-lightness) - var(--threshold)) * -10000000%))',
      }}
    >
      <Text
        fontSize={theme.fontSizes['2']}
        fontWeight="500"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
      >
        {label}
      </Text>
      <Text fontSize={theme.fontSizes['2']} fontWeight="300">
        {type === 'hex' && hex}
        {/* TODO: This doesn't work with new colour structure. */}
        {type === 'path' && map.get(hex)}
      </Text>
    </Flex>
  );
};

const Spectrum = ({ k, v, type }: { k: string; v: Object; type: 'hex' | 'path' }) => {
  return (
    <Flex flexDirection="column" w="100%">
      <Flex>
        {/* Handle black and white in foreground. */}
        {typeof v === 'string' ? (
          <Card label={k} hex={v} type={type} />
        ) : (
          Object.entries(v).map(([number, v]) => {
            return <Card key={`${k}.${number}`} label={`${k}.${number}`} hex={v} type={type} />;
          })
        )}
      </Flex>
    </Flex>
  );
};

export const Default = () => {
  const { colorMode } = useColorMode();

  const map = new Map<string, string>();
  getPaths(theme.colors[colorMode], [], map);

  let previous: string | null = null;

  const colors: React.ReactNode[] = [];
  for (const [k, v] of map.entries()) {
    const key = k.split('.')[0];

    if (previous && previous !== key) {
      colors.push(<Space size={theme.sizes['4']} />);
    }

    colors.push(
      <Flex alignItems="center">
        {k}
        <Box
          w={theme.sizes['4']}
          h={theme.sizes['4']}
          bg={v}
          ml={theme.sizes['2']}
          borderRadius="50%"
        ></Box>
      </Flex>,
    );

    previous = key;
  }

  return (
    <VStack alignItems="start">
      {colors.map((it, index) => {
        return <Fragment key={`color-${index}`}>{it}</Fragment>;
      })}
    </VStack>
  );
};

export const Primitives = () => {
  const singles = single(primitives);

  return (
    <VStack w="100%" spacing={theme.sizes['4']}>
      {spectrum(primitives).map(([k, v]) => (
        <Spectrum key={k} k={k} v={v} type="hex" />
      ))}

      <Flex
        w="100%"
        display="grid"
        gridTemplateColumns={`repeat(${singles.length}, 1fr)`}
        gridColumnGap={theme.sizes['4']}
      >
        {singles.map(([k, v]) => {
          return <Card key={k} label={k} hex={v as string} type="hex" />;
        })}
      </Flex>
    </VStack>
  );
};

/*
export const Roles = () => {
  const { colorMode } = useColorMode();

  return (
    <VStack w="100%" spacing={theme.sizes['4']}>
      {spectrum(theme.colors[colorMode])
        .filter(([k, _]) => ['foreground', 'background', 'border'].includes(k))
        .map(([group, v]) => {
          return (
            <Flex
              key={group}
              w="100%"
              display="grid"
              gridTemplateColumns={`6, 1fr)`}
              gridColumnGap={theme.sizes['4']}
            >
              {Object.entries(v).map(([k, v]) => (
                <Spectrum key={`${group}.${k}`} k={`${group}.${k}`} v={v as Object} type="path" />
              ))}
            </Flex>
          );
        })}
    </VStack>
  );
};
*/

export const Shadows = () => {
  const { colorMode } = useColorMode();

  return (
    <Box
      w="min-content"
      display="grid"
      gap={theme.sizes['16']}
      gridTemplateColumns="repeat(5, 1fr)"
    >
      {Object.entries(theme.colors[colorMode].shadow).map(([k, v]) => {
        return (
          <Center
            key={k}
            bg={theme.colors[colorMode].layer[3].default}
            boxShadow={v}
            w="100px"
            h="100px"
            borderRadius={theme.sizes['2']}
          />
        );
      })}
    </Box>
  );
};
