import { Box, StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';
import { useMemo } from 'react';

import { theme } from '../../modules/theme';
import { Button } from '../Button';

import { Typewriter } from '.';

export default {
  title: 'Components/Atoms/Typewriter',
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" w="100%" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  return (
    <Stack>
      <Typewriter values={['BNB Smart Chain']} />
      <Typewriter values={['One', 'Two', 'Three']} />
    </Stack>
  );
};

export const Loop = () => {
  return (
    <Stack>
      <Typewriter values={['BNB Smart Chain']} loop />
      <Typewriter values={['One', 'Two', 'Three']} loop />
    </Stack>
  );
};

export const Playground = () => {
  const values = useMemo(() => {
    return ['Mango', 'Pineapple', 'Guava'];
  }, []);

  // Note: Longest value may not be the longest visually since our font isn't monospace.
  const longest = useMemo(() => {
    return values.sort((a, b) => {
      return b.length - a.length;
    })[0];
  }, [values]);

  return (
    <Stack>
      <Button w="min-content">
        <span>I Like</span>
        &nbsp;
        <Box position="relative">
          <Box as="span" visibility="hidden" display="block" h={0}>
            {longest}
          </Box>
          <Typewriter values={values} loop textAlign="left" />
        </Box>
      </Button>
      <Button w="min-content">
        <Box as="span" visibility="hidden" display="block" h={0}>
          I Like Pineapple
        </Box>
        <Typewriter
          position="absolute"
          values={['I Like Mango', 'I Like Pineapple', 'I Like Guava']}
          loop
          ml="auto"
          mr="auto"
        />
      </Button>
    </Stack>
  );
};
