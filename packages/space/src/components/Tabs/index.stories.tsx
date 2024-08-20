import { HStack, StackProps, Tab, TabList, TabProps, Tabs, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { COLOR_SCHEMES } from '../../modules/theme/components/tabs';

const TABS_VARIANTS = ['line', 'outline', 'solid'] as const;
const TABS_SIZES = ['sm', 'md', 'lg', 'xl', '2xl'] as const;
const TABS_COLOR_SCHEMES = COLOR_SCHEMES;

export default {
  title: 'Components/Atoms/Tabs',
} as Meta;

const Stack = (props: StackProps) => {
  return (
    <VStack
      alignItems="start"
      w="min-content"
      spacing={theme.sizes['8']}
      sx={{
        span: {
          w: 'min-content',
        },
      }}
      {...props}
    />
  );
};

export const Default = (props: TabProps) => {
  return (
    <Stack>
      {TABS_COLOR_SCHEMES.map((colorScheme) => {
        return (
          <HStack key={colorScheme} spacing={theme.sizes['10']}>
            {TABS_VARIANTS.map((it) => {
              return (
                <Tabs key={it} colorScheme={colorScheme} variant={it}>
                  <TabList>
                    <Tab {...props}>One</Tab>
                    <Tab>Two</Tab>
                    <Tab>Three</Tab>
                  </TabList>
                </Tabs>
              );
            })}
          </HStack>
        );
      })}
    </Stack>
  );
};

export const Disabled = () => {
  return <Default isDisabled />;
};

export const Sizes = () => {
  return (
    <Stack>
      {TABS_SIZES.map((it) => {
        return (
          <Tabs key={it} size={it}>
            <TabList>
              <Tab>{it}</Tab>
              <Tab>{it}</Tab>
              <Tab>{it}</Tab>
            </TabList>
          </Tabs>
        );
      })}
    </Stack>
  );
};
