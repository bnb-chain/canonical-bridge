import {
  ComponentWithAs,
  FormControl as BaseFormControl,
  FormControlProps,
  forwardRef,
} from '@chakra-ui/react';

import { CLASS_NAMES } from '../constants';

export { FormWarningMessage } from './FormWarningMessage';

type Props = FormControlProps & {
  isWarning?: boolean;
};

export const FormControl: ComponentWithAs<'div', Props> = forwardRef<Props, 'div'>(
  ({ isWarning = false, ...otherProps }, ref) => {
    return (
      <BaseFormControl
        ref={ref}
        {...otherProps}
        sx={{
          ...(otherProps.isDisabled && {
            [`.${CLASS_NAMES.FORM__HELPER_TEXT}, .${CLASS_NAMES.FORM__LABEL}`]: {
              opacity: 0.5,
            },
          }),
          ...otherProps.sx,
        }}
      />
    );
  },
);
