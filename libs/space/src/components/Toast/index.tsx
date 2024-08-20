import {
  ComponentWithAs,
  Flex,
  FlexProps,
  ResponsiveValue,
  forwardRef,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';

import { theme } from '../../modules/theme';
import { STATUSES_TO_COLOR_SCHEME, Status } from '../internal/Status';

import { Context } from './context';
import { DEFAULT_PROPS, Variant } from './types';

export { ToastCloseButton } from './ToastCloseButton';
export { ToastContent } from './ToastContent';
export { ToastDescription } from './ToastDescription';
export { ToastDivider } from './ToastDivider';
export { ToastIcon } from './ToastIcon';
export { ToastLeftContent } from './ToastLeftContent';
export { ToastRightContent } from './ToastRightContent';
export { ToastTitle } from './ToastTitle';

type Props = FlexProps & {
  status: ResponsiveValue<Status>;
  variant?: ResponsiveValue<Variant>;
};

export const Toast: ComponentWithAs<'div', Props> = forwardRef<Props, 'div'>(
  (
    { status: responsiveStatus, variant: responsiveVariant = DEFAULT_PROPS.variant, ...props },
    ref,
  ) => {
    const { colorMode } = useColorMode();

    const status: Status = (useBreakpointValue(responsiveStatus as any) ??
      responsiveStatus) as Status;
    const variant: Variant =
      useBreakpointValue(responsiveVariant as any) ?? (responsiveVariant as Variant);

    return (
      <Context.Provider value={{ status }}>
        <Flex
          ref={ref}
          bg={theme.colors[colorMode].layer[3].default}
          color={theme.colors[colorMode].text.primary}
          borderRadius={theme.sizes['2']}
          overflow="hidden"
          {...(variant === 'left-accent' && {
            boxShadow: `-${theme.sizes['1']} ${theme.sizes['0']} ${theme.sizes['0']} ${
              theme.sizes['0']
            } ${theme.colors[colorMode].support[STATUSES_TO_COLOR_SCHEME[status]][4]}, ${
              theme.colors[colorMode].shadow[2]
            }`,
          })}
          {...(variant === 'bottom-accent' && {
            boxShadow: `${theme.sizes['0']} ${theme.sizes['1']} ${theme.sizes['0']} ${
              theme.sizes['0']
            } ${theme.colors[colorMode].support[STATUSES_TO_COLOR_SCHEME[status]][4]}, ${
              theme.colors[colorMode].shadow[2]
            }`,
            mb: theme.sizes['1'],
          })}
          {...props}
        />
      </Context.Provider>
    );
  },
);
