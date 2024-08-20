import { Box, BoxProps, DarkMode, Flex, LightMode, useColorMode } from '@chakra-ui/react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useIntl } from 'react-intl';

import { theme } from '../../modules/theme';

import { Footer } from '.';

export default {
  title: 'Components/Organisms/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;

const Container = (props: BoxProps) => {
  const { colorMode } = useColorMode();

  return (
    <Flex flex={1} m={`-${theme.sizes['4']}`} bg={theme.colors[colorMode].background['1']}>
      <Box w="100%" {...props} />
    </Flex>
  );
};

const Template: ComponentStory<typeof Footer> = () => {
  const { locale } = useIntl();

  return (
    <Container>
      <DarkMode>
        <Footer locale={locale} messages={{}} pathname="/" />
      </DarkMode>
      <LightMode>
        <Footer locale={locale} messages={{}} pathname="/" />
      </LightMode>
    </Container>
  );
};

export const Default = Template.bind({});
