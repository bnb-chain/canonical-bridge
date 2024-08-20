import { StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../../modules/theme';
import { Button } from '../../Button';

import { COLOR_SCHEMES } from './types';

import {
  AccentCard,
  AccentCardContent,
  AccentCardDescription,
  AccentCardFooter,
  AccentCardTitle,
} from '.';

export default {
  title: 'Components/Molecules/AccentCard',
  component: AccentCard,
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" w="min-content" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  return (
    <Stack w="100%">
      {COLOR_SCHEMES.map((it) => {
        return (
          <AccentCard key={it} variant="outline" colorScheme={it}>
            <AccentCardContent>
              <AccentCardTitle>BNB Chain</AccentCardTitle>
              <AccentCardDescription>This is a description.</AccentCardDescription>
              <AccentCardFooter>
                <Button>Button</Button>
                <Button variant="outline">Button</Button>
              </AccentCardFooter>
            </AccentCardContent>
          </AccentCard>
        );
      })}
    </Stack>
  );
};
