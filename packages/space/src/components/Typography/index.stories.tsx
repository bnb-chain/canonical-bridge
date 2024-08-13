import { ComponentWithAs, Flex } from '@chakra-ui/react';
import { ComponentStory, Meta } from '@storybook/react';

import { theme } from '../../modules/theme';

import { Props } from './types';

import { TYPOGRAPHY_STYLES, Typography } from '.';

export default {
  title: 'Foundations/Typography',
  component: Typography,
} as Meta;

// const formatSize = (value: string) => {
//   return +value.replace('rem', '') * 4 * 4;
// };

const Template: ComponentStory<typeof Typography> = () => {
  return (
    <Flex flexDirection="column" alignItems="stretch">
      {Object.entries(TYPOGRAPHY_STYLES).map(([k, v]) => {
        const sizes = TYPOGRAPHY_STYLES[k as keyof typeof TYPOGRAPHY_STYLES];

        return Object.keys(v).map((it) => {
          // const css = sizes[it as keyof typeof sizes];
          // const fontFamily = css.fontFamily;
          // const letterSpacing = (css as any).letterSpacing?.replace('em', '');

          return (
            <Typography
              key={`${k}.${it}`}
              variant={k as keyof typeof TYPOGRAPHY_STYLES}
              size={it as keyof typeof sizes}
              p={theme.sizes['4']}
            >
              {k}
              &nbsp;
              {it}
            </Typography>
          );
        });
      })}
    </Flex>
  );
};

export const Default: ComponentStory<ComponentWithAs<'p', Props>> = Template.bind({});
