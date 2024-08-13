import { Center, Text, useColorMode, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
// Don't use theme sizes as it includes Chakra UI's defaults.
import { sizes } from '../../modules/theme/foundations/sizes';

export default {
  title: 'Foundations/Size',
} as Meta;

const Template = () => {
  const { colorMode } = useColorMode();

  return (
    <VStack w="100%" alignItems="stretch" spacing={theme.sizes['10']}>
      {Object.entries(sizes)
        .sort((a, b) => +a[0] - +b[0])
        .map(([k, v]) => (
          <Center key={k} bg={theme.colors[colorMode].background[2]} w="100%" h={v}>
            <Text fontSize={theme.fontSizes['3']}>{v}</Text>
          </Center>
        ))}
    </VStack>
  );
};
export const Default = Template.bind({});
