import {
  ComponentWithAs,
  forwardRef,
  IconButton as BaseIconButton,
  IconButtonProps,
  useBreakpointValue,
} from '@chakra-ui/react';

import { theme } from '../../modules/theme';
import { STYLES } from '../internal/Button';
import { CLASS_NAMES } from '../constants';

const COMPONENT = theme.components.Button!;
const DEFAULT_PROPS = COMPONENT.defaultProps!;
const SIZES = COMPONENT.sizes!;

const STYLES_ICON = STYLES[CLASS_NAMES.ICON];

export const IconButton: ComponentWithAs<'button', IconButtonProps> = forwardRef<
  IconButtonProps,
  'button'
>(({ size: responsiveSize = DEFAULT_PROPS.size, ...otherProps }, ref) => {
  const size = useBreakpointValue(responsiveSize as any) ?? responsiveSize;

  const styles = SIZES[size as keyof typeof SIZES];

  return (
    <BaseIconButton
      ref={ref}
      w={styles.h}
      h={styles.h}
      minW={styles.h}
      borderRadius={styles.borderRadius}
      {...otherProps}
      sx={{
        [`.${CLASS_NAMES.ICON}`]: {
          ...STYLES_ICON[size as keyof typeof STYLES_ICON],
        },
        ...otherProps.sx,
      }}
    />
  );
});
