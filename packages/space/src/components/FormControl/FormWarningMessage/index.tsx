import {
  ComponentWithAs,
  FormHelperText as BaseFormHelperText,
  FormHelperTextProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { theme } from '../../../modules/theme';

export const FormWarningMessage: ComponentWithAs<'div', FormHelperTextProps> = forwardRef<
  FormHelperTextProps,
  'div'
>((props, ref) => {
  const { colorMode } = useColorMode();

  return <BaseFormHelperText ref={ref} color={theme.colors[colorMode].text.warning} {...props} />;
});
