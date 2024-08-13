import {
  ComponentWithAs,
  Flex,
  FlexProps,
  SystemProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { theme } from '../../modules/theme';

import { Context } from './context';

export { TimelineConnector } from './TimelineConnector';
export { TimelineContent } from './TimelineContent';
export { TimelineItem } from './TimelineItem';
export { TimelineMarker } from './TimelineMarker';

type Props = FlexProps & {
  orientation: 'horizontal' | 'vertical';
  size?: SystemProps['flexBasis'] | 'fill';
};

export const Timeline: ComponentWithAs<'div', Props> = forwardRef<Props, 'div'>(
  ({ orientation, size, ...props }, ref) => {
    const { colorMode } = useColorMode();

    return (
      <Context.Provider value={{ orientation, size }}>
        <Flex
          ref={ref}
          borderColor={theme.colors[colorMode].border[3]}
          flexDirection={orientation === 'horizontal' ? 'row' : 'column'}
          w="100%"
          h="100%"
          {...props}
        />
      </Context.Provider>
    );
  },
);
