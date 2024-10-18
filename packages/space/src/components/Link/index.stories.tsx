import { InfoCircleIcon } from '@bnb-chain/icons';
import { Link, StackProps, VStack } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { Typography } from '..';

export default {
  title: 'Components/Atoms/Link',
} as Meta;

const Stack = (props: StackProps) => {
  return <VStack alignItems="start" spacing={theme.sizes['8']} {...props} />;
};

export const Default = () => {
  return (
    <Stack>
      <Link href="#">This is a link</Link>
      <Typography variant="body" size="md">
        <Link href="#">This is a link</Link> inline with text
      </Typography>
      <Link href="#" display="flex" alignItems="center">
        <InfoCircleIcon mr={theme.sizes['1']} />
        This is a link with an icon
      </Link>
    </Stack>
  );
};
