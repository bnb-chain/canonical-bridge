import {
  Button as BaseButton,
  ButtonProps,
  ComponentWithAs,
  forwardRef,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';

import { theme } from '../../modules/theme';
import { STYLES } from '../internal/Button';
import { CLASS_NAMES } from '../constants';
import { Spinner } from '../Spinner';

const COMPONENT = theme.components.Button!;
const DEFAULT_PROPS = COMPONENT.defaultProps!;

const STYLES_BUTTON__ICON = STYLES[CLASS_NAMES.BUTTON__ICON];
const STYLES_ICON = STYLES[CLASS_NAMES.ICON];

export { ButtonRightAddon } from './ButtonRightAddon';

export const Button: ComponentWithAs<'button', ButtonProps> = forwardRef<ButtonProps, 'button'>(
  (
    {
      isLoading,
      size: responsiveSize = DEFAULT_PROPS.size!,
      variant = DEFAULT_PROPS.variant!,
      ...otherProps
    },
    ref,
  ) => {
    const { colorMode } = useColorMode();

    const size = useBreakpointValue(responsiveSize as any) ?? responsiveSize;

    return (
      <BaseButton
        ref={ref}
        isLoading={isLoading}
        size={size}
        variant={variant}
        spinner={<Spinner />}
        {...otherProps}
        sx={{
          [`.${CLASS_NAMES.BUTTON__ICON}`]: {
            ...STYLES_BUTTON__ICON[size as keyof typeof STYLES_BUTTON__ICON],
          },
          [`.${CLASS_NAMES.ICON}`]: {
            ...STYLES_ICON[size as keyof typeof STYLES_ICON],
          },
          ...(isLoading &&
            (variant === 'solid' || variant === 'subtle') && {
              color: `${theme.colors[colorMode].text.on.color.primary} !important`,
            }),
          ...otherProps.sx,
        }}
      />
    );
  },
);
