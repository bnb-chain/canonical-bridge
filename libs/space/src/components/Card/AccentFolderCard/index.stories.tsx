import { StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../../modules/theme';
import { Button } from '../../Button';
import { Space } from '../../Space';

import { COLOR_SCHEMES } from './types';

import {
  AccentFolderCard,
  AccentFolderCardContent,
  AccentFolderCardDescription,
  AccentFolderCardFooter,
  AccentFolderCardTitle,
} from '.';

export default {
  title: 'Components/Molecules/AccentFolderCard',
  component: AccentFolderCard,
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" w="min-content" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  return (
    <Stack w="100%">
      {COLOR_SCHEMES.map((it) => {
        return (
          <AccentFolderCard
            key={it}
            variant="outline"
            colorScheme={it}
            size={{ base: 'sm', md: 'md', lg: 'lg' }}
            w={{ base: '100%', md: '100%', lg: '420px' }}
            h={{ base: '280px', md: '280px', lg: '390px' }}
            alignItems="end"
          >
            <AccentFolderCardContent>
              <Space size="fill" />
              <AccentFolderCardTitle>BNB Chain</AccentFolderCardTitle>
              <AccentFolderCardDescription>This is a description.</AccentFolderCardDescription>
              <AccentFolderCardFooter>
                <Button>Button</Button>
                <Button variant="outline">Button</Button>
              </AccentFolderCardFooter>
            </AccentFolderCardContent>
          </AccentFolderCard>
        );
      })}
    </Stack>
  );
};
