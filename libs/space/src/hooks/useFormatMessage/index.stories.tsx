import { useColorMode } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { Typography } from '../../components';
import { theme } from '../../modules/theme';

import { useFormatMessage } from '.';

export default {
  title: 'Hooks/useFormatMessage',
} as Meta;

export const Default = () => {
  const { colorMode } = useColorMode();
  const { formatMessage } = useFormatMessage();

  return (
    <Typography
      variant="heading"
      size="md"
      fontWeight="700"
      sx={{
        span: {
          fontWeight: '700',
          color: theme.colors[colorMode].text.brand,
        },
      }}
    >
      {formatMessage({ id: 'internal.use-format-message' })}
    </Typography>
  );
};
