import { Box, BoxProps, DarkMode, Flex, LightMode, useColorMode } from '@chakra-ui/react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { theme } from '../../modules/theme';

import { Header } from '.';

export default {
  title: 'Components/Organisms/Header',
  component: Header,
} as ComponentMeta<typeof Header>;

const Container = (props: BoxProps) => {
  const { colorMode } = useColorMode();

  return (
    <Flex flex={1} mx={`-${theme.sizes['4']}`} bg={theme.colors[colorMode].background['1']}>
      <Box w="100%" {...props} />
    </Flex>
  );
};

const Template: ComponentStory<typeof Header> = () => {
  return (
    <>
      <Container mt={`-${theme.sizes['4']}`}>
        <DarkMode>
          <Header />
        </DarkMode>
      </Container>
      <Container>
        <LightMode>
          <Header messages={{ 'header.developers.title': '开发者' }} />
        </LightMode>
      </Container>
    </>
  );
};

export const Default = Template.bind({});
